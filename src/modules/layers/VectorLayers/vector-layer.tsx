import React from "react";
import { Feature, Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileJSON from 'ol/source/TileJSON';
import TileWMS from 'ol/source/TileWMS.js';
import OlGeoJSON from 'ol/format/GeoJSON';
import { MVT, WFS } from 'ol/format.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js'
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Geometry, Point } from 'ol/geom';
import { useEffect, useMemo, useRef, useState } from 'react';
import CircleStyle from 'ol/style/Circle.js';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { useMapContext } from "../../map/map-context"
import { useSelector } from 'react-redux';
import {
    EDisplayTypes,
    getDefaultLayer,
    getDisplayMethod,
    getFiltersState,
    getIsDisplayMethodChange,
    getLayers,
    getPointsConfig,
    getZoomConfig,
} from '../../../redux';
import styles from "./vector-layer.module.scss";
import { useFeaturesContext } from '../features-context';
import VectorTile from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import WebGLVectorTileLayerRenderer from 'ol/renderer/webgl/VectorTileLayer.js';


export const VectorLayer = React.memo(() => {
    const { map } = useMapContext();
    const { features } = useFeaturesContext();
    const defaultLayer = useSelector(getDefaultLayer);
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const zoom = useSelector(getZoomConfig);
    const config = useSelector(getPointsConfig);
    const layers = useSelector(getLayers);
    const { species,
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);

    const style = {
        "circle-radius": config.auto ?
            [
                "interpolate",
                ["exponential", 2],
                ["zoom"],
                5, 1,
                10, 4,
                15, 8
            ] : config.pointRadius,
        "circle-fill-color": layers.length > 0 ?
            ['match', ['get', 'species', 'number'],
                layers[0].value!, layers[0].color!,
                layers[1] ? layers[1].value! : 0,
                layers[1] ? layers[1].color! : "#FF8000",
                layers[2] ? layers[2].value! : 0,
                layers[2] ? layers[2].color! : "#FF8000",
                layers[3] ? layers[3].value! : 0,
                layers[3] ? layers[3].color! : "#FF8000",
                "#FF8000"
            ] : defaultLayer.color!,
        "circle-stroke-color": "black",
        "circle-stroke-width": 0,
        "circle-opacity": layers.length > 0 ?
            ['match', ['get', 'species', 'number'],
                layers[0].value, layers[0].opacity,
                layers[1] ? layers[1].value : 0,
                layers[1] ? layers[1].opacity : 1,
                layers[2] ? layers[2].value : 0,
                layers[2] ? layers[2].opacity : 1,
                layers[3] ? layers[3].value : 0,
                layers[3] ? layers[3].opacity : 1,
                1
            ] : defaultLayer.opacity,
        filter: ['all',
            species.length > 0 ? ['in', ['get', 'species', 'number'], species] : true,
            museum.length > 0 ? ['in', ['get', 'genesis_da', 'number'], museum] : true,
            ['between', ['get', 'year', 'number'], dateRange[0], dateRange[1]],
            months.length > 0 ? ['in', ['get', 'month', 'number'], months] : true,
            determinationMethod.length > 0 ? ['in', ['get', 'determ', 'number'], determinationMethod] : true,
            isReliable ? ['==', ['get', 'quality', 'number'], 3] : true,
        ],
    };

    class WebGLVectorTileLayer extends VectorTile {
        createRenderer(): any {
            return new WebGLVectorTileLayerRenderer(this, {
                disableHitDetection: false,
                style: style,
            });
        }
    }

    // const source = new VectorTileSource({
    //     format: new MVT(),
    //     projection: map.getView().getProjection(),
    //     url:
    //         'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/mammals:rmm@EPSG:900913@pbf/{z}/{x}/{-y}.pbf'
    // });


    const source = useMemo(() =>
        new VectorSource<Feature<Point>>({
            // url: 'src/rmm.geojson',
            // format: new GeoJSON(),
            // url: function () {
            //     return (
            //         'http://localhost:8080/geoserver/wfs?service=WFS&' +
            //         'version=2.0.0&request=GetFeature&typename=mammals:rmm&' +
            //         'outputFormat=application/json&srsname=EPSG:3857&'
            //     );
            features: features
        }), [features]);


    const layer = useMemo(() =>
        new WebGLPointsLayer({
            source: source,
            style: style,
            visible: displayMethod === EDisplayTypes.POINTS || displayMethod === EDisplayTypes.MIX,
        }
        ), [source, style, displayMethod]);


    useEffect(() => {
        map.addLayer(layer);
        !isDisplayChangeActive && layer.setMinZoom(zoom.change);

        // layer.getSource()?.on("featuresloadstart", function () {
        //     map.getTargetElement().classList.add(styles.spinner);
        // });
        // layer.getSource()?.on("featuresloadend", function () {
        //     map.getTargetElement().classList.remove(styles.spinner);
        // });

        return () => {
            map.removeLayer(layer);
        }
    }, [map, layer, isDisplayChangeActive]);

    // useEffect(() => {
    //     !features.length ?
    //         map.getTargetElement().classList.add(styles.spinner)
    //         :
    //         map.getTargetElement().classList.remove(styles.spinner);
    // }, [map, features.length])

    //  const layerWMS = new TileLayer({
    //     source: new TileWMS({
    //         url: "https://zmmu.msu.ru/geoserver/MammalsRussia/wms",
    //         params: {'LAYERS': "MammalsRussia:data_basic", 'TILED': true },
    //         serverType: 'geoserver'
    //     }),
    // });

    return null;




    // const layer = new VectorLayer({
    //     source: new VectorSource({
    //         url: './src/mammals.geojson',
    //         format: new GeoJSON(),
    //     }),
    //     style: new Style({
    //         image: new CircleStyle({
    //           radius: 5,
    //           stroke: new Stroke({
    //             color: 'blue',
    //           }),
    //           fill: new Fill({
    //             color: 'red',
    //           }),
    //         }),
    //     }),
    //     declutter: true,
    // })
})