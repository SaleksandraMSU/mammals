import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ.js';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import OSM from 'ol/source/OSM.js';
import { createXYZ } from 'ol/tilegrid';
import { memo, useEffect, useMemo } from 'react';
import { EBasemaps } from '.';
import { useMapContext } from '../../map/map-context';
import { useSelector } from 'react-redux';
import { getActiveBasemap } from '../../../redux';

type TBaseLayerProps = {
    title: EBasemaps,
    url: string,
    attributions?: string,
    proj: string | undefined,
}

export const BaseLayer = ({ title, url, proj, attributions }: TBaseLayerProps) => {
    const { map } = useMapContext();
    const activeBasemap = useSelector(getActiveBasemap);

    const layer = useMemo(() => new TileLayer({
        visible: title === activeBasemap,
        zIndex: -1,
        source: url ? new XYZ({
            url: url,
            attributions: attributions,
            attributionsCollapsible: false,
            projection: proj ?? "EPSG:3857"
            // tileGrid: createXYZ({
            //     extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
            // })
        }) : new StadiaMaps({
            layer: 'stamen_toner',
            apiKey: "d83c9a90-9ab6-4a1e-a275-6737e10a2bc6",
            retina: true,
        })
    }), [map, activeBasemap, attributions])

    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer)
        }
    }, [map, layer])

    return null;
};