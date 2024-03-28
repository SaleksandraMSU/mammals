import type {
    Feature,
    Polygon,
    GeoJsonProperties,
} from "geojson";
import { EGridTypes, EGridsRenderMethods, EBasemaps, EDisplayTypes } from "./constants"

export interface IFiltersState {
    species: number[],
    dateRange: number[],
    months: number[],
    author: number[],
    museum: number[],
    status: number[],
    determinationMethod: number[],
    isReliable: boolean,
    isPhoto: boolean,
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
    cellsStats: Feature<Polygon, GeoJsonProperties>[],
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

export interface IGridsCompare {
    layer1: number | null,
    layer2: number | null,
    percentage?: number,
    area?: number,
};

export interface ILayersState {
    allowDisplayChange: boolean,
    showMethod: EDisplayTypes,
    basemap: EBasemaps,
    layers: ILayerConfrig[],
    defaultLayer: ILayerConfrig,
    zoom: IZoomConfig,
    points: IPointConfig,
    grid: IGridConfig,
    heatmap: IHeatmapConfig,
    gridsCompare: IGridsCompare,
};

export type TLayerUpdatePayload = {
    title: string,
    prop: string,
    value: any,
};