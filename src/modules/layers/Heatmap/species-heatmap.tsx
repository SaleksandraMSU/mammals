import Layer from 'ol/layer/Layer.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import * as turf from '@turf/turf';
//@ts-ignore
import pointsWithinPolygon from '@turf/points-within-polygon';
//@ts-ignore
import { toWgs84 } from "@turf/projection"
import React, { useEffect, useMemo } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { useMapContext } from '../../map/map-context';
import { useFeaturesContext } from '../features-context';
import { useSelector } from 'react-redux';
import { IGradientConfig, getFiltersState, getHeatmapConfig } from '../../../redux';
import { Heatmap as HeatmapLayer } from 'ol/layer.js';

type TSpeciesGridProps = {
    speciesVal?: number;
    opacity: number;
    gradient: IGradientConfig;
}

export const SpeciesHeatmap = React.memo(({ speciesVal, opacity, gradient }: TSpeciesGridProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const { color1, color2, color3 } = gradient;
    const config = useSelector(getHeatmapConfig);

    const filtered = features.filter((f) => {
        return (
            speciesVal ? f.get('species') === speciesVal : true 
        )
    });

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: filtered,
        }), [features]);

    const layer = useMemo(() => (
        new HeatmapLayer({
            source: source,
            blur: config.blur,
            radius: config.radius,
            opacity: opacity,
            gradient: [color1, color2, color3],
        })
    ), [source, config, opacity, gradient]);


    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer]);

    return null;
});