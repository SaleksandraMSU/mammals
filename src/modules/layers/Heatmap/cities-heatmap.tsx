import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Heatmap as HeatmapLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { getMapProjection } from '../../../redux';
import { useMapContext } from '../../map';
import { getGeoserverFeatures } from '../../../service';

export const CitiesHeatmap = React.memo(() => {
    const { map } = useMapContext();
    const [features, setFeatures] = useState<Feature<Point>[]>([]);
    const projection = useSelector(getMapProjection);
    const ref = useRef<string>(projection);

    useEffect(() => {
        getGeoserverFeatures("cities", projection)
            .then((feats) =>
                setFeatures(feats as Feature<Point>[]));
        ref.current = projection;
    }, [])

    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            features: features,
        }), [features]);

    const layer = useMemo(() => (
        new HeatmapLayer({
            source: source,
            zIndex: 0,
            blur: 17,
            radius: 12,
            opacity: 0.5,
            gradient: ["#ffffd4", "#fe9929", "#d95f0e"],
        })
    ), [source]);


    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer]);

    return null;
});