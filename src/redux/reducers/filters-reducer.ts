import { createReducer } from "@reduxjs/toolkit";
import { IFiltersState } from "../types";
import { resetFilters, setFilters } from "../actions";

export const initialState: IFiltersState = {
    species: [],
    dateRange: [1697, 2024],
    months: [],
    museum: [],
    determinationMethod: [],
    isReliable: false,
}

export const FiltersReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(setFilters, (state, action) => ({
        ...state,
        ...action.payload,
    }))
    .addCase(resetFilters, (state) => ({
        ...state,
        ...initialState,
    }))
})