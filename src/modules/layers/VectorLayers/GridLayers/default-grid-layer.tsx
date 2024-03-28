import React, { useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import { MVT } from 'ol/format.js';
import VectorTile from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { flatStylesToStyleFunction } from "ol/render/canvas/style.js";
import { useMapContext, PROJECTIONS } from '../../../map';
import { 
    getDefaultLayer, 
    getIsDisplayMethodChange, 
    getIsZeroFilters, 
    getLayers, 
    getZoomConfig,
    getMapProjection,
} from '../../../../redux';
import { getInterimColor, hexToRgb } from "../../layers-utils";

export const DefaultGridLayer = React.memo(() => {
    const { map } = useMapContext();
    const { opacity, gradient } = useSelector(getDefaultLayer);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const isNoFilters = useSelector(getIsZeroFilters)
    const layers = useSelector(getLayers);
    const zoom = useSelector(getZoomConfig);
    const projection = useSelector(getMapProjection);
    const gridset = useMemo(() => PROJECTIONS.find((proj) => proj.value === projection)?.gridset || "900913", [projection])

    console.log(gridset)

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
    };

    const source = useMemo(() => (
        new VectorTileSource({
            format: new MVT(),
            wrapX: true,
            projection: projection,
            url:
                `http://localhost:8080/geoserver/gwc/service/tms/1.0.0/mammals:grid@EPSG%3A${gridset}@pbf/{z}/{x}/{-y}.pbf`
        })
    ), [projection])

    const grid = useMemo(() => (
        new VectorTile({
            source: source,
            style: flatStylesToStyleFunction([style]),
            visible: !isDisplayChangeActive && layers.length === 0 && isNoFilters,
            zIndex: 5,
        })
    ), [style, source, layers, isDisplayChangeActive, isNoFilters])

    useEffect(() => {
        map.addLayer(grid);
        !isDisplayChangeActive && grid.setMaxZoom(zoom.change);

        return () => {
            map.removeLayer(grid);
        }
    }, [map, grid, isDisplayChangeActive]);

    return null;
})