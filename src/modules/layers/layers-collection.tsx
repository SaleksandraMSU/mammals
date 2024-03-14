import { useSelector } from "react-redux";
import { BaseLayer, basemaps } from "./Basemaps"
import { WFS } from 'ol/format.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { DefaultGridLayer } from "./VectorLayers/default-grid-layer";
import { VectorLayer } from "./VectorLayers/vector-layer";
import { getLayers } from "../../redux";
import { SpeciesGridLayers } from "./VectorLayers/species-grid-layers";
import { HeatMapLayer } from "./Heatmap/heatmap-layer";
import { useEffect, useState } from "react";
import { FeaturesContext } from "./features-context";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { HeatmapLayers } from "./Heatmap/heatmap-layers";
import { useMapContext } from "../map/map-context";
import { getGeoserverFeatures } from "./features-service";

export const LayersCollection = () => {
    const [features, setFeatures] = useState<Feature<Point>[]>([])

    useEffect(() => {
        getGeoserverFeatures("rmm")
            .then((feats) =>
                setFeatures(feats as Feature<Point>[]));
    }, [])

    return (
        <FeaturesContext.Provider value={{ features, setFeatures }}>
            <>
                {basemaps.map((basemap) => (
                    <BaseLayer
                        key={basemap.key}
                        title={basemap.key}
                        url={basemap.url}
                        attributions={basemap.attributions}
                        proj={basemap.proj}
                    />
                ))}
                <VectorLayer />
                <DefaultGridLayer />
                <SpeciesGridLayers />
                <HeatmapLayers />
            </>
        </FeaturesContext.Provider>
    );
};