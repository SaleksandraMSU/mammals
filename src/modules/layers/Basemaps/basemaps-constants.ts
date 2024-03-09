export enum EBasemaps {
    YANDEX = "Yandex",
    OSM = "OSM",
    SATELLITE = "Satellite",
    TOPOMAPS = "Topomaps",
    STAMEN = "Stamen",
    ESRI = "Esri",
};

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
        proj: "EPSG:3395",
    },
    {
        key: EBasemaps.OSM,
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        proj: undefined,
    },
    {
        key: EBasemaps.SATELLITE,
        url: 'https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
        proj: "EPSG:3395",
    },
    {
        key: EBasemaps.TOPOMAPS,
        url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
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
        proj: undefined,
    }
];