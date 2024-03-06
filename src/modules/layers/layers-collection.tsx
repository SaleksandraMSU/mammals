import { useSelector } from "react-redux";
import { BaseLayer, basemaps } from "./Basemaps"
import { WFS } from 'ol/format.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { GridLayer } from "./VectorLayers/grid-layer";
import { VectorLayer } from "./VectorLayers/vector-layer";
import { getLayers } from "../../redux";
import { SpeciesGridLayers } from "./VectorLayers/species-grid-layers";
import { HeatMapLayer } from "./Heatmap/heatmap-layer";
import { useEffect, useState } from "react";
import { FeaturesContext } from "./layers-context";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { SpeciesHeatmapLayers } from "./Heatmap/species-heatmap-layers";
import { useMapContext } from "../map/map-context";

export const LayersCollection = () => {
    const [features, setFeatures] = useState<Feature<Point>[]>([])
    // const featureRequest = new WFS().writeGetFeature({
    //     srsName: 'EPSG:3857',
    //     featureNS: 'mammals',
    //     featurePrefix: 'mammals',
    //     featureTypes: ['rmm'],
    //     outputFormat: 'application/json',
    // });

    // useEffect(() => {
    //     console.log('start')
    //     fetch('http://localhost:8080/geoserver/mammals/wfs', {
    //         method: 'POST',
    //         body: new XMLSerializer().serializeToString(featureRequest),
    //     })
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (json) {
    //             console.log("continue")
    //             const feats = new GeoJSON().readFeatures(json, {
    //                 dataProjection: "EPSG:3857",
    //                 featureProjection: "EPSG:3857",
    //             })
    //             setFeatures(feats)
    //             console.log("loaded")
    //         });
    // }, [])


    return (
        <FeaturesContext.Provider value={{ features, setFeatures }}>
            <>
                {basemaps.map((basemap) => (
                    <BaseLayer
                        key={basemap.key}
                        title={basemap.key}
                        url={basemap.url}
                        proj={basemap.proj}
                    />
                ))}
                <VectorLayer />
                <GridLayer />
                <SpeciesGridLayers />
                <HeatMapLayer />
                <SpeciesHeatmapLayers />
            </>
        </FeaturesContext.Provider>
    );
};