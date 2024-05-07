import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Layer from 'ol/layer/Layer.js';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { transform } from 'ol/proj';
import VectorLayer from "ol/layer/Vector";
import * as turf from '@turf/turf';
import {
    EDisplayTypes,
    EGridsRenderMethods,
    IFiltersState,
    IGradientConfig,
    getDisplayMethod,
    getFiltersState,
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
    filters?: IFiltersState | undefined;
};

export const SpeciesGrid = React.memo((
    { speciesVal, title, opacity, gradient, color, grid, filters }: TSpeciesGridProps) => {
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
    let {
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);


    museum = filters ? filters.museum : museum;
    months = filters ? filters.months : months;
    dateRange = filters ? filters.dateRange : dateRange;
    determinationMethod = filters ? filters.determinationMethod : determinationMethod;
    isReliable = filters ? filters.isReliable : isReliable;
    const species = filters ? filters.species[0] : speciesVal;


    useEffect(() => {
        const cellsWithData: geoJsonPolygon[] = [];
        const filtered = features.filter((f) => {
            return (
                (species ? f.get('species') === species : true) &&
                (museum.length > 0 ? museum.includes(f.get('genesis_da')) : true) &&
                f.get('year') >= dateRange[0] && f.get('year') <= dateRange[1] &&
                (months.length > 0 ? months.includes(f.get('month')) : true) &&
                (determinationMethod.length > 0 ? determinationMethod.includes(f.get('determ')) : true) &&
                (isReliable ? f.get('quality') === 3 : true)
            )
        });

        const projectedFeatures = filtered.map((feat) => {
            const coords = feat.getGeometry()?.getCoordinates()
            const transformedCoords = transform(coords!, projection, "EPSG:4326");
            const transformedGeometry = new Point(transformedCoords);
            const props = feat.getProperties();
            delete props["geometry"];
            const transformedFeature = new Feature({
                geometry: transformedGeometry,
                ...props
            });
            return transformedFeature;
        })

        const collection = new GeoJSON().writeFeaturesObject(projectedFeatures) as pointFeatureCollection;
        const speciesBBox = turf.bbox(collection);
        const speciesBBoxPolygon = turf.bboxPolygon(speciesBBox);
        const pointFeatures: Feature<Point>[] = [];
        //@ts-ignore
        const clippedGrid = grid.features.filter((cell) => turf.booleanIntersects(cell, speciesBBoxPolygon));
        const densityGrid = clippedGrid.map((cell) => {
            let count = 0;
            try {
                const pointsWithin = turf.pointsWithinPolygon(collection, cell).features as geoJsonPoint[]
                count = pointsWithin.length;
                // for statistics calculation
                if (count > 0 && (displayMethod !== EDisplayTypes.MIX || count > 1)) {
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
            const calculated = count > 0 ? { ...cell, properties: { density: count } } : null;
            return calculated;
        });

        const gridFeatures = densityGrid
            .filter(el => el)
            .map((cell) => {
                return new Feature({
                    geometry:
                        new Polygon(cell!.geometry.coordinates)
                            .transform("EPSG:4326", projection)
                            ,
                    Count: cell!.properties.density
                });
            });
        if (speciesVal) {
            dispatch(updateSpeciesLayer({
                title: title!,
                prop: 'gridCells',
                value: cellsWithData
            }));
        } else {
            dispatch(updateDefaultLayer({ 'gridCells': cellsWithData }));
        }
        setGridFeats(gridFeatures);
        setFeaturesOutOfCells(pointFeatures);
    }, [
        features,
        grid,
        projection,
        isDisplayChangeActive,
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable,
    ]);

    const colors = Object.values(gradient).map((hex) => {
        return createColorArray(hex, opacity);
    });

    const style = {
        style: {
            'stroke-color': [0, 0, 0, opacity],
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
        },
        filter: displayMethod === EDisplayTypes.MIX ?
            [">", ['get', 'Count', 'number'], 1]
            :
            [">", ['get', 'Count', 'number'], 0],
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
            const featsToAdd = gridFeats.filter((cell) => {
                const geometry = cell.getGeometry();
                if (!geometry) return false;
                const reprojectedCell = geometry.clone().transform(projection, "EPSG:4326");
                const geoJsonCell = turf.polygon(reprojectedCell.getCoordinates());
                const isIntersects = overlapFeatures.some((feat) =>
                    turf.booleanContains(geoJsonCell, feat)
                );
                return !isIntersects;
            });
            source.clear();
            source.addFeatures(featsToAdd);
        }
    }, [overlapFeatures, projection]);

    const layer = useMemo(() => (
        new VectorLayer({
            style: [style],
            source: source,
            zIndex: 2,
            visible: isDisplayChangeActive ?
                (displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX)
                : true,
        })
    ), [style, source]);


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