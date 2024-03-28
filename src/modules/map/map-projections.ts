import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { EMapProjections } from '../../redux';

proj4.defs("EPSG:3395", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
proj4.defs("EPSG:3576", "+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
proj4.defs("EPSG:102025", "+proj=aea +lat_0=30 +lon_0=95 +lat_1=15 +lat_2=65 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");

register(proj4);

type TProjectionItem = {
    value: EMapProjections,
    label: string,
    gridset: string,
}

export const PROJECTIONS: TProjectionItem[] = [
    {
        value: EMapProjections.EPSG_3857,
        label: "Spherical Mercator (EPSG:3857)",
        gridset: "900913",
    },
    {
        value: EMapProjections.EPSG_3576,
        label: "North Pole LAEA Russia (EPSG:3576)",
        gridset: "3576",
    },
    {
        value: EMapProjections.EPSG_102025,
        label: "Asia North Albers (ESRI:102025)",
        gridset: "102025",
    },
];