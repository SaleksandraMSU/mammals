import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { EGridTypes, getGridConfig, updateGridConfig } from "../../redux";
import styles from "./ParamsPanel.module.scss";
import { SingleSlider } from "../Slider/SingleSlider";

export const GridParameters = () => {
    const config = useSelector(getGridConfig);
    const dispatch = useDispatch();

    const options = [
        { value: EGridTypes.SQUARE, label: 'Квадратная' },
        { value: EGridTypes.HEX, label: 'Гексагональная' },
        { value: EGridTypes.TRIANGLE, label: 'Треугольная' },
    ]

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
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                    }),
                }}
            />
        </div>
        <div className={styles.wrapper}>
            <label>Размер ячейки</label>
            <SingleSlider
                min={0.25}
                max={5}
                step={0.25}
                value={config.cellSize}
                onChange={onSizeChange}
            />
        </div>
        </>
    )
}