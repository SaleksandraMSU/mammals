import { useSelector } from "react-redux";
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import styles from "./ParamsPanel.module.scss";
import { EDisplayTypes, getDisplayMethod, getIsDisplayMethodChange } from "../../redux";
import { GridParameters } from "./grid-params";
import { useState } from "react";
import { HeatmapParameters } from "./heatmap-params";
import { PointsParameters } from "./point-params";

export const ParametersPanel = () => {
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const [active, setActive] = useState(false);

    if (!isDisplayChangeActive) {
        return;
    }

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
                    {(displayMethod === EDisplayTypes.POINTS || displayMethod === EDisplayTypes.MIX) && <PointsParameters />}
                    {(displayMethod === EDisplayTypes.GRID || displayMethod === EDisplayTypes.MIX) && <GridParameters />}
                    {displayMethod === EDisplayTypes.HEATMAP && <HeatmapParameters />}
                </div>
            }
        </>
    )
}