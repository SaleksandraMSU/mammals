import { combineReducers } from "@reduxjs/toolkit";
import { FiltersReducer } from "./filters-reducer";
import { LayersReducer } from "./layers-reducer";
import { MapReducer } from "./map-reducer";

export const rootReducer = combineReducers({
    filters: FiltersReducer,
    layers: LayersReducer,
    map: MapReducer,
})

export type TRootState = ReturnType<typeof rootReducer>;