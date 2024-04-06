import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { EGridTypes, getGridConfig, updateGridConfig } from "../../redux";
import { SingleSlider } from "../Slider";
import styles from "./ParamsPanel.module.scss";

export const GridParameters = React.memo(() => {
    const config = useSelector(getGridConfig);
    const dispatch = useDispatch();

    const options = [
        { value: EGridTypes.SQUARE, label: 'Квадратная' },
        { value: EGridTypes.HEX, label: 'Гексагональная' },
        { value: EGridTypes.TRIANGLE, label: 'Треугольная' },
    ];

    const onTypeChange = (selected: any) => {
        dispatch(updateGridConfig({ 'type': selected.value }));
    };

    const onSizeChange = (v: number) => {
        dispatch(updateGridConfig({ 'cellSize': v }));
    };

    return (
        <>
        <div className={styles.wrapper}>
            <label>Тип сетки</label>
            <Select
                options={options}
                value={options.find(option => option.value === config.type)}
                onChange={(selected) => onTypeChange(selected)}
            />
        </div>
        <div className={styles.wrapper}>
            <label>Размер ячейки (км)</label>
            <SingleSlider
                min={10}
                max={200}
                step={10}
                value={config.cellSize}
                onChange={onSizeChange}
            />
        </div>
        </>
    )
});