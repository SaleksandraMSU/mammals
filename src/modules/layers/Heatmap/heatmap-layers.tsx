import { useSelector } from "react-redux";
import { 
    EDisplayTypes, 
    getDefaultLayer, 
    getDisplayMethod, 
    getLayers 
} from "../../../redux";
import { Heatmap } from "./heatmap";

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
                    <Heatmap
                        key={l.value}
                        speciesVal={l.value}
                        opacity={l.opacity}
                        gradient={l.gradient}
                        filters={l.filters}
                    />
                )
                ) :
                <Heatmap
                    opacity={opacity}
                    gradient={gradient}
                />
            }
        </>
    )
}