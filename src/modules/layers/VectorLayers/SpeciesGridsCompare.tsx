import type {
    Feature,
    Geometry,
    Polygon,
    GeoJsonProperties,
} from "geojson";
import React, { useEffect, useMemo, useState } from "react";
import * as turf from '@turf/turf';
import { Feature as OlFeature } from 'ol';
import { Polygon as OlPolygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector.js';
import Layer from 'ol/layer/Layer.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { useSelector } from "react-redux";
import {
    getDefaultLayer,
    getGridConfig,
    getIsZeroFilters,
    getLayers,
    EDisplayTypes,
    getDisplayMethod,
    getIsDisplayMethodChange,
    EGridsRenderMethods
} from "../../../redux";
import { useMapContext } from "../../map/map-context";
import VectorLayer from "ol/layer/Vector";
import { splitGridCell } from "./grid-utils";
import { getInterimColor, hexToRgb } from "../layers-utils";
import { PROJECTION_STR } from "../../map/projection";

type geoJsonPolygon = Feature<Polygon, GeoJsonProperties>;

// type TSpeciesGridsCorrelationProps = {
//     layer1Features: geoJsonPoint[],
//     layer2Features: geoJsonPoint[],
//     layer3Features: geoJsonPoint[],
// };

// type TLayer = {
//     value: number,
//     count: number,
//     cells: Feature<Polygon, GeoJsonProperties>[]
// }

export const SpeciesGridsCorrelation = React.memo(() => {

    const layers = useSelector(getLayers);
    const config = useSelector(getGridConfig);
    const [gridFeatures, setGridFeatures] = useState<OlFeature<OlPolygon>[]>([])
    const { map } = useMapContext();

    const isQuantities = config.method === EGridsRenderMethods.QUANTITY;

    useEffect(() => {
        if (layers[0].cellsStats.length && layers[1].cellsStats.length &&
            (layers[2] ? layers[2].cellsStats.length : true) &&
            (layers[3] ? layers[3].cellsStats.length : true)
        ) {
            const allFeatures: geoJsonPolygon[] = [];
            layers.forEach((lyr) => allFeatures.push(...lyr.cellsStats));
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
                const intersectingFeature = layers[0].cellsStats.find((f) => turf.booleanContains(f, cell))
                const intersectingFeature1 = layers[1].cellsStats.find((f) => turf.booleanContains(f, cell))
                const intersectingFeature2 = layers[2] ? layers[2].cellsStats.find((f) => turf.booleanContains(f, cell)) : false
                const intersectingFeature3 = layers[3] ? layers[3].cellsStats.find((f) => turf.booleanContains(f, cell)) : false
                
                const isFeaturesIntersect = [
                    intersectingFeature,
                    intersectingFeature1,
                    intersectingFeature2,
                    intersectingFeature3,
                ];
                const trueConditions = isFeaturesIntersect.filter(Boolean);
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
                const rearrangedCoords = [coords[2], coords[1], coords[0], coords[5], coords[4], coords[3], coords[2]]
                const centroid = turf.centroid(feature).geometry.coordinates;

                //@ts-ignore
                const { species1, species2, species3, density1, density2, density3, species4, density4 } = feature.properties;
                const speciesValues = [species1, species2, species3, species4].filter(el => el);
                const densities = [density1, density2, density3, density4].filter(el => el);
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
                    rearrangedCoords,
                    centroid,
                    cellData);
                polygons.push(...splitPolygons);
            })

            const gridFeatures = polygons.map((poly) => {
                return new OlFeature({
                    geometry: new OlPolygon(poly.geometry.coordinates).transform("EPSG:4326", PROJECTION_STR),
                    Species: poly.properties!.species,
                    Count: poly.properties!.count,
                });
            });

            setGridFeatures(gridFeatures)
        }
    }, [layers])

    const source = useMemo(() => (
        new VectorSource({ features: gridFeatures })
    ), [gridFeatures])

    const gradients = layers.map((lyr) => lyr.gradient)
    const allColors: number[][][] = []
    gradients.forEach((gradient, index) => {
        const colors = Object.values(gradient).map((hex) => {
            const color = hexToRgb(hex);
            color.push(layers[index].opacity);
            return color;
        });
        allColors.push(colors)
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
        ] : layers[2].color,
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
        ] : layers[3].color,
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
            ] : layers[0].color,
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
            ] : layers[1].color,
        },
    ];

    useEffect(() => {
        if (layers[3]) {
            style.push(thirdLayerStyle)
        }
        if (layers[4]) {
            style.push(fourthLayerStyle)
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