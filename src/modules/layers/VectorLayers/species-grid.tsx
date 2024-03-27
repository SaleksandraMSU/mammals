import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type {
    Feature as GeoJsonFeature,
    Point as GeoJsonPoint,
    Polygon as GeoJsonPolygon,
    FeatureCollection,
    GeoJsonProperties,
} from "geojson";
import Layer from 'ol/layer/Layer.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { fromLonLat, transform } from 'ol/proj';
import * as turf from '@turf/turf';
import { useEffect, useMemo } from 'react';
import { Feature } from 'ol';
import { Geometry, Point, Polygon } from 'ol/geom';
import { useMapContext } from '../../map/map-context';
import { useFeaturesContext } from '../features-context';
import { EDisplayTypes, EGridsRenderMethods, IGradientConfig, getDisplayMethod, getFiltersState, getGridConfig, getIsDisplayMethodChange, getLayers, getZoomConfig, updateDefaultLayer, updateSpeciesLayer } from '../../../redux';
import { getInterimColor, hexToRgb } from "../layers-utils";
import { VectorLayerMix } from "./vector-layer-mix";
import { PROJECTION_STR } from "../../map/projection";

type TSpeciesGridProps = {
    speciesVal?: number;
    title?: string;
    grid: FeatureCollection<GeoJsonPolygon, GeoJsonProperties>
    opacity: number;
    gradient: IGradientConfig;
    color: string;
}

export const SpeciesGrid = React.memo(({ speciesVal, title, opacity, gradient, color, grid }: TSpeciesGridProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const dispatch = useDispatch();
    const config = useSelector(getGridConfig);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const zoom = useSelector(getZoomConfig);
    const [gridFeats, setGridFeats] = useState<Feature<Geometry>[]>([]);
    const [featuresOutOfCells, setFeaturesOutOfCells] = useState<Feature<Point>[]>([]);

    const isQuantities = config.method === EGridsRenderMethods.QUANTITY;

    useEffect(() => {
        const cellsWithData: GeoJsonFeature<GeoJsonPolygon, GeoJsonProperties>[] = [];
        const filtered = features.filter((f) => {
            return (
                speciesVal ? f.get('species') === speciesVal : true
            )
        })

        const projectedFeatures = filtered.map((feat) => {
            const coords = feat.getGeometry()?.getCoordinates()
            const transformedCoords = transform(coords!, PROJECTION_STR, "EPSG:4326");
            const transformedGeometry = new Point(transformedCoords);
            const transformedFeature = new Feature({
                geometry: transformedGeometry,
            });
            return transformedFeature;
        })

        const collection = new GeoJSON().writeFeaturesObject(projectedFeatures) as FeatureCollection<GeoJsonPoint, GeoJsonProperties>;
        // const projected = turf.toWgs84(collection, { mutate: true }) as FeatureCollection<GeoJsonPoint, GeoJsonProperties>
        const speciesBBox = turf.bbox(collection);
        const speciesBBoxPolygon = turf.bboxPolygon(speciesBBox);
        const pointFeatures: Feature<Point>[] = [];
        const densityGrid = grid.features.map((cell) => {
            //@ts-ignore
            if (turf.booleanIntersects(cell, speciesBBoxPolygon)) {
                let count = 0;
                try {
                    const pointsWithin = turf.pointsWithinPolygon(collection, cell).features as GeoJsonFeature<GeoJsonPoint, GeoJsonProperties>[]
                    count = pointsWithin.length;
                    if (count > 0) {
                        cellsWithData.push({ ...cell, properties: { density: count, species: speciesVal } });
                    }
                    if (count === 1) {
                        const features = pointsWithin.map((f) => new Feature({
                            geometry: new Point(f.geometry.coordinates).transform("EPSG:4326", PROJECTION_STR),
                            ...f.properties
                        }))
                        pointFeatures.push(...features);
                    }
                }
                catch (e) {
                    console.log(e)
                }
                return { ...cell, properties: { density: count } };
            } else {
                return null;
            }
        });

        const gridFeatures = densityGrid
            .filter((el) => el)
            .map((cell) => {
                return new Feature({
                    geometry: new Polygon(cell!.geometry.coordinates).transform("EPSG:4326", PROJECTION_STR),
                    Count: cell!.properties!.density
                });
            });
        if (speciesVal) {
            dispatch(updateSpeciesLayer({ title: title!, prop: 'cellsStats', value: cellsWithData }));
        } else {
            dispatch(updateDefaultLayer({ 'cellsStats': cellsWithData }));
        }
        setGridFeats(gridFeatures);
        setFeaturesOutOfCells(pointFeatures);
    }, [
        features,
        grid
    ])

    const colors = Object.values(gradient).map((hex) => {
        const color = hexToRgb(hex);
        color.push(opacity);
        return color;
    });

    const style = {
        'stroke-color': ['color', 0, 0, 0, opacity],
        'stroke-width': 0.5,
        'fill-color': isQuantities ? [
            'interpolate',
            ['linear'],
            ['get', 'Count', 'number'],
            1, colors[0],
            5, getInterimColor(colors[0], colors[1], opacity),
            10, colors[1],
            15, getInterimColor(colors[1], colors[2], opacity),
            20, colors[2],
        ] : color,
        filter: displayMethod === EDisplayTypes.MIX ? [">", ['get', 'Count', 'number'], 1] : [">", ['get', 'Count', 'number'], 0],
    };

    class WebGLLayer extends Layer {
        createRenderer(): any {
            return new WebGLVectorLayerRenderer(this, {
                style,
            });
        }
    };

    const source = useMemo(() => (
        new VectorSource({ features: gridFeats })
    ), [gridFeats])

    const layer = useMemo(() => (
        new WebGLLayer({
            source: source,
            zIndex: 1,
            visible: isDisplayChangeActive ?
                (displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX)
                : true,
        })
    ), [style, source, config])


    useEffect(() => {
        map.addLayer(layer);
        !isDisplayChangeActive && layer.setMaxZoom(zoom.change);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer, isDisplayChangeActive]);

    const renderPointsLayers = () => {
        if (displayMethod === EDisplayTypes.MIX) {
            return (
                <VectorLayerMix
                    features={featuresOutOfCells}
                    opacity={opacity}
                    color={color}
                />
            )
        }
    }

    return (
        <>
            {renderPointsLayers()}
        </>
    )
})