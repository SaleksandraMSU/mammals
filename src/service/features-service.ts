import axios from 'axios';
import { WFS } from 'ol/format.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Filter from 'ol/format/filter/Filter';

export const getGeoserverFeatures = async (
    layer: string,
    crs: string,
) => {
    const featureRequest = new WFS().writeGetFeature({
        srsName: crs,
        featureNS: 'mammals',
        featurePrefix: 'mammals',
        featureTypes: [`${layer}`],
        outputFormat: 'application/json',
    });

    const xmlString = new XMLSerializer().serializeToString(featureRequest);

    const features = await axios.post('http://localhost:8080/geoserver/mammals/wfs', 
    xmlString,
    {
        headers: { 'Content-Type': 'application/xml' },
    })
        .then(function (response) {
            return response.data;
        })
        .then(function (json) {
            const feats = new GeoJSON().readFeatures(json, {
                dataProjection: crs,
                featureProjection: crs,
            })
            return feats;
        });

    return features;
}

export const getFeaturesCount = async (
    layer: string,
    filters?: Filter,
) => {
    const featureRequest = new WFS().writeGetFeature({
        featureNS: 'mammals',
        featurePrefix: 'mammals',
        featureTypes: [`${layer}`],
        filter: filters,
        resultType: "hits",
    });

    const xmlString = new XMLSerializer().serializeToString(featureRequest);

    const count = axios.post('http://localhost:8080/geoserver/mammals/wfs', 
    xmlString,
    {
        headers: { 'Content-Type': 'application/xml' },
    })
        .then(function (response) {
            return response.data;
        })
        .then(function (text) {
            const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
            const attribute = xmlDoc.documentElement.getAttribute("numberOfFeatures")
            return Number(attribute);
        });

    return Number.isNaN(count) ? 0 : count;
}