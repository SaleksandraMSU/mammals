import { useDispatch, useSelector } from "react-redux";
import { EDisplayTypes, deleteLayer, getDefaultLayer, getDisplayMethod, getIsSampleMode, getLayers, setZoomParams } from "../../redux";
import { GridRadioButtons } from "../Buttons";
import { TocItem } from "./toc-item";
import styles from "./Toc-layers.module.scss";

export const TocLayers = () => {
    const layers = useSelector(getLayers);
    const defaultLayer = useSelector(getDefaultLayer);
    const displayMethod = useSelector(getDisplayMethod);
    const isSampleMode = useSelector(getIsSampleMode);
    const dispatch = useDispatch();

    const isButonsNotRender = [EDisplayTypes.POINTS, EDisplayTypes.HEATMAP]
        .includes(displayMethod) || layers.length < 2;

    const onZoomClick = (val: number | undefined) => {
        dispatch(setZoomParams({ toLayer: val }));
    };

    const onRemoveLayer = (id: number) => {
        dispatch(deleteLayer(id));
    };

    return (
        <>
            <div>
                <div className={styles.title}>
                    Векторные слои
                </div>
                {!isButonsNotRender && <GridRadioButtons />}
                {(!isSampleMode && layers.length === 0) ?
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
                    layers.map((lyr, index) =>
                        <TocItem
                            key={`${lyr.title+index}`}
                            id={index}
                            title={lyr.title}
                            opacity={lyr.opacity}
                            color={lyr.color}
                            gradient={lyr.gradient}
                            onZoom={() => onZoomClick(lyr.value)}
                            onRemove={onRemoveLayer}
                            displayMethod={displayMethod}
                        />
                    )

                }
            </div>
        </>
    )
}