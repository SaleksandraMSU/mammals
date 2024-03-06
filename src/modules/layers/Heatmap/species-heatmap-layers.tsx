import { useSelector } from "react-redux";
import { EDisplayTypes, getDisplayMethod, getLayers } from "../../../redux";
import { SpeciesHeatmap } from "./species-heatmap";

export const SpeciesHeatmapLayers = () => {
    const speciesLayers = useSelector(getLayers);
    const displayMethod = useSelector(getDisplayMethod);

    if (displayMethod !== EDisplayTypes.HEATMAP) {
        return;
    }

    return (
        <>
            {speciesLayers.length > 0 ?
                speciesLayers.map((l) => (
                    <SpeciesHeatmap
                        key={l.value}
                        speciesVal={l.value!}
                        opacity={l.opacity}
                    />
                )
                ) : null
            }
        </>
    )
}