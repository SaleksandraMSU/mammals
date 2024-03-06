import VectorSource from 'ol/source/Vector.js'
import { Heatmap as HeatmapLayer } from 'ol/layer.js';
import { useEffect, useMemo } from 'react';
import { Point } from 'ol/geom';
import { useMapContext } from "../../map/map-context"
import { useSelector } from 'react-redux';
import { EDisplayTypes, getDefaultLayer, getDisplayMethod, getFiltersState, getHeatmapConfig, getLayers } from '../../../redux';
import { useFeaturesContext } from '../layers-context';
import {Cluster} from 'ol/source.js';
import { Feature } from 'ol';

export const HeatMapLayer = () => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const displayMethod = useSelector(getDisplayMethod);
    const { opacity } = useSelector(getDefaultLayer);
    const layers = useSelector(getLayers);
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
            (museum.length > 0 ? museum.includes(f.get('genesis_da')) : true) &&
            f.get('year') >= dateRange[0] && f.get('year') <= dateRange[1] &&
            (months.length > 0 ? months.includes(f.get('month')) : true) &&
            (determinationMethod.length > 0 ? determinationMethod.includes(f.get('determ')) : true) &&
            (isReliable ? f.get('quality') === 3 : true)
        )
    })

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: filtered,
        }), [filtered]);

    const layer = useMemo(() => (
        new HeatmapLayer({
            source: source,
            blur: config.blur,
            radius: config.radius,
            visible: displayMethod === EDisplayTypes.HEATMAP && layers.length === 0,
            opacity: opacity,
        })
    ), [source, displayMethod, layers, opacity, config]);


    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer]);

    return null;
}