import React, { useEffect, useMemo, useState } from "react";
import * as turf from '@turf/turf';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from "ol/layer/Vector";
import { useDispatch, useSelector } from "react-redux";
import {
    getGridConfig,
    getLayers,
    EGridsRenderMethods,
    setIntersectingGridFeatures
} from "../../../../redux";
import { useMapContext } from "../../../map";
import { createColorArray, getInterimColor } from "../../layers-utils";
import { geoJsonPolygon } from "../vector-layers-types";
import { splitGridCell } from "./grid-utils";
import { useGridContext } from "./grid-context";

export const SpeciesGridsOverlapLayer = React.memo(() => {
    const layers = useSelector(getLayers);
    const config = useSelector(getGridConfig);
    const dispatch = useDispatch();
    const { setOverlapFeatures } = useGridContext();
    const [gridFeatures, setGridFeatures] = useState<Feature<Polygon>[]>([]);
    const { map } = useMapContext();
    const projection = map.getView().getProjection().getCode();
    const isQuantities = config.method === EGridsRenderMethods.QUANTITY;

    useEffect(() => {
        if (layers[0].gridCells.length && layers[1].gridCells.length &&
            (layers[2] ? layers[2].gridCells.length : true) &&
            (layers[3] ? layers[3].gridCells.length : true)
        ) {
            const allFeatures: geoJsonPolygon[] = [];
            layers.forEach((lyr) => allFeatures.push(...lyr.gridCells));

            /*
                having pushed all layers features into single array 
                we need to remove duplicates in location
            */
            const uniqueCoordinates = new Set();
            const uniqueFeatures = allFeatures.filter((feature) => {
                const coordinatesKey = JSON.stringify(feature.geometry.coordinates);
                if (uniqueCoordinates.has(coordinatesKey)) {
                    return false;
                } else {
                    uniqueCoordinates.add(coordinatesKey);
                    return true;
                }
            });

            const intersectingFeatures: geoJsonPolygon[] = [];

            uniqueFeatures.forEach((cell) => {
                const intersectingFeature = layers[0].gridCells.find(
                    (f) => turf.booleanContains(f, cell));

                const intersectingFeature1 = layers[1].gridCells.find(
                    (f) => turf.booleanContains(f, cell));

                const intersectingFeature2 = layers[2] ?
                    layers[2].gridCells.find(
                        (f) => turf.booleanContains(f, cell))
                    : false;

                const intersectingFeature3 = layers[3] ?
                    layers[3].gridCells.find(
                        (f) => turf.booleanContains(f, cell))
                    : false;

                const isFeaturesIntersect = [
                    intersectingFeature,
                    intersectingFeature1,
                    intersectingFeature2,
                    intersectingFeature3,
                ];
                const trueConditions = isFeaturesIntersect.filter(Boolean);
                /*
                    if at least 2 features overlap,
                    all their properties need to be combined
                */
                if (trueConditions.length >= 2) {
                    const combinedProperties = {
                        species1: intersectingFeature ? intersectingFeature.properties!.species : null,
                        density1: intersectingFeature ? intersectingFeature.properties!.density : null,
                        species2: intersectingFeature1 ? intersectingFeature1.properties!.species : null,
                        density2: intersectingFeature1 ? intersectingFeature1.properties!.density : null,
                        species3: intersectingFeature2 ? intersectingFeature2.properties!.species : null,
                        density3: intersectingFeature2 ? intersectingFeature2.properties!.density : null,
                        species4: intersectingFeature3 ? intersectingFeature3.properties!.species : null,
                        density4: intersectingFeature3 ? intersectingFeature3.properties!.density : null,
                    }
                    intersectingFeatures.push({ ...cell, properties: combinedProperties });
                }
            });

            const polygons: geoJsonPolygon[] = [];
            let sumArea = 0;

            intersectingFeatures.forEach((feature) => {
                sumArea += turf.area(feature);
                const coords = feature.geometry.coordinates[0];
                const centroid = turf.centroid(feature).geometry.coordinates;
                //@ts-ignore
                const { species1, species2, species3, density1, density2, density3, species4, density4 } = feature.properties;
                const speciesValues = [species1, species2, species3, species4].filter(el => el);
                const densities = [density1, density2, density3, density4].filter(el => el);
                /*
                    sorting densities in descending order
                    while keeping logical connection to species array
                */
                const combinedArray = speciesValues.map((species, index) => (
                    { species, density: densities[index] }
                ));
                combinedArray.sort((a, b) => b.density - a.density);
                speciesValues.forEach((_, index) => {
                    speciesValues[index] = combinedArray[index].species;
                });
                densities.sort((a, b) => b - a);

                const cellData = {
                    species: speciesValues,
                    densities: densities,
                };

                const splitPolygons = splitGridCell(
                    config.type,
                    coords,
                    centroid,
                    cellData);
                polygons.push(...splitPolygons);
            });

            setOverlapFeatures(polygons);

            const gridFeatures = polygons.map((poly) => {
                return new Feature({
                    geometry: new Polygon(poly.geometry.coordinates).transform("EPSG:4326", projection),
                    Species: poly.properties!.species,
                    Count: poly.properties!.count,
                });
            });

            setGridFeatures(gridFeatures);
            dispatch(setIntersectingGridFeatures({
                area: sumArea,
                count: intersectingFeatures.length,
            }));
        }
    }, [layers, projection])

    const gradients = layers.map((lyr) => lyr.gradient);
    const allColors: number[][][] = [];
    gradients.forEach((gradient, index) => {
        const colors = Object.values(gradient).map((hex) => {
            return createColorArray(hex, layers[index].opacity);
        });
        allColors.push(colors);
    });

    const style = layers.map((layer, idx) => (
        {
            filter: ['==', ['get', 'Species', 'number'], layer.value],
            style: {
                'stroke-color': [0, 0, 0, layer.opacity],
                'stroke-width': 0.5,
                'fill-color': isQuantities ? [
                    'interpolate',
                    ['linear'],
                    ['get', 'Count', 'number'],
                    1, allColors[idx][0],
                    5, getInterimColor(allColors[idx][0], allColors[idx][1], layer.opacity),
                    10, allColors[idx][1],
                    15, getInterimColor(allColors[idx][1], allColors[idx][2], layer.opacity),
                    20, allColors[idx][2],
                ] : createColorArray(layer.color, layer.opacity),
            }
        }
    ));

    const source = useMemo(() => (
        new VectorSource({ features: gridFeatures })
    ), [gridFeatures]);

    const layer = useMemo(() => (
        new VectorLayer({
            source: source,
            zIndex: 10,
            style: style.filter(el => Boolean(el)),
        })
    ), [source, style]);


    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer])

    return null;

})