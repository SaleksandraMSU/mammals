import React, { useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Point } from 'ol/geom';
import {
    EDisplayTypes,
    IFiltersState,
    getDisplayMethod,
    getPointsConfig,
} from '../../../redux';
import { useMapContext } from "../../map"
import { useFeaturesContext } from "../features-context";

type TVectorLayerMixProps = {
    opacity: number;
    color: string;
    filters: IFiltersState;
}

export const SampleVectorLayer = React.memo((
    { opacity, color, filters }: TVectorLayerMixProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const displayMethod = useSelector(getDisplayMethod);
    const config = useSelector(getPointsConfig);
    const {
        species,
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = filters;

    const filtered = useMemo(() => (
        features.filter((f) => {
            return (
                (species.length ? species.includes(f.get('species')) : true) &&
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

    const style = {
        "circle-radius": config.auto ?
            [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                3, 2,
                5, 3,
                10, 4,
                15, 8
            ] : config.pointRadius,
        "circle-fill-color": color,
        "circle-stroke-color": ['match', ['get', 'quality', 'number'], 3, "black", "red"],
        "circle-stroke-width": ['match', ['get', 'quality', 'number'], 3, 0, 0.7],
        "circle-opacity": opacity,
    };

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: filtered
        }), [filtered]);


    const layer = useMemo(() =>
        new WebGLPointsLayer({
            source: source,
            style: style,
            zIndex: 100,
            visible: displayMethod === EDisplayTypes.POINTS,
        }
        ), [source, style, displayMethod]);


    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer]);

    return null;
})