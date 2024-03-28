import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ.js';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import { EBasemaps, getActiveBasemap } from '../../../redux';
import { useMapContext } from '../../map';

type TBaseLayerProps = {
    title: EBasemaps,
    url: string,
    attributions?: string,
    proj: string | undefined,
}

export const BaseLayer = React.memo((
    { title, url, proj, attributions }: TBaseLayerProps) => {
    const { map } = useMapContext();
    const activeBasemap = useSelector(getActiveBasemap);

    const layer = useMemo(() => new TileLayer({
        visible: title === activeBasemap,
        zIndex: -1,
        source: url ?
            new XYZ({
                url: url,
                attributions: attributions,
                attributionsCollapsible: false,
                projection: proj ?? "EPSG:3857"
            })
            :
            new StadiaMaps({
                layer: 'stamen_toner',
                apiKey: "d83c9a90-9ab6-4a1e-a275-6737e10a2bc6",
                retina: true,
            })
    }), [map, activeBasemap, attributions]);

    useEffect(() => {
        map.addLayer(layer);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer]);

    return null;
});