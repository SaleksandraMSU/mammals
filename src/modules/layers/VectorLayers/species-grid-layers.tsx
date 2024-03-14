import { useSelector } from "react-redux";
import { getDefaultLayer, getIsZeroFilters, getLayers } from "../../../redux";
import { SpeciesGrid } from "./species-grid";
import { GridLayer } from "./grid-layer";

export const SpeciesGridLayers = () => {
    const speciesLayers = useSelector(getLayers);
    const isNoFilters = useSelector(getIsZeroFilters);
    console.log(isNoFilters)
    const { opacity, gradient } = useSelector(getDefaultLayer);

    return (
        <>
            {speciesLayers.length > 0 ?
                speciesLayers.map((l) => (
                    <SpeciesGrid
                        key={l.value}
                        speciesVal={l.value}
                        opacity={l.opacity}
                        gradient={l.gradient}
                    />
                )
                ) :
                isNoFilters ?
                    <GridLayer />
                    :
                    <SpeciesGrid
                        key={"all_data"}
                        opacity={opacity}
                        gradient={gradient}
                    />
            }
        </>
    )
}