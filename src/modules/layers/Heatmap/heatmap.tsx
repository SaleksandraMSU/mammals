import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Heatmap as HeatmapLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { IFiltersState, IGradientConfig, getFiltersState, getHeatmapConfig } from '../../../redux';
import { useMapContext } from '../../map';
import { useFeaturesContext } from '../features-context';

type TSpeciesGridProps = {
    speciesVal?: number;
    opacity: number;
    gradient: IGradientConfig;
    filters?: IFiltersState | undefined;
}

export const Heatmap = React.memo((
    { speciesVal, opacity, gradient, filters }: TSpeciesGridProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const { color1, color2, color3 } = gradient;
    const config = useSelector(getHeatmapConfig);
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

    const filtered = useMemo(() => (
        features.filter((f) => {
            return (
                (species ? f.get('species') === species : true) &&
                (museum.length > 0 ? museum.includes(f.get('genesis_da')) : true) &&
                f.get('year') >= dateRange[0] && f.get('year') <= dateRange[1] &&
                (months.length > 0 ? months.includes(f.get('month')) : true) &&
                (determinationMethod.length > 0 ? determinationMethod.includes(f.get('determ')) : true) &&
                (isReliable ? f.get('quality') === 3 : true)
            )
        })
    ), [
        features,
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    ]);

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