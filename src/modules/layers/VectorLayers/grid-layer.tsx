import React, { useState } from "react";
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Layer from 'ol/layer/Layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { useMapContext } from '../../map/map-context';
import { EDisplayTypes, getDefaultLayer, getDisplayMethod, getLayers } from '../../../redux';
import { getInterimColor, hexToRgb } from "../layers-utils";
import { getGeoserverFeatures } from "../features-service";

export const GridLayer = React.memo(() => {
    const { map } = useMapContext();
    const { opacity, gradient } = useSelector(getDefaultLayer);
    const layers = useSelector(getLayers)
    const displayMethod = useSelector(getDisplayMethod);
    const [gridFeatures, setGridFeatures] = useState<Feature<Geometry>[]>([])

    useEffect(() => {
        getGeoserverFeatures("grid")
            .then((feats) =>
                setGridFeatures(feats));
    }, [])

    const colors = Object.values(gradient).map((hex) => {
        const color = hexToRgb(hex);
        color.push(opacity)
        return color;
    });

    const style = {
        'stroke-color': [0, 0, 0, opacity],
        'stroke-width': 0.8,
        'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'Count', 'number'],
            1, colors[0],
            12, getInterimColor(colors[0], colors[1], opacity),
            50, colors[1],
            168, getInterimColor(colors[1], colors[2], opacity),
            375, colors[2],
        ],
        filter: displayMethod === EDisplayTypes.MIX ? [">", ['get', 'Count', 'number'], 1] : true,
    };

    class WebGLLayer extends Layer {
        createRenderer(): any {
            return new WebGLVectorLayerRenderer(this, {
                style,
            });
        }
    };

    const source = useMemo(() => (
        new VectorSource({
            features: gridFeatures,
        })
    ), [gridFeatures])

    const grid = useMemo(() => (
        new WebGLLayer({
            source: source,
            zIndex: 5,
            visible: (displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX) && 
            !layers.length
        })
    ), [style, source])

    useEffect(() => {
        map.addLayer(grid);

        return () => {
            map.removeLayer(grid);
        }
    }, [map, grid]);

    return null;
})