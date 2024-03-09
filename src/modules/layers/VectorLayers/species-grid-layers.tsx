import { useSelector } from "react-redux";
import { getLayers } from "../../../redux";
import { SpeciesGrid } from "./species-grid";

export const SpeciesGridLayers = () => {
    const speciesLayers = useSelector(getLayers);

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