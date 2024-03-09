import React from "react";
import Layer from 'ol/layer/Layer.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import * as turf from '@turf/turf';
//@ts-ignore
import pointsWithinPolygon from '@turf/points-within-polygon';
//@ts-ignore
import { toWgs84 } from "@turf/projection"
import { useEffect, useMemo } from 'react';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { useMapContext } from '../../map/map-context';
import { useFeaturesContext } from '../layers-context';
import { useSelector } from 'react-redux';
import { EDisplayTypes, getDisplayMethod, getFiltersState, getGridConfig, getIsDisplayMethodChange, getZoomConfig } from '../../../redux';
import { createGrid } from './grid-utils';

type TSpeciesGridProps = {
    speciesVal: number;
    opacity: number;
}

export const SpeciesGrid = React.memo(({ speciesVal, opacity }: TSpeciesGridProps) => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const {
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);
    const config = useSelector(getGridConfig);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const zoom = useSelector(getZoomConfig);

    const filtered = features.filter((f) => {
        return (
            f.get('species') === speciesVal &&
            (museum.length > 0 ? museum.includes(f.get('genesis_da')) : true) &&
            f.get('year') >= dateRange[0] && f.get('year') <= dateRange[1] &&
            (months.length > 0 ? months.includes(f.get('month')) : true) &&
            (determinationMethod.length > 0 ? determinationMethod.includes(f.get('determ')) : true) &&
            (isReliable ? f.get('quality') === 3 : true)
        )
    })

    const collection = new GeoJSON().writeFeaturesObject(filtered, {
        dataProjection: "EPSG:3857",
        featureProjection: "EPSG:3857",
    });
    const projected = toWgs84(collection, { mutate: true })
    const bbox = turf.bbox(projected);

    const grid = createGrid(config.type, bbox, config.cellSize);

    const densityGrid = grid.features.map((cell) => {
        const pointCount = pointsWithinPolygon(projected, cell).features.length;
        cell.properties!.density = pointCount;
        return cell;
    });

    const gridFeatures = densityGrid.map((cell) => {
        return new Feature({
            geometry: new Polygon(cell.geometry.coordinates).transform("EPSG:4326", "EPSG:3857"),
            properties: cell.properties!.density
        });
    });

    const style = {
        'stroke-color': ['color', 0, 0, 0, opacity],
        'stroke-width': 1,
        'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'properties', 'number'],
            1, ['color', 245, 245, 0, opacity],
            5, ['color', 245, 184, 0, opacity],
            10, ['color', 245, 122, 0, opacity],
            15, ['color', 245, 81, 0, opacity],
            20, ['color', 245, 0, 0, opacity],
        ],
        filter: displayMethod === EDisplayTypes.MIX ? [">", ['get', 'properties', 'number'], 1] : [">", ['get', 'properties', 'number'], 0],
    };

    class WebGLLayer extends Layer {
        createRenderer(): any {
            return new WebGLVectorLayerRenderer(this, {
                style,
            });
        }
    };

    const source = useMemo(() => (
        new VectorSource({ features: gridFeatures })
    ), [filtered])

    const layer = useMemo(() => (
        new WebGLLayer({
            source: source,
            zIndex: 1,
            visible: isDisplayChangeActive ?
            (displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX)
            : true,
        })
    ), [style, source, config])


    useEffect(() => {
        map.addLayer(layer);
        !isDisplayChangeActive && layer.setMaxZoom(zoom.change);

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer, isDisplayChangeActive]);

    return null;
})