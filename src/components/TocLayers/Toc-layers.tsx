import { useDispatch, useSelector } from "react-redux";
import { EDisplayTypes, getDefaultLayer, getDisplayMethod, getLayers, setZoomParams, updateDefaultLayer, updateSpeciesLayer } from "../../redux";
import { GridRadioButtons } from "../Buttons";
import { TocItem } from "./toc-item";
import styles from "./Toc-layers.module.scss";

export const TocLayers = () => {
    const layers = useSelector(getLayers);
    const defaultLayer = useSelector(getDefaultLayer);
    const displayMethod = useSelector(getDisplayMethod);
    const dispatch = useDispatch();

    const isButonsNotRender = [EDisplayTypes.POINTS, EDisplayTypes.HEATMAP]
        .includes(displayMethod) || layers.length < 2;

    const onZoomClick = (val: number | undefined) => {
        dispatch(setZoomParams({ toLayer: val }));
    };

    return (
        <div>
            <div className={styles.title}>Векторные слои</div>
            {!isButonsNotRender && <GridRadioButtons />}
            {!layers.length ?
                <TocItem
                    key={defaultLayer.title}
                    title={defaultLayer.title}
                    opacity={defaultLayer.opacity}
                    color={defaultLayer.color}
                    gradient={defaultLayer.gradient}
                    onZoom={() => onZoomClick(9999)}
                    displayMethod={displayMethod}
                />
                :
                layers.map((lyr) =>
                    <TocItem
                        key={lyr.value}
                        title={lyr.title}
                        opacity={lyr.opacity}
                        color={lyr.color}
                        gradient={lyr.gradient}
                        onZoom={() => onZoomClick(lyr.value)}
                        displayMethod={displayMethod}
                    />
                )

            }
        </div>
    )
}