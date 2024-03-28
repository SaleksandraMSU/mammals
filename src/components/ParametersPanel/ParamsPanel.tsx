import { useSelector } from "react-redux";
import { useState } from "react";
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import { EDisplayTypes, getDisplayMethod, getIsDisplayMethodChange } from "../../redux";
import { GridParameters } from "./grid-params";
import { HeatmapParameters } from "./heatmap-params";
import { PointsParameters } from "./point-params";
import styles from "./ParamsPanel.module.scss";

export const ParametersPanel = () => {
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const [active, setActive] = useState(false);

    if (!isDisplayChangeActive) {
        return;
    }

    const isPointParams = displayMethod === EDisplayTypes.POINTS || displayMethod === EDisplayTypes.MIX;
    const isGridParams = displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX;
    const isHeatmapParams = displayMethod === EDisplayTypes.HEATMAP;

    return (
        <>
            <div
                className={styles.text}
                onClick={() => setActive(!active)}
            >
                {active ? <AiFillMinusSquare size={15} /> : <AiFillPlusSquare size={15} />}  Дополнительные параметры
            </div>
            {active &&
                <div className={styles.panel}>
                    {isPointParams && <PointsParameters />}
                    {isGridParams && <GridParameters />}
                    {isHeatmapParams && <HeatmapParameters />}
                </div>
            }
        </>
    )
}