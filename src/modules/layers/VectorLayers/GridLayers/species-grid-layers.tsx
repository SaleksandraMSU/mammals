import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import * as turf from '@turf/turf';
import {
    EGridTypes,
    getDefaultLayer,
    getGridConfig,
    getIsZeroFilters,
    getLayers,
} from "../../../../redux";
import type { geoJsonPolygon, polygonFeatureCollection } from "../vector-layers-types";
import { SpeciesGrid } from "./species-grid";
import { GridLayer } from "./grid-layer";
import { createGrid } from "./grid-utils";
import { GridContext } from "./grid-context";
import { SpeciesGridsOverlapLayer } from "./species-grids-overlap-layer";

export const GridLayers = React.memo(() => {
    const [overlapFeatures, setOverlapFeatures] = useState<geoJsonPolygon[]>([]);
    const speciesLayers = useSelector(getLayers);
    const isNoFilters = useSelector(getIsZeroFilters);
    const config = useSelector(getGridConfig);
    const isHex = config.type === EGridTypes.HEX;
    const { opacity, gradient, color } = useSelector(getDefaultLayer);

    const generateGrid = useCallback(() => {
        const bbox1: turf.BBox = isHex ? [15, 0, 180, 90] : [0, 41, 180, 85];
        const bbox2: turf.BBox = isHex ? [-180, 0, -168, 90] : [-180, 41, -168, 85];
        const gridBefore180 = createGrid(config.type, bbox1, config.cellSize);
        const gridAfter180 = createGrid(config.type, bbox2, config.cellSize);
        const combinedFeatures = [...gridBefore180.features, ...gridAfter180.features];
        const featureCollection = turf.featureCollection(combinedFeatures);
        return featureCollection
    }, [config.type, config.cellSize]);

    const [grid, setGrid] = useState<polygonFeatureCollection>(generateGrid);

    useEffect(() => {
        const gridFeatures = generateGrid();
        setGrid(gridFeatures);
    }, [generateGrid]);

    return (
        <GridContext.Provider value={{ overlapFeatures, setOverlapFeatures }}>
            {speciesLayers.length > 0 ?
                <>
                    {speciesLayers.map((l) =>
                        <SpeciesGrid
                            key={l.value}
                            grid={grid}
                            speciesVal={l.value}
                            title={l.title}
                            opacity={l.opacity}
                            gradient={l.gradient}
                            color={l.color}
                            filters={l.filters}
                        />
                    )}
                    {speciesLayers.length > 1 && <SpeciesGridsOverlapLayer />}
                </>
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
        </GridContext.Provider>
    )
})