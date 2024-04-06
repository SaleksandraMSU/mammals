import { useSelector } from "react-redux"
import React from "react";
import { getIntersectingGridFeatsStats, getLayers } from "../../../redux"
import { StatisticsItem } from "../StatisticsItem"
import styles from "./species-compare-panel.module.scss";

const message = "Добавьте на карту минимум 2 вида для подсчета статистики";

export const SpeciesComparePanel = () => {
    const layers = useSelector(getLayers);
    const { area, count } = useSelector(getIntersectingGridFeatsStats);
    const cellsCount = layers.map((l) => l.gridCells.length);
    const overallCellsSum = cellsCount.reduce((acc, current) => acc + current, 0);
    const percentage = count ? ((count / overallCellsSum) * 100).toFixed(1) : 0;
    const areaKm = (Number(area) / 1000000).toFixed(1);

    return (
        <StatisticsItem title="Распространение видов">
            <div className={styles.wrapper}>
                {layers.length < 2 ?
                    <div>{message}</div>
                    :
                    <div className={styles.grid}>
                        <React.Fragment>
                            <div>Процент пересекающихся ячеек</div>
                            <div>{percentage}%</div>
                        </React.Fragment>
                        <React.Fragment>
                            <div>Общая площадь пересекающихся ячеек (км2)</div>
                            <div>{areaKm}</div>
                        </React.Fragment>
                    </div>
                }
            </div>
        </StatisticsItem>
    )
}