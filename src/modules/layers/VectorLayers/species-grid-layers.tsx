import { useSelector } from "react-redux";
import { EDisplayTypes, getDisplayMethod, getLayers } from "../../../redux";
import { SpeciesGrid } from "./species-grid";

export const SpeciesGridLayers = () => {
    const speciesLayers = useSelector(getLayers);
    const displayMethod = useSelector(getDisplayMethod);

    if (displayMethod !== EDisplayTypes.GRID && displayMethod !== EDisplayTypes.MIX) {
        return;
    }

    return (
        <>
            {speciesLayers.length > 0 ?
                speciesLayers.map((l) => (
                    <SpeciesGrid
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