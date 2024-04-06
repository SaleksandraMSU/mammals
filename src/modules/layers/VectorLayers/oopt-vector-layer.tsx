import React, { useEffect, useMemo } from "react";
import { useSelector } from 'react-redux';
import { MVT } from 'ol/format.js';
import VectorTile from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { flatStylesToStyleFunction } from "ol/render/canvas/style.js";
import { getMapProjection } from '../../../redux';
import { useMapContext, PROJECTIONS } from '../../map';

export const OoptLayer = React.memo(() => {
    const { map } = useMapContext();
    const projection = useSelector(getMapProjection);
    const gridset = useMemo(() => PROJECTIONS.find((proj) => proj.value === projection)?.gridset || "900913", [projection]);

    const style = {
        'stroke-color': [0, 109, 44, 1],
        'stroke-width': 0.8,
        'fill-color': [102, 194, 164, 0.5],
    };

    const source = useMemo(() => (
        new VectorTileSource({
            format: new MVT(),
            wrapX: true,
            projection: projection,
            url:
                `http://localhost:8080/geoserver/gwc/service/tms/1.0.0/mammals:oopt@EPSG%3A${gridset}@pbf/{z}/{x}/{-y}.pbf`
        })
    ), [projection, gridset])

    const oopt = useMemo(() => (
        new VectorTile({
            source: source,
            style: flatStylesToStyleFunction([style]),
            zIndex: 0,
        })
    ), [style, source, gridset])

    useEffect(() => {
        map.addLayer(oopt);

        return () => {
            map.removeLayer(oopt);
        }
    }, [map, oopt]);

    return null;
})