import proj4 from 'proj4';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control.js';
import { Projection, fromLonLat, get as getProjection, transform } from 'ol/proj';
import { register } from 'ol/proj/proj4.js';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { IMapContext, MapContext } from './map-context';
import { fullScreen, mousePositionControl, scaleControl, zoomSlider } from '../controls';
import { useDispatch } from 'react-redux';
import { setZoomParams } from '../../redux';
import { PROJECTION } from './projection';

type TMapComponentProps = PropsWithChildren<{
    className?: string;
}>;

// proj4.defs("ESRI:102027","+proj=lcc +lat_0=30 +lon_0=95 +lat_1=15 +lat_2=65 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
// register(proj4);
// export const projection = getProjection("ESRI:102027");
// export const projection = new Projection({
//     code: "EPSG:3576",
//     extent: [
//         -18019909.21177587, -9009954.605703328, 18019909.21177587,
//         9009954.605703328,
//     ],
//     worldExtent: [-179, -89.99, 179, 89.99],
// });



//   export const projection = new Projection({
//     code: 'ESRI:102013',
//     units: 'm',
//   });


const MapComponent = (props: TMapComponentProps) => {
    const [mapContext, setMapContext] = useState<IMapContext>();

    const mapEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const map = new Map({
            target: mapEl.current!,
            controls: defaultControls().extend([scaleControl, mousePositionControl, fullScreen, zoomSlider]),
            layers: [],
            view: new View({
                center: [0, 0],
                zoom: 2.7,
                projection: PROJECTION,
            }),
        });
        setMapContext({ map });


        return () => {
            map.setTarget(undefined);
        };

    }, []);

    return (
        <MapContext.Provider value={mapContext}>
            <div ref={mapEl} style={{ width: '100%', height: '90vh' }}>{mapContext && props.children}</div>
        </MapContext.Provider>
    );
};

export default MapComponent;