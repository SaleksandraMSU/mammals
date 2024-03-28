import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Heatmap as HeatmapLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { IGradientConfig, getHeatmapConfig } from '../../../redux';
import { useMapContext } from '../../map';
import { useFeaturesContext } from '../features-context';

type TSpeciesGridProps = {
    speciesVal?: number;
    opacity: number;
    gradient: IGradientConfig;
}

export const Heatmap = React.memo((
    { speciesVal, opacity, gradient }: TSpeciesGridProps) => {
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