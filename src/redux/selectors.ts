import { createSelector } from "@reduxjs/toolkit";
import { TRootState } from "./reducers/root-reducer";

export const getFiltersState = (state: TRootState) => state.filters;
export const getLayersState = (state: TRootState) => state.layers;

export const getSpecies = createSelector(
    getFiltersState,
    (state) => state.species
);

export const getMuseum = createSelector(
    getFiltersState,
    (state) => state.museum
);

export const getDates = createSelector(
    getFiltersState,
    (state) => state.dateRange
);

export const getIsPhoto = createSelector(
    getFiltersState,
    (state) => state.isPhoto
);

export const getIsReliable = createSelector(
    getFiltersState,
    (state) => state.isReliable
);




export const getDisplayMethod = createSelector(
    getLayersState,
    (state) => state.showMethod
);

export const getIsDisplayMethodChange = createSelector(
    getLayersState,
    (state) => state.allowDisplayChange
);

export const getActiveBasemap = createSelector(
    getLayersState,
    (state) => state.basemap
);

export const getLayers = createSelector(
    getLayersState,
    (state) => state.layers
);

export const getDefaultLayer = createSelector(
    getLayersState,
    (state) => state.defaultLayer
);

export const getGridConfig = createSelector(
    getLayersState,
    (state) => state.grid
);

export const getHeatmapConfig = createSelector(
    getLayersState,
    (state) => state.heatmap
);

export const getPointsConfig = createSelector(
    getLayersState,
    (state) => state.points
);

export const getZoomConfig = createSelector(
    getLayersState,
    (state) => state.zoom
);
