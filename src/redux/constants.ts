import { IGridConfig, IHeatmapConfig, ILayerConfrig, IPointConfig } from "./types";

export enum EDisplayTypes {
    POINTS = "Points",
    GRID = "Grid",
    MIX = "Mix",
    HEATMAP = "Heatmap"
};

export enum EGridTypes {
    SQUARE = "square",
    HEX = "hex",
    TRIANGLE = "triangle",
};

export const DEFAULT_GRADIENT = { color1: "#f5f500", color2: "#f57a00", color3: "#f50000"}

export const DEFAULT_LAYER: ILayerConfrig = {
    title: "Все данные",
    opacity: 1,
    color: "#FF8000",
    gradient: DEFAULT_GRADIENT,
};

export const DEFAULT_GRID: IGridConfig = {
    type: EGridTypes.SQUARE,
    cellSize: 2,
};

export const DEFAULT_HEATMAP: IHeatmapConfig = {
    radius: 1,
    blur: 10,
};

export const DEFAULT_POINTS: IPointConfig = {
    pointRadius: 1,
    auto: true,
}



