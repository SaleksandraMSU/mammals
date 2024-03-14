import { WFS } from 'ol/format.js';
import GeoJSON from 'ol/format/GeoJSON.js';

export const getGeoserverFeatures = async (
    layer: string,
) => {
    const featureRequest = new WFS().writeGetFeature({
        srsName: 'EPSG:3857',
        featureNS: 'mammals',
        featurePrefix: 'mammals',
        featureTypes: [`${layer}`],
        outputFormat: 'application/json',
    });

    const features = await fetch('http://localhost:8080/geoserver/mammals/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest),
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            const feats = new GeoJSON().readFeatures(json, {
                dataProjection: "EPSG:3857",
                featureProjection: "EPSG:3857",
            })
            return feats;
        });

    return features;
}