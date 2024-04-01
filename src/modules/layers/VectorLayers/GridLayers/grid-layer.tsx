import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import Layer from 'ol/layer/Layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Feature } from "ol";
import { Point, Polygon } from "ol/geom";
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import {
    EDisplayTypes,
    getDefaultLayer,
    getDisplayMethod,
    getLayers,
    getMapProjection
} from '../../../../redux';
import { getGeoserverFeatures } from "../../../../service";
import { useMapContext } from '../../../map';
import { createColorArray, getInterimColor } from "../../layers-utils";
import { VectorLayerMix } from "../vector-layer-mix";

export const GridLayer = React.memo(() => {
    const { map } = useMapContext();
    const { opacity, gradient, color } = useSelector(getDefaultLayer);
    const layers = useSelector(getLayers);
    const displayMethod = useSelector(getDisplayMethod);
    const [gridFeatures, setGridFeatures] = useState<Feature<Polygon>[]>([]);
    const [points, setPoints] = useState<Feature<Point>[]>([]);
    const projection = useSelector(getMapProjection);
    const ref = useRef<string>(projection);

    useEffect(() => {
        getGeoserverFeatures("grid", projection)
            .then((feats) =>
                setGridFeatures(feats as Feature<Polygon>[]));
        ref.current = projection;
    }, [])

    useEffect(() => {
        if (displayMethod === EDisplayTypes.MIX) {
            getGeoserverFeatures("rmm_select", projection)
                .then((feats) =>
                    setPoints(feats as Feature<Point>[]));
        }    
    }, [displayMethod])

    useEffect(() => {
        const dataProjected = gridFeatures.map((pol) => {
            const newPol = pol.clone();
            const geom = pol.getGeometry()?.transform(ref.current, projection);
            newPol.setGeometry(geom);
            return newPol;
        })
        setGridFeatures(dataProjected);
        ref.current = projection;
    }, [projection])

    const colors = Object.values(gradient).map((hex) => {
        return createColorArray(hex, opacity);
    });

    const style = {
        'stroke-color': [0, 0, 0, opacity],
        'stroke-width': 1,
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
            zIndex: 1,
            visible: !layers.length,
        })
    ), [style, source, layers.length])

    useEffect(() => {
        map.addLayer(grid);

        return () => {
            map.removeLayer(grid);
        }
    }, [map, grid]);

    const renderPointsLayer = () => {
        if (displayMethod === EDisplayTypes.MIX) {
            return (points.length &&
                <VectorLayerMix
                    features={points}
                    opacity={opacity}
                    color={color}
                />
            )
        }
    };

    return (
        <>
            {renderPointsLayer()}
        </>
    );
})