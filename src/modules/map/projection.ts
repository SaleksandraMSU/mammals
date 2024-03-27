import proj4 from 'proj4';
import { Projection, get as getProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4.js';

proj4.defs("ESRI:102027","+proj=lcc +lat_0=30 +lon_0=95 +lat_1=15 +lat_2=65 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
proj4.defs("EPSG:3395","+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
proj4.defs("EPSG:3576","+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
proj4.defs("EPSG:102025","+proj=aea +lat_0=30 +lon_0=95 +lat_1=15 +lat_2=65 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");

register(proj4);

export const PROJECTION = getProjection("EPSG:102025") as Projection;
export const PROJECTION_STR = "EPSG:102025";