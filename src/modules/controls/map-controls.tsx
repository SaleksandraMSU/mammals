import { FullScreen, ScaleLine, ZoomSlider } from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import "./controls-styles.scss";

export const scaleControl = new ScaleLine({
    units: 'metric',
    text: true,
    minWidth: 150,
    maxWidth: 160,
});


export const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(2),
  projection: 'EPSG:4326',
});

export const fullScreen = new FullScreen();

export const zoomSlider =  new ZoomSlider();