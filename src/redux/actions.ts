import { createAction } from "@reduxjs/toolkit";
import { 
    IGridConfig, 
    IIntersectingFeats, 
    IHeatmapConfig, 
    ILayerConfrig, 
    IPointConfig, 
    IZoomConfig, 
    TLayerUpdatePayload, 
    IDataLayer
} from "./types";
import { EDisplayTypes, EMapProjections } from "./constants";

export const setFilters = createAction("setFilters", (value) => ({ payload: value }));
export const resetFilters = createAction("resetFilters");

export const setDisplayMethod = createAction<EDisplayTypes>("setDisplayMethod");
export const toggleDisplayChange = createAction("toggleDisplayChange");

export const setActiveBasemap = createAction("setActiveBasemap", (value) => ({ payload: value }));

export const setLayers = createAction<ILayerConfrig[]>("setLayers");
export const setDataLayers = createAction<IDataLayer>("setDataLayers");

export const updateDefaultLayer = createAction("updateDefaultLayer", (value) => ({ payload: value }));
export const updateSpeciesLayer = createAction<TLayerUpdatePayload>("updateSpeciesLayer");

export const updateGridConfig = createAction<Partial<IGridConfig>>("updateGridConfig");
export const updateHeatmapConfig = createAction<Partial<IHeatmapConfig>>("updateHeatmapConfig");
export const updatePointConfig = createAction<Partial<IPointConfig>>("updatePointConfig");

export const setZoomParams = createAction<Partial<IZoomConfig>>("setZoomParams");
export const setStatistics = createAction<number[]>("setStatistics");

export const setIntersectingGridFeatures = createAction<Partial<IIntersectingFeats>>("setIntersectingGridFeatures");

export const setProjection = createAction<EMapProjections>("setProjection");