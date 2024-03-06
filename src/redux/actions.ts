import { createAction } from "@reduxjs/toolkit";
import { IGridConfig, IHeatmapConfig, ILayerConfrig, IPointConfig, IZoomConfig, TLayerUpdatePayload } from "./types";

export const setFilters = createAction("setFilters", (value) => ({ payload: value }));
export const resetFilters = createAction("resetFilters");

export const setDisplayMethod = createAction("setDisplayMethod", (value) => ({ payload: value }));
export const toggleDisplayChange = createAction("toggleDisplayChange");

export const setActiveBasemap = createAction("setActiveBasemap", (value) => ({ payload: value }));

export const setLayers = createAction<ILayerConfrig[]>("setLayers");

export const updateDefaultLayer = createAction("updateDefaultLayer", (value) => ({ payload: value }));
export const updateSpeciesLayer = createAction<TLayerUpdatePayload>("updateSpeciesLayer");

export const updateGridConfig = createAction<Partial<IGridConfig>>("updateGridConfig");
export const updateHeatmapConfig = createAction<Partial<IHeatmapConfig>>("updateHeatmapConfig");
export const updatePointConfig = createAction<Partial<IPointConfig>>("updatePointConfig");

export const setZoomParams = createAction<Partial<IZoomConfig>>("setZoomParams");