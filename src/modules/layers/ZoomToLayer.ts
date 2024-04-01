import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON';
import { getMapProjection, getZoomConfig, setZoomParams } from "../../redux"
import { useMapContext } from "../map"
import { useFeaturesContext } from "./features-context"

export const ZoomToLayer = () => {
    const { features } = useFeaturesContext();
    const { map } = useMapContext();
    const zoom = useSelector(getZoomConfig);
    const dispatch = useDispatch();
    const projection = useSelector(getMapProjection);

    useEffect(() => {
        if (zoom.toLayer && features.length) {
            const all_feats = zoom.toLayer === 9999;
            const filtered = features.filter((f) =>
                !all_feats ? f.get('species') === zoom.toLayer : true);
            const collection = new GeoJSON().writeFeaturesObject(filtered, {
                dataProjection: projection,
                featureProjection: projection,
            });
            const extent = turf.bbox(collection);

            try {
                map.getView().fit(extent, {
                    maxZoom: 10,
                    padding: [30, 30, 30, 30],
                    duration: 1000,
                })
            }
            catch (e) {
                console.log(e)
            }
            dispatch(setZoomParams({ toLayer: null }));
        }
    }), [zoom.toLayer, features];

    return null;
}