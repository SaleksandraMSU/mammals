import React, { useContext } from "react";
import type Map from "ol/Map";

export interface IMapContext {
  map: Map;
}

export const MapContext =
  React.createContext<IMapContext | undefined>(undefined);

export const useMapContext = (): IMapContext => {
  const mapContext = useContext(MapContext);
  if (!mapContext) {
    throw new Error(
      `Map context is not initialized`
    );
  }
  return mapContext;
};