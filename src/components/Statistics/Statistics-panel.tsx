import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { and, between, equalTo } from 'ol/format/filter';
import Filter from "ol/format/filter/Filter";
import {
    EDisplayTypes,
    getDefaultLayer,
    getDisplayMethod,
    getFiltersState,
    getIsDisplayMethodChange,
    getIsZeroFilters,
    getLayers
} from "../../redux";
import { getFeaturesCount } from "../../service";
import { StatisticsItem } from "./StatisticsItem";
import { DEFAULT_ITEMS } from "./statistics-constants";
import { getMedian, createFilter, getItems } from "./statistics-utils";
import styles from "./Statistics-panel.module.scss";

export const StatisticsPanel = () => {
    const layers = useSelector(getLayers);
    const defaultLayer = useSelector(getDefaultLayer);
    const isNoFilters = useSelector(getIsZeroFilters);
    const isDisplayChange = useSelector(getIsDisplayMethodChange);
    const displayMethod = useSelector(getDisplayMethod);
    const {
        species,
        museum,
        months,
        dateRange,
        determinationMethod,
        isReliable
    } = useSelector(getFiltersState);

    const initVars = {
        mean: 0,
        max: 0,
        min: 0,
        median: 0,
    };
    const [count, setCount] = useState<number>(0);
    const [vars, setVars] = useState(initVars);
    let statistics: number[] = [];

    useEffect(() => {
        if (layers.length > 0) {
            layers.forEach((l) => {
                const stats = l.gridCells.map((cell) => cell.properties!.density as number);
                statistics.push(...stats)
            });
        } else {
            const stats = defaultLayer.gridCells.map((cell) => cell.properties!.density as number);
            statistics = stats;
        };

        if (statistics.length) {
            const mean = Math.floor(statistics.reduce(
                (sum, currentValue) => sum + currentValue, 0
            ) / statistics.length);
            const max = Math.max(...statistics);
            const min = Math.min(...statistics);
            const median = getMedian(statistics);
            setVars({ mean, max, min, median });
        } else {
            setVars(initVars);
        }
    }, [layers, defaultLayer]);

    useEffect(() => {
        const speciesFilter = createFilter(species, "species");
        const museumsFilter = createFilter(museum, "genesis_da");
        const monthsFilter = createFilter(months, "month");
        const methodFilter = createFilter(determinationMethod, "determ");
        const datesFilter = between("year", dateRange[0], dateRange[1]);
        const reliableFilter = isReliable ? equalTo("quality", 3) : null;

        const filters = [speciesFilter, museumsFilter, monthsFilter, methodFilter, datesFilter, reliableFilter]
            .filter(f => f) as Filter[];
        const combined = filters.length === 1 ? filters[0] : and(...filters);

        getFeaturesCount("rmm", combined)
            .then((c) => setCount(c))
    }, [
        species,
        museum,
        months,
        determinationMethod,
        dateRange,
        isReliable
    ]);

    const { mean, max, min, median } = vars;
    const items = isNoFilters ? DEFAULT_ITEMS : getItems(count, mean, median, max, min);
    const isRendergridCells = isDisplayChange ?
        [EDisplayTypes.GRID, EDisplayTypes.MIX].includes(displayMethod)
        :
        true;

    return (
        <StatisticsItem title="Количество записей">
            <div className={styles.wrapper}>
                <div className={styles.grid}>
                    <React.Fragment key={items[0].label}>
                        <div>{items[0].label}</div>
                        <div>{items[0].value}</div>
                    </React.Fragment>
                </div>
                {isRendergridCells &&
                    <>
                        <div>По ячейкам</div>
                        <div className={styles.grid}>
                            {items.slice(1).map((item) =>
                                <React.Fragment key={item.label}>
                                    <div>{item.label}</div>
                                    <div>{item.value}</div>
                                </React.Fragment>
                            )}
                        </div>
                    </>
                }
            </div>
        </StatisticsItem>
    )
}