import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Layer from 'ol/layer/Layer.js';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { transform } from 'ol/proj';
import * as turf from '@turf/turf';
import {
    EDisplayTypes,
    EGridsRenderMethods,
    IGradientConfig,
    getDisplayMethod,
    getGridConfig,
    getIsDisplayMethodChange,
    getZoomConfig,
    updateDefaultLayer,
    updateSpeciesLayer
} from '../../../../redux';
import { useMapContext } from '../../../map/map-context';
import { useFeaturesContext } from '../../features-context';
import { createColorArray, getInterimColor } from "../../layers-utils";
import type {
    geoJsonPoint,
    geoJsonPolygon,
    pointFeatureCollection,
    polygonFeatureCollection
} from "../vector-layers-types";
import { VectorLayerMix } from "../vector-layer-mix";
import { useGridContext } from "./grid-context";


type TSpeciesGridProps = {
    speciesVal?: number;
    title?: string;
    grid: polygonFeatureCollection;
    opacity: number;
    gradient: IGradientConfig;
    color: string;
}

export const SpeciesGrid = React.memo((
    { speciesVal, title, opacity, gradient, color, grid }: TSpeciesGridProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const { overlapFeatures } = useGridContext();
    const dispatch = useDispatch();
    const config = useSelector(getGridConfig);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const zoom = useSelector(getZoomConfig);
    const [gridFeats, setGridFeats] = useState<Feature<Polygon>[]>([]);
    const [featuresOutOfCells, setFeaturesOutOfCells] = useState<Feature<Point>[]>([]);
    const projection = map.getView().getProjection().getCode();
    const isQuantities = config.method === EGridsRenderMethods.QUANTITY;

    useEffect(() => {
        const cellsWithData: geoJsonPolygon[] = [];
        const filtered = features.filter((f) => {
            return (
                speciesVal ? f.get('species') === speciesVal : true
            )
        });

        const projectedFeatures = filtered.map((feat) => {
            const coords = feat.getGeometry()?.getCoordinates()
            const transformedCoords = transform(coords!, projection, "EPSG:4326");
            const transformedGeometry = new Point(transformedCoords);
            const transformedFeature = new Feature({
                geometry: transformedGeometry,
            });
            return transformedFeature;
        })

        const collection = new GeoJSON().writeFeaturesObject(projectedFeatures) as pointFeatureCollection;
        const speciesBBox = turf.bbox(collection);
        const speciesBBoxPolygon = turf.bboxPolygon(speciesBBox);
        const pointFeatures: Feature<Point>[] = [];
        const densityGrid = grid.features.map((cell) => {
            //@ts-ignore
            if (turf.booleanIntersects(cell, speciesBBoxPolygon)) {
                let count = 0;
                try {
                    const pointsWithin = turf.pointsWithinPolygon(collection, cell).features as geoJsonPoint[]
                    count = pointsWithin.length;
                    // for statistics calculation
                    if (count > 0) {
                        cellsWithData.push({ ...cell, properties: { density: count, species: speciesVal } });
                    }
                    // for mix display
                    if (count === 1) {
                        const features = pointsWithin.map((f) => new Feature({
                            geometry: new Point(f.geometry.coordinates).transform("EPSG:4326", projection),
                            ...f.properties
                        }))
                        pointFeatures.push(...features);
                    }
                }
                catch (e) {
                    console.log(e);
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
                    geometry:
                        new Polygon(cell!.geometry.coordinates)
                            .transform("EPSG:4326", projection),
                    Count: cell!.properties!.density
                });
            });
        if (speciesVal) {
            dispatch(updateSpeciesLayer({
                title: title!,
                prop: 'cellsStats',
                value: cellsWithData
            }));
        } else {
            dispatch(updateDefaultLayer({ 'cellsStats': cellsWithData }));
        }
        setGridFeats(gridFeatures);
        setFeaturesOutOfCells(pointFeatures);
    }, [
        features,
        grid,
        projection,
    ]);

    const colors = Object.values(gradient).map((hex) => {
        return createColorArray(hex, opacity);
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
        ] : createColorArray(color, opacity),
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
    ), [gridFeats]);

    useEffect(() => {
        if (overlapFeatures.length) {
            const featsToKeep = gridFeats.filter((cell) => {
                const geometry = cell.getGeometry();
                if (!geometry) return false;
                const reprojectedCell = geometry.clone().transform(projection, "EPSG:4326");
                const geoJsonCell = turf.polygon(reprojectedCell.getCoordinates());
                const cond = overlapFeatures.some((feat) =>
                    turf.booleanContains(geoJsonCell, feat)
                );
                return !cond;
            });

            if (featsToKeep.length !== gridFeats.length) {
                setGridFeats(featsToKeep);
            }
        }
    }, [overlapFeatures, projection]);

    const layer = useMemo(() => (
        new WebGLLayer({
            source: source,
            zIndex: 1,
            visible: isDisplayChangeActive ?
                (displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX)
                : true,
        })
    ), [style, source, config]);


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
    };

    return (
        <>
            {renderPointsLayers()}
        </>
    )
})