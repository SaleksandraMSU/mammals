import { createReducer } from "@reduxjs/toolkit";
import { ILayersState } from "../types";
import {
    DEFAULT_GRID,
    DEFAULT_HEATMAP,
    DEFAULT_LAYER,
    DEFAULT_POINTS,
    EBasemaps,
    EDisplayTypes
} from "../constants";
import {
    toggleDisplayChange,
    setDisplayMethod,
    setActiveBasemap,
    setLayers,
    updateDefaultLayer,
    updateSpeciesLayer,
    updateGridConfig,
    updateHeatmapConfig,
    updatePointConfig,
    setZoomParams,
    setIntersectingGridFeatures,
} from "../actions";

const initialState: ILayersState = {
    allowDisplayChange: false,
    showMethod: EDisplayTypes.POINTS,
    basemap: EBasemaps.YANDEX,
    layers: [],
    zoom: { change: 11, toLayer: null },
    defaultLayer: DEFAULT_LAYER,
    grid: DEFAULT_GRID,
    heatmap: DEFAULT_HEATMAP,
    points: DEFAULT_POINTS,
}

export const LayersReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setDisplayMethod, (state, action) => {
            state.showMethod = action.payload;
        })
        .addCase(toggleDisplayChange, (state) => {
            state.allowDisplayChange = !state.allowDisplayChange;
        })
        .addCase(setActiveBasemap, (state, action) => {
            state.basemap = action.payload;
        })
        .addCase(setLayers, (state, action) => {
            const newLayers = action.payload;
            !newLayers.length ?
                state.layers = newLayers
                :
                newLayers.forEach((newLayer) => {
                    const existingIndex = state.layers.findIndex((existingLayer) => existingLayer.title === newLayer.title);
                    existingIndex !== -1
                        ? (state.layers[existingIndex] = state.layers[existingIndex])
                        : state.layers.push(newLayer);
                });
            state.layers = state.layers.filter((existingLayer) =>
                newLayers.some((newLayer) => existingLayer.title === newLayer.title)
            );
        })
        .addCase(updateDefaultLayer, (state, action) => ({
            ...state,
            defaultLayer: {
                ...state.defaultLayer,
                ...action.payload
            }
        }))
        .addCase(updateSpeciesLayer, (state, action) => {
            const { title, prop, value } = action.payload;
            const lyrI = state.layers.findIndex((l) => l.title === title);
            //@ts-ignore
            state.layers[lyrI][prop] = value;

        })
        .addCase(updateGridConfig, (state, action) => ({
            ...state,
            grid: {
                ...state.grid,
                ...action.payload
            }
        }))
        .addCase(updateHeatmapConfig, (state, action) => ({
            ...state,
            heatmap: {
                ...state.heatmap,
                ...action.payload
            }
        }))
        .addCase(updatePointConfig, (state, action) => ({
            ...state,
            points: {
                ...state.points,
                ...action.payload
            }
        }))
        .addCase(setZoomParams, (state, action) => ({
            ...state,
            zoom: {
                ...state.zoom,
                ...action.payload
            }
        }))
        .addCase(setIntersectingGridFeatures, (state, action) => ({
            ...state,
            intersectingFeats: {
                ...state.intersectingFeats,
                ...action.payload
            }
        }))
})