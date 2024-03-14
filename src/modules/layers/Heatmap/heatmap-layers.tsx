import { useSelector } from "react-redux";
import { EDisplayTypes, getDefaultLayer, getDisplayMethod, getLayers } from "../../../redux";
import { SpeciesHeatmap } from "./species-heatmap";

export const HeatmapLayers = () => {
    const speciesLayers = useSelector(getLayers);
    const displayMethod = useSelector(getDisplayMethod);
    const { opacity, gradient } = useSelector(getDefaultLayer);

    if (displayMethod !== EDisplayTypes.HEATMAP) {
        return;
    }

    return (
        <>
            {speciesLayers.length > 0 ?
                speciesLayers.map((l) => (
                    <SpeciesHeatmap
                        key={l.value}
                        speciesVal={l.value}
                        opacity={l.opacity}
                        gradient={l.gradient}
                    />
                )
                ) :
                <SpeciesHeatmap
                    opacity={opacity}
                    gradient={gradient}
                />
            }
        </>
    )
}