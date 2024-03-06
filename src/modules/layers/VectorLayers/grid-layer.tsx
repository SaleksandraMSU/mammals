import React from "react";
import GeoJSON from 'ol/format/GeoJSON.js';
import Layer from 'ol/layer/Layer.js';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { useMapContext } from '../../map/map-context';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { EDisplayTypes, getDefaultLayer, getDisplayMethod, getFiltersState, getIsDisplayMethodChange, getLayers, getZoomConfig } from '../../../redux';

export const GridLayer = React.memo(() => {
    const { map } = useMapContext();
    const { opacity } = useSelector(getDefaultLayer);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const layers = useSelector(getLayers);
    const zoom = useSelector(getZoomConfig);
    // const {
    //     museum,
    //     months,
    //     dateRange,
    //     determinationMethod,
    //     isReliable
    // } = useSelector(getFiltersState);

    const style = {
        'stroke-color': ['color', 0, 0, 0, opacity],
        'stroke-width': 0.8,
        'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'Join_Count', 'number'],
            1, ['color', 245, 245, 0, opacity],
            12, ['color', 245, 184, 0, opacity],
            50, ['color', 245, 122, 0, opacity],
            168, ['color', 245, 81, 0, opacity],
            375, ['color', 245, 0, 0, opacity],
        ],
        filter: displayMethod === EDisplayTypes.MIX ? [">", ['get', 'Join_Count', 'number'], 1] : true
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
            url: './src/grid.geojson',
            format: new GeoJSON(),
        })
    ), [])

    const grid = useMemo(() => (
        new WebGLLayer({
            source: source,
            visible: isDisplayChangeActive ?
                (displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX) && layers.length === 0
                : layers.length === 0,
            zIndex: 5,
        })
    ), [style, source, layers, isDisplayChangeActive])

    useEffect(() => {
        map.addLayer(grid);
        !isDisplayChangeActive && grid.setMaxZoom(zoom.change);

        return () => {
            map.removeLayer(grid);
        }
    }, [map, grid, isDisplayChangeActive]);

    return null;
})