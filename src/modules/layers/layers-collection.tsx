import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { getGeoserverFeatures } from "../../service";
import {
    getFiltersState,
    getIsDisplayMethodChange,
    getDisplayMethod,
    getMapProjection,
    getDataLayers,
    getIsNoShowLayers,
    getIsSampleMode,
    getLayers
} from "../../redux";
import { NON_GRID_DISPLAY_TYPES } from "../constants";
import { ZoomToLayer } from "./ZoomToLayer";
import { BaseLayer, basemaps } from "./Basemaps"
import { VectorLayer, GridLayers } from "./VectorLayers";
import { FeaturesContext } from "./features-context";
import { CitiesHeatmap, HeatmapLayers } from "./Heatmap/";
import { reprojectPoint } from "./layers-utils";
import { OoptLayer } from './VectorLayers/oopt-vector-layer';
import { SampleVectorLayer } from './VectorLayers/sample-vector-layer';

export const LayersCollection = React.memo(() => {
    const [features, setFeatures] = useState<Feature<Point>[]>([]);
    const { Cities, Oopt } = useSelector(getDataLayers);
    const layers = useSelector(getLayers);
    const isDisplayChange = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const projection = useSelector(getMapProjection);
    const ref = useRef<string>(projection);
    const isNoShowLayers = useSelector(getIsNoShowLayers);
    const isSampleMode = useSelector(getIsSampleMode);

    const isCustomGridsNotRender = useMemo(() =>
        isDisplayChange && NON_GRID_DISPLAY_TYPES.includes(displayMethod),
        [isDisplayChange, displayMethod]
    );

    useEffect(() => {
        ref.current = projection;
        getGeoserverFeatures("rmm", projection)
            .then((feats) =>
                setFeatures(feats as Feature<Point>[]));
    }, []);


    useEffect(() => {
        if (features.length && ref.current !== projection) {
            const dataProjected = features.map((point) => {
                const reprojected = reprojectPoint(point, ref.current, projection);
                return reprojected;
            });
            setFeatures(dataProjected);
            ref.current = projection;
        }
    }, [projection, features.length]);


    return (
        <FeaturesContext.Provider value={{ features, setFeatures }}>
            {basemaps.map((basemap) => (
                <BaseLayer
                    key={basemap.key}
                    title={basemap.key}
                    url={basemap.url}
                    attributions={basemap.attributions}
                    proj={basemap.proj}
                />
            ))}
            {!isSampleMode ?
                <VectorLayer features={features} />
                :
                layers.length ?
                    layers.map((l) => (
                        <SampleVectorLayer
                            key={l.value}
                            opacity={l.opacity}
                            color={l.color}
                            filters={l.filters!}
                        />
                    ))
                    :
                    null
            }
            {!isCustomGridsNotRender && !isNoShowLayers && <GridLayers />}
            {!isNoShowLayers && <HeatmapLayers />}
            {Cities && <CitiesHeatmap />}
            {Oopt && <OoptLayer />}
            <ZoomToLayer />
        </FeaturesContext.Provider>
    );
});