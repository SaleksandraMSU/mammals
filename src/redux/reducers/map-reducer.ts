import { createReducer } from "@reduxjs/toolkit";
import { EMapProjections } from "../constants";
import { setProjection } from "../actions";

interface IMapState {
    projection: EMapProjections;
}

export const initialState: IMapState = {
    projection: EMapProjections.EPSG_3857
};

export const MapReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(setProjection, (state, action) => {
        state.projection = action.payload
    })
})