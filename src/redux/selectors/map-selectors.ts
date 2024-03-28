import { createSelector } from "@reduxjs/toolkit";
import { TRootState } from "../reducers/root-reducer";


const getMapState = (state: TRootState) => state.map;

export const getMapProjection = createSelector(
    getMapState,
    (state) => state.projection
);

