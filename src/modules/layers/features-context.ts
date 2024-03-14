import React, { useContext } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";

export interface IFeaturesContext {
  features: Feature<Point>[];
  setFeatures: (value: React.SetStateAction<Feature<Point>[]>) => void;
}

export const FeaturesContext =
  React.createContext<IFeaturesContext | undefined>(undefined);

export const useFeaturesContext = (): IFeaturesContext => {
  const featuresContext = useContext(FeaturesContext);
  if (!featuresContext) {
    throw new Error(
      `Feature context is not initialized`
    );
  }
  return featuresContext;
};