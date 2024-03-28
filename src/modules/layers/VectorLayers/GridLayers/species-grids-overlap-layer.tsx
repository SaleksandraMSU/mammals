import React, { useEffect, useMemo, useState } from "react";
import * as turf from '@turf/turf';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector.js';
import Layer from 'ol/layer/Layer.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { useSelector } from "react-redux";
import {
    getGridConfig,
    getLayers,
    EGridsRenderMethods
} from "../../../../redux";
import { useMapContext } from "../../../map";
import { createColorArray, getInterimColor } from "../../layers-utils";
import { geoJsonPolygon } from "../vector-layers-types";
import { splitGridCell } from "./grid-utils";
import { useGridContext } from "./grid-context";

export const SpeciesGridsOverlapLayer = React.memo(() => {
    const layers = useSelector(getLayers);
    const config = useSelector(getGridConfig);
    const { setOverlapFeatures } = useGridContext();
    const [gridFeatures, setGridFeatures] = useState<Feature<Polygon>[]>([])
    const { map } = useMapContext();
    const projection = map.getView().getProjection().getCode();
    const isQuantities = config.method === EGridsRenderMethods.QUANTITY;

    useEffect(() => {
        if (layers[0].cellsStats.length && layers[1].cellsStats.length &&
            (layers[2] ? layers[2].cellsStats.length : true) &&
            (layers[3] ? layers[3].cellsStats.length : true)
        ) {
            const allFeatures: geoJsonPolygon[] = [];
            layers.forEach((lyr) => allFeatures.push(...lyr.cellsStats));

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
                const intersectingFeature = layers[0].cellsStats.find(
                    (f) => turf.booleanContains(f, cell));

                const intersectingFeature1 = layers[1].cellsStats.find(
                    (f) => turf.booleanContains(f, cell));

                const intersectingFeature2 = layers[2] ?
                    layers[2].cellsStats.find(
                        (f) => turf.booleanContains(f, cell))
                    : false;

                const intersectingFeature3 = layers[3] ?
                    layers[3].cellsStats.find(
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
                    we need to combine all their properties
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

            const polygons: geoJsonPolygon[] = []

            intersectingFeatures.forEach((feature) => {
                const coords = feature.geometry.coordinates[0];
                const centroid = turf.centroid(feature).geometry.coordinates;
                //@ts-ignore
                const { species1, species2, species3, density1, density2, density3, species4, density4 } = feature.properties;
                const speciesValues = [species1, species2, species3, species4].filter(el => el);
                const densities = [density1, density2, density3, density4].filter(el => el);
                /*
                    we need to sort densities in descending order
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
            })

            setOverlapFeatures(polygons);

            const gridFeatures = polygons.map((poly) => {
                return new Feature({
                    geometry: new Polygon(poly.geometry.coordinates).transform("EPSG:4326", projection),
                    Species: poly.properties!.species,
                    Count: poly.properties!.count,
                });
            });

            setGridFeatures(gridFeatures);
        }
    }, [layers, projection])

    const source = useMemo(() => (
        new VectorSource({ features: gridFeatures })
    ), [gridFeatures]);

    const gradients = layers.map((lyr) => lyr.gradient);
    const allColors: number[][][] = [];
    gradients.forEach((gradient, index) => {
        const colors = Object.values(gradient).map((hex) => {
            return createColorArray(hex, layers[index].opacity);
        });
        allColors.push(colors);
    })


    const thirdLayerStyle = layers[2] && {
        filter: ['==', ['get', 'Species', "number"], layers[2].value],
        'stroke-color': ['color', 0, 0, 0, layers[2].opacity],
        'stroke-width': 0,
        'fill-color': isQuantities ? [
            'interpolate',
            ['linear'],
            ['get', 'Count', 'number'],
            1, allColors[2][0],
            5, getInterimColor(allColors[2][0], allColors[2][1], layers[2].opacity),
            10, allColors[2][1],
            15, getInterimColor(allColors[2][1], allColors[2][2], layers[2].opacity),
            20, allColors[2][2],
        ] : createColorArray(layers[2].color, layers[2].opacity),
    };

    const fourthLayerStyle = layers[3] && {
        filter: ['==', ['get', 'Species', "number"], layers[3].value],
        'stroke-color': ['color', 0, 0, 0, layers[3].opacity],
        'stroke-width': 0,
        'fill-color': isQuantities ? [
            'interpolate',
            ['linear'],
            ['get', 'Count', 'number'],
            1, allColors[3][0],
            5, getInterimColor(allColors[3][0], allColors[3][1], layers[3].opacity),
            10, allColors[3][1],
            15, getInterimColor(allColors[3][1], allColors[3][2], layers[3].opacity),
            20, allColors[3][2],
        ] : createColorArray(layers[3].color, layers[3].opacity),
    };

    const style = [
        {
            filter: ['==', ['get', 'Species', 'number'], layers[0].value],
            'stroke-color': ['color', 0, 0, 0, layers[0].opacity],
            'stroke-width': 0.5,
            'fill-color': isQuantities ? [
                'interpolate',
                ['linear'],
                ['get', 'Count', 'number'],
                1, allColors[0][0],
                5, getInterimColor(allColors[0][0], allColors[0][1], layers[0].opacity),
                10, allColors[0][1],
                15, getInterimColor(allColors[0][1], allColors[0][2], layers[0].opacity),
                20, allColors[0][2],
            ] : createColorArray(layers[0].color, layers[0].opacity),
        },
        {
            filter: ['==', ['get', 'Species', 'number'], layers[1].value],
            'stroke-color': ['color', 0, 0, 0, layers[1].opacity],
            'stroke-width': 0.5,
            'fill-color': isQuantities ? [
                'interpolate',
                ['linear'],
                ['get', 'Count', 'number'],
                1, allColors[1][0],
                5, getInterimColor(allColors[1][0], allColors[1][1], layers[1].opacity),
                10, allColors[1][1],
                15, getInterimColor(allColors[1][1], allColors[1][2], layers[1].opacity),
                20, allColors[1][2],
            ] : createColorArray(layers[1].color, layers[1].opacity),
        },
    ];

    useEffect(() => {
        if (layers[3]) {
            style.push(thirdLayerStyle);
        }
        if (layers[4]) {
            style.push(fourthLayerStyle);
        }
    }, [layers])


    class WebGLLayer extends Layer {
        createRenderer(): any {
            return new WebGLVectorLayerRenderer(this, {
                style,
            });
        }
    };

    const layer = useMemo(() => (
        new WebGLLayer({
            source: source,
            zIndex: 10,
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