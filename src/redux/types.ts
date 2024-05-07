import type {
    Feature,
    Polygon,
    GeoJsonProperties,
} from "geojson";
import { EGridTypes, EGridsRenderMethods, EBasemaps, EDisplayTypes, EData } from "./constants"

export interface IFiltersState {
    species: number[],
    dateRange: number[],
    months: number[],
    museum: number[],
    determinationMethod: number[],
    isReliable: boolean,
};

export interface IGradientConfig {
    color1: string,
    color2: string,
    color3: string,
};

export interface ILayerConfrig {
    title: string,
    value?: number,
    opacity: number,
    color: string,
    gradient: IGradientConfig,
    gridCells: Feature<Polygon, GeoJsonProperties>[],
    filters?: IFiltersState,
};

export interface IGridConfig {
    type: EGridTypes,
    cellSize: number,
    method: EGridsRenderMethods,
};

export interface IHeatmapConfig {
    radius: number,
    blur: number,
    gradient?: string[],
};

export interface IPointConfig {
    pointRadius: number,
    auto: boolean,
};

export interface IZoomConfig {
    change: number,
    toLayer: number | null,
};

export interface IIntersectingFeats {
    count?: number,
    area?: number,
};

export interface IDataLayer {
    [EData.CITIES]: boolean,
    [EData.OOPT]: boolean,
};

export interface ILayersState {
    allowDisplayChange: boolean,
    showMethod: EDisplayTypes,
    basemap: EBasemaps,
    layers: ILayerConfrig[],
    defaultLayer: ILayerConfrig,
    dataLayers: IDataLayer,
    zoom: IZoomConfig,
    points: IPointConfig,
    grid: IGridConfig,
    heatmap: IHeatmapConfig,
    sampleMode: boolean,
    intersectingFeats?: IIntersectingFeats,
};

export type TLayerUpdatePayload = {
    title: string,
    prop: string,
    value: any,
};