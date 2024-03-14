import React, { useState } from "react";
import { useSelector } from 'react-redux';
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
import { Geometry, Polygon } from 'ol/geom';
import { useMapContext } from '../../map/map-context';
import { useFeaturesContext } from '../features-context';
import { EDisplayTypes, IGradientConfig, getDisplayMethod, getFiltersState, getGridConfig, getIsDisplayMethodChange, getZoomConfig } from '../../../redux';
import { createGrid } from './grid-utils';
import { getInterimColor, hexToRgb } from "../layers-utils";

type TSpeciesGridProps = {
    speciesVal?: number;
    opacity: number;
    gradient: IGradientConfig;
}

export const SpeciesGrid = React.memo(({ speciesVal, opacity, gradient }: TSpeciesGridProps) => {
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
    const [gridFeats, setGridFeats] = useState<Feature<Geometry>[]>([])

    useEffect(() => {
        const filtered = features.filter((f) => {
            return (
                (speciesVal ? f.get('species') === speciesVal : true) &&
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
        if (bbox[0] < 0) {
            bbox.splice(0, 1, 0)
        };

        const grid = createGrid(config.type, bbox, config.cellSize);

        const densityGrid = grid.features.map((cell) => {
            try {
                const pointCount = pointsWithinPolygon(projected, cell).features.length;
                cell.properties!.density = pointCount;
                console.log(pointCount)
            }
            catch (e) {
                console.log(e)
            }
            return cell;
        });

        const gridFeatures = densityGrid.map((cell) => {
            return new Feature({
                geometry: new Polygon(cell.geometry.coordinates).transform("EPSG:4326", "EPSG:3857"),
                properties: cell.properties!.density
            });
        });
        setGridFeats(gridFeatures)
    }, [
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable,
        config,
    ])

    const colors = Object.values(gradient).map((hex) => {
        const color = hexToRgb(hex);
        color.push(opacity)
        return color;
    });

    const style = {
        'stroke-color': ['color', 0, 0, 0, opacity],
        'stroke-width': 1,
        'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'properties', 'number'],
            1, colors[0],
            5, getInterimColor(colors[0], colors[1], opacity),
            10, colors[1],
            15, getInterimColor(colors[1], colors[2], opacity),
            20, colors[2],
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
        new VectorSource({ features: gridFeats })
    ), [gridFeats])

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