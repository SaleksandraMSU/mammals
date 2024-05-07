import { createSelector } from "@reduxjs/toolkit";
import { TRootState } from "../reducers/root-reducer";
import { initialState } from "../reducers/filters-reducer";

export const getFiltersState = (state: TRootState) => state.filters;

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


export const getIsReliable = createSelector(
    getFiltersState,
    (state) => state.isReliable
);

export const getIsZeroFilters = createSelector(
    getFiltersState,
    (state) => JSON.stringify(state) === JSON.stringify(initialState)
);