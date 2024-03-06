import { combineReducers } from "@reduxjs/toolkit";
import { FiltersReducer } from "./filters-reducer";
import { LayersReducer } from "./layers-reducer";

export const rootReducer = combineReducers({
    filters: FiltersReducer,
    layers: LayersReducer,
})

export type TRootState = ReturnType<typeof rootReducer>;