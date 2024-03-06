import Layer from 'ol/layer/Layer.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import * as turf from '@turf/turf';
//@ts-ignore
import pointsWithinPolygon from '@turf/points-within-polygon';
//@ts-ignore
import { toWgs84 } from "@turf/projection"
import { useEffect, useMemo } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { useMapContext } from '../../map/map-context';
import { useFeaturesContext } from '../layers-context';
import { useSelector } from 'react-redux';
import { getFiltersState, getHeatmapConfig } from '../../../redux';
import { Heatmap as HeatmapLayer } from 'ol/layer.js';

type TSpeciesGridProps = {
    speciesVal: number;
    opacity: number;
}

export const SpeciesHeatmap = ({ speciesVal, opacity }: TSpeciesGridProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const {
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);

    const config = useSelector(getHeatmapConfig);

    const filtered = features.filter((f) => {
        return (
            f.get('species') === speciesVal &&
            (museum.length > 0 ? museum.includes(f.get('genesis_da')) : true) &&
            f.get('year') >= dateRange[0] && f.get('year') <= dateRange[1] &&
            (months.length > 0 ? months.includes(f.get('month')) : true) &&
            (determinationMethod.length > 0 ? determinationMethod.includes(f.get('determ')) : true) &&
            (isReliable ? f.get('quality') === 3 : true)
        )
    });

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: filtered,
        }), [filtered]);

    const layer = useMemo(() => (
        new HeatmapLayer({
            source: source,
            blur: config.blur,
            radius: config.radius,
            opacity: opacity,
        })
    ), [source, config, opacity]);


    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer]);

    return null;
}