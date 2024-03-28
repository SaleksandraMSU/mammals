import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { getGeoserverFeatures } from "../../service";
import {
    getFiltersState,
    getIsDisplayMethodChange,
    getDisplayMethod,
    getMapProjection
} from "../../redux";
import { NON_GRID_DISPLAY_TYPES } from "../constants";
import { ZoomToLayer } from "./ZoomToLayer";
import { BaseLayer, basemaps } from "./Basemaps"
import { VectorLayer, GridLayers } from "./VectorLayers";
import { FeaturesContext } from "./features-context";
import { HeatmapLayers } from "./Heatmap/";
import { reprojectPoint } from "./layers-utils";

export const LayersCollection = () => {
    const [features, setFeatures] = useState<Feature<Point>[]>([]);
    const [data, setData] = useState<Feature<Point>[]>([]);
    const isDisplayChange = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const {
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);
    const projection = useSelector(getMapProjection);
    const ref = useRef<string>(projection)

    const isCustomGridsNotRender = isDisplayChange &&
        NON_GRID_DISPLAY_TYPES.includes(displayMethod);

    useEffect(() => {
        getGeoserverFeatures("rmm", projection)
            .then((feats) =>
                setData(feats as Feature<Point>[]));
        ref.current = projection;
    }, []);


    useEffect(() => {
        const dataProjected = data.map((point) => {
            const reprojected = reprojectPoint(point, ref.current, projection)
            return reprojected;
        });
        const featuresProjected = features.map((point) => {
            const reprojected = reprojectPoint(point, ref.current, projection)
            return reprojected;
        });
        setData(dataProjected);
        setFeatures(featuresProjected);
        ref.current = projection;
    }, [projection]);

    useEffect(() => {
        if (data) {
            const filtered = data.filter((f) => {
                return (
                    (museum.length > 0 ? museum.includes(f.get('genesis_da')) : true) &&
                    f.get('year') >= dateRange[0] && f.get('year') <= dateRange[1] &&
                    (months.length > 0 ? months.includes(f.get('month')) : true) &&
                    (determinationMethod.length > 0 ? determinationMethod.includes(f.get('determ')) : true) &&
                    (isReliable ? f.get('quality') === 3 : true)
                )
            });
            setFeatures(filtered);
        }
    }, [data, museum, dateRange, months, determinationMethod, isReliable]);


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
            <VectorLayer features={data} />
            {!isCustomGridsNotRender && <GridLayers />}
            <HeatmapLayers />
            <ZoomToLayer />
        </FeaturesContext.Provider>
    );
};