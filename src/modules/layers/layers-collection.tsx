import { useEffect, useState } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { BaseLayer, basemaps } from "./Basemaps"
import { DefaultGridLayer } from "./VectorLayers/default-grid-layer";
import { VectorLayer } from "./VectorLayers/vector-layer";
import { SpeciesGridLayers } from "./VectorLayers/species-grid-layers";
import { FeaturesContext } from "./features-context";
import { HeatmapLayers } from "./Heatmap/heatmap-layers";
import { getGeoserverFeatures } from "../../service";
import { useSelector } from "react-redux";
import { EDisplayTypes, getFiltersState, getIsDisplayMethodChange, getDisplayMethod, getLayers} from "../../redux";
import { ZoomToLayer } from "./ZoomToLayer";
import { SpeciesGridsCorrelation } from "./VectorLayers/SpeciesGridsCompare";

export const LayersCollection = () => {
    const [features, setFeatures] = useState<Feature<Point>[]>([]);
    const [data, setData] = useState<Feature<Point>[]>([]);
    const isDisplayChange = useSelector(getIsDisplayMethodChange)
    const displayMethod = useSelector(getDisplayMethod) as EDisplayTypes;
    const speciesLayers = useSelector(getLayers)
    const {
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);

    const isCustomGridsNotRender = isDisplayChange &&
        [EDisplayTypes.POINTS, EDisplayTypes.HEATMAP].includes(displayMethod);

    useEffect(() => {
        getGeoserverFeatures("rmm")
            .then((feats) =>
                setData(feats as Feature<Point>[]));
    }, []);

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
                <VectorLayer features={data}/>
                <DefaultGridLayer />
                {!isCustomGridsNotRender && <SpeciesGridLayers />}
                {!isCustomGridsNotRender && speciesLayers.length > 1 && <SpeciesGridsCorrelation />}
                <HeatmapLayers />
                <ZoomToLayer />
            </>
        </FeaturesContext.Provider>
    );
};