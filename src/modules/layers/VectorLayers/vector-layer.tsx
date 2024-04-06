import React from "react";
import { useSelector } from 'react-redux';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Point } from 'ol/geom';
import { useEffect, useMemo } from 'react';
import { useMapContext } from "../../map"
import {
    EDisplayTypes,
    getDefaultLayer,
    getDisplayMethod,
    getFiltersState,
    getIsDisplayMethodChange,
    getLayers,
    getPointsConfig,
    getZoomConfig,
} from '../../../redux';

type TVectroLayerProps = {
    features: Feature<Point>[];
};

export const VectorLayer = React.memo(({ features }: TVectroLayerProps) => {
    const { map } = useMapContext();
    const defaultLayer = useSelector(getDefaultLayer);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const zoom = useSelector(getZoomConfig);
    const config = useSelector(getPointsConfig);
    const layers = useSelector(getLayers);
    const { species,
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);

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
        "circle-fill-color": layers.length > 0 ?
            ['match', ['get', 'species', 'number'],
                layers[0].value!, layers[0].color!,
                layers[1] ? layers[1].value! : 0,
                layers[1] ? layers[1].color : "#FF8000",
                layers[2] ? layers[2].value! : 0,
                layers[2] ? layers[2].color : "#FF8000",
                layers[3] ? layers[3].value! : 0,
                layers[3] ? layers[3].color : "#FF8000",
                "#FF8000"
            ] : defaultLayer.color,
        "circle-stroke-color": ['match', ['get', 'quality', 'number'], 3, "black", "red"],
        "circle-stroke-width": ['match', ['get', 'quality', 'number'], 3, 0, 0.7],
        "circle-opacity": layers.length > 0 ?
            ['match', ['get', 'species', 'number'],
                layers[0].value, layers[0].opacity,
                layers[1] ? layers[1].value : 0,
                layers[1] ? layers[1].opacity : 1,
                layers[2] ? layers[2].value : 0,
                layers[2] ? layers[2].opacity : 1,
                layers[3] ? layers[3].value : 0,
                layers[3] ? layers[3].opacity : 1,
                1
            ] : defaultLayer.opacity,
        filter: ['all',
            species.length > 0 ? ['in', ['get', 'species', 'number'], species] : true,
            museum.length > 0 ? ['in', ['get', 'genesis_da', 'number'], museum] : true,
            ['between', ['get', 'year', 'number'], dateRange[0], dateRange[1]],
            months.length > 0 ? ['in', ['get', 'month', 'number'], months] : true,
            determinationMethod.length > 0 ? ['in', ['get', 'determ', 'number'], determinationMethod] : true,
            isReliable ? ['==', ['get', 'quality', 'number'], 3] : true,
        ],
    };

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: features
        }), [features]);

    const layer = useMemo(() =>
        new WebGLPointsLayer({
            source: source,
            style: style,
            zIndex: 1,
            visible: displayMethod === EDisplayTypes.POINTS,
        }
        ), [source, style, displayMethod]);


    useEffect(() => {
        map.addLayer(layer);
        !isDisplayChangeActive && layer.setMinZoom(zoom.change);

        // layer.getSource()?.on("featuresloadstart", function () {
        //     map.getTargetElement().classList.add(styles.spinner);
        // });
        // layer.getSource()?.on("featuresloadend", function () {
        //     map.getTargetElement().classList.remove(styles.spinner);
        // });

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer, isDisplayChangeActive]);

    return null;
})