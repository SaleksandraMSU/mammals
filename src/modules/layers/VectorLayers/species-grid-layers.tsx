import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { FeatureCollection, Polygon, GeoJsonProperties } from "geojson";
import * as turf from '@turf/turf';
import {
    getDefaultLayer,
    getGridConfig,
    getIsZeroFilters,
    getLayers,
    EDisplayTypes,
    getDisplayMethod,
    getIsDisplayMethodChange,
    ILayerConfrig
} from "../../../redux";
import { SpeciesGrid } from "./species-grid";
import { GridLayer } from "./grid-layer";
import { createGrid } from "./grid-utils";

export const SpeciesGridLayers = React.memo(() => {
    const speciesLayers = useSelector(getLayers);
    const isNoFilters = useSelector(getIsZeroFilters);
    const config = useSelector(getGridConfig);
    const { opacity, gradient, color } = useSelector(getDefaultLayer);

    const generateGrid = useCallback(() => {
        const gridBefore180 = createGrid(config.type, [0, 41, 180, 85], config.cellSize);
        const gridAfter180 = createGrid(config.type, [-180, 41, -168, 85], config.cellSize);
        const combinedFeatures = [...gridBefore180.features, ...gridAfter180.features];
        const featureCollection = turf.featureCollection(combinedFeatures);
        return featureCollection
    }, [config]);

    const [grid, setGrid] = useState<FeatureCollection<Polygon, GeoJsonProperties>>(generateGrid);

    useEffect(() => {
        const gridFeatures = generateGrid();
        setGrid(gridFeatures);
    }, [generateGrid]);

    return (
        <>
            {speciesLayers.length > 0 ?
                speciesLayers.map((l) =>
                    <SpeciesGrid
                        key={l.value}
                        grid={grid}
                        speciesVal={l.value}
                        title={l.title}
                        opacity={l.opacity}
                        gradient={l.gradient}
                        color={l.color}
                    />
                )
                :
                isNoFilters ?
                    <GridLayer />
                    :
                    <SpeciesGrid
                        key="all_data"
                        grid={grid}
                        opacity={opacity}
                        gradient={gradient}
                        color={color}
                    />
            }
        </>
    )
})