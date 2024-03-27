import React from "react";
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Point } from 'ol/geom';
import { useEffect, useMemo } from 'react';
import { useMapContext } from "../../map/map-context"
import { useSelector } from 'react-redux';
import {
    EDisplayTypes,
    getDisplayMethod,
    getPointsConfig,
} from '../../../redux';

type TVectorLayerMixProps = {
    features: Feature<Point>[];
    opacity: number;
    color: string;
}

export const VectorLayerMix = React.memo((
    { features, opacity, color }: TVectorLayerMixProps) => {
    const { map } = useMapContext();
    const displayMethod = useSelector(getDisplayMethod);
    const config = useSelector(getPointsConfig);

    const style = {
        "circle-radius": config.auto ?
            [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                5, 1,
                10, 4,
                15, 8
            ] : config.pointRadius,
        "circle-fill-color": color,
        "circle-stroke-color": "black",
        "circle-stroke-width": 0,
        "circle-opacity": opacity,
    };

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: features
        }), [features]);


    const layer = useMemo(() =>
        new WebGLPointsLayer({
            source: source,
            style: style,
            zIndex: 2,
            visible: displayMethod === EDisplayTypes.MIX,
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