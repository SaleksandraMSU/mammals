import { EBasemaps } from "../../../redux";

export interface IBasemapItem {
    label: string,
    value: EBasemaps,
    icon: string,
};

export const basemapsItems: IBasemapItem[] = [
    {
        label: "Яндекс карты",
        value: EBasemaps.YANDEX,
        icon: "public/assets/yandex.png"
    },
    {
        label: "OSM",
        value: EBasemaps.OSM,
        icon: "public/assets/osm.png"
    },
    {
        label: "Спутник",
        value: EBasemaps.SATELLITE,
        icon: "public/assets/satellite.png"
    },
    {
        label: "Topomaps",
        value: EBasemaps.TOPOMAPS,
        icon: "public/assets/topomaps.png"
    },
    {
        label: "Stamen",
        value: EBasemaps.STAMEN,
        icon: "public/assets/stamen.png"
    },
    {
        label: "ESRI Dark Gray",
        value: EBasemaps.ESRI,
        icon: "public/assets/esri.png"
    }
];

export const basemaps = [
    {
        key: EBasemaps.YANDEX,
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
        attributions: "© Яндекс <a target='_blank' href='https://yandex.ru/legal/maps_termsofuse/?lang=ru'>Условия использования</a>",
        proj: undefined,
    },
    {
        key: EBasemaps.OSM,
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        attributions: "© <a target='_blank' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>  contributors",
        proj: undefined,
    },
    {
        key: EBasemaps.SATELLITE,
        url: 'https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
        attributions: "© Яндекс <a target='_blank' href='https://yandex.ru/legal/maps_termsofuse/?lang=ru'>Условия использования</a>",
        proj: undefined,
    },
    {
        key: EBasemaps.TOPOMAPS,
        url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
        attributions: "© <a target='_blank' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>  contributors",
        proj: undefined,
    },
    {
        key: EBasemaps.STAMEN,
        url: "",
        proj: undefined,
    },
    {
        key: EBasemaps.ESRI,
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        attributions: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
        proj: undefined,
    }
];