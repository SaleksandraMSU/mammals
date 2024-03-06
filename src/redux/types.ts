import { EGridTypes } from "."
import { EBasemaps } from "../modules/layers"

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

export interface ILayerConfrig {
    title: string,
    value?: number,
    opacity: number,
    color: string,
};

export interface IGridConfig {
    type: EGridTypes,
    cellSize: number,
}

export interface IHeatmapConfig {
    radius: number,
    blur: number,
    gradient?: string[],
}

export interface IPointConfig {
    pointRadius: number,
    auto: boolean,
}

export interface IZoomConfig {
    current: number,
    change: number,
}

export interface ILayersState {
    allowDisplayChange: boolean,
    showMethod: string,
    basemap: EBasemaps,
    layers: ILayerConfrig[],
    defaultLayer: ILayerConfrig,
    zoom: IZoomConfig,
    points: IPointConfig,
    grid: IGridConfig,
    heatmap: IHeatmapConfig,
}

export type TLayerUpdatePayload = {
    title: string,
    prop: string,
    value: number | string,
}