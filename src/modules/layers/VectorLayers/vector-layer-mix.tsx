import React, { useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Point } from 'ol/geom';
import {
    EDisplayTypes,
    getDisplayMethod,
    getPointsConfig,
} from '../../../redux';
import { useMapContext } from "../../map"

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
            features: features
        }), [features]);


    const layer = useMemo(() =>
        new WebGLPointsLayer({
            source: source,
            style: style,
            zIndex: 100,
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