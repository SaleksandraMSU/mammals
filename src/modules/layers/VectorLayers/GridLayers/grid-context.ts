import React, { useContext } from "react";
import { geoJsonPolygon } from "../vector-layers-types";

export interface IGridContext {
  overlapFeatures: geoJsonPolygon[];
  setOverlapFeatures: (value: React.SetStateAction<geoJsonPolygon[]>) => void;
}

export const GridContext =
  React.createContext<IGridContext | undefined>(undefined);

export const useGridContext = (): IGridContext => {
  const gridContext = useContext(GridContext);
  if (!gridContext) {
    throw new Error(
      `Grid context is not initialized`
    );
  }
  return gridContext;
};