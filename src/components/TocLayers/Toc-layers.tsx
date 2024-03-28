import { useSelector } from "react-redux";
import { EDisplayTypes, getDefaultLayer, getDisplayMethod, getLayers } from "../../redux";
import { RadioButtons } from "../RadioButtons";
import { TocItem } from "./toc-item";
import styles from "./Toc-layers.module.scss";

export const TocLayers = () => {
    const layers = useSelector(getLayers);
    const defaultLayer = useSelector(getDefaultLayer);
    const displayMethod = useSelector(getDisplayMethod);

    const isButonsNotRender = [EDisplayTypes.POINTS, EDisplayTypes.HEATMAP]
        .includes(displayMethod) || layers.length < 2;

    return (
        <div>
            <div className={styles.title}>Векторные слои</div>
            {!isButonsNotRender && <RadioButtons />}
            {!layers.length ?
                <TocItem
                    key={defaultLayer.title}
                    value={9999}
                    title={defaultLayer.title}
                    opacity={defaultLayer.opacity}
                    color={defaultLayer.color}
                    gradient={defaultLayer.gradient}
                />
                :
                layers.map((lyr) =>
                    <TocItem
                        key={lyr.value}
                        value={lyr.value}
                        title={lyr.title}
                        opacity={lyr.opacity}
                        color={lyr.color}
                        gradient={lyr.gradient}
                    />
                )

            }
        </div>
    )
}