import { Map, View } from 'ol';
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from 'ol/control.js';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMapProjection } from '../../redux';
import { fullScreen, mousePositionControl, scaleControl, zoomSlider } from '../controls';
import { IMapContext, MapContext } from './map-context';

type TMapComponentProps = PropsWithChildren<{
    className?: string;
}>;

export const MapComponent = (props: TMapComponentProps) => {
    const [mapContext, setMapContext] = useState<IMapContext>();
    const projection = useSelector(getMapProjection);

    const mapEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const map = new Map({
            target: mapEl.current!,
            controls: defaultControls().extend([
                scaleControl,
                mousePositionControl,
                fullScreen,
                zoomSlider
            ]),
            layers: [],
            view: new View({
                center: fromLonLat([105, 70], projection),
                zoom: 2.7,
                projection,
            }),
        });
        setMapContext({ map });

        return () => {
            map.setTarget(undefined);
        };

    }, [mapEl, projection]);

    return (
        <MapContext.Provider value={mapContext}>
            <div ref={mapEl} style={{ width: '100%', height: '90vh' }}>{mapContext && props.children}</div>
        </MapContext.Provider>
    );
};