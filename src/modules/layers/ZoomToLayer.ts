import { useDispatch, useSelector } from "react-redux"
import { useMapContext } from "../map/map-context"
import { useFeaturesContext } from "./features-context"
import { getZoomConfig, setZoomParams } from "../../redux"
import GeoJSON from 'ol/format/GeoJSON';
import * as turf from '@turf/turf';
//@ts-ignore
import { toWgs84 } from "@turf/projection"
import { useEffect } from "react";


export const ZoomToLayer = () => {
    const { features } = useFeaturesContext()
    const { map } = useMapContext()
    const zoom = useSelector(getZoomConfig)
    const dispatch = useDispatch();

    useEffect(() => {
        if (zoom.toLayer && features) { 
            const all_feats = zoom.toLayer === 9999
            const filtered = features.filter((f) => all_feats ? true : f.get('species') === zoom.toLayer);
            const collection = new GeoJSON().writeFeaturesObject(filtered, {
                dataProjection: "EPSG:3857",
                featureProjection: "EPSG:3857",
            });
            const extent = turf.bbox(collection);

            map.getView().fit(extent, {
                maxZoom: 10,
                padding: [30, 30, 30, 30],
                duration: 1000,
            });

            dispatch(setZoomParams({ toLayer: null }));
        }
    }), [zoom.toLayer, features];

    return null;
}