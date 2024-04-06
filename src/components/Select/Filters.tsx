import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { MultiValue } from "react-select";
import {
    IFiltersState,
    getDates,
    getIsReliable,
    resetFilters,
    setFilters,
    setLayers
} from "../../redux";
import { DoubleSlider } from "../Slider"
import { Checkbox } from "../Checkbox";
import { GRADIENT_ITEMS } from "../GradientPicker";
import { ResetButton } from "../Buttons/ResetButton";
import { getRandomColor } from "./select-utils";
import { FilterSelect } from "./Select";
import { methods, months, museums, species } from "./data";
import styles from "./filters.module.scss";

export const Filters = () => {
    const isReliable = useSelector(getIsReliable);
    const dates = useSelector(getDates);
    const dispatch = useDispatch();

    const onChange = useCallback(
        (param: keyof IFiltersState, value: boolean | number[]) => {
            dispatch(setFilters({ [param]: value }));
        },
        [dispatch]
    );

    const setSpeciesLayers = (options: MultiValue<any>) => {
        dispatch(setLayers(
            options.map((option, index) => (
                {
                    title: option.label.split('|')[1].trim(),
                    value: +option.value,
                    opacity: 1,
                    color: getRandomColor(),
                    gradient: GRADIENT_ITEMS[index].value,
                    gridCells: [],
                }
            ))
        ))
    };

    const onReset = () => {
        dispatch(resetFilters());
        dispatch(setLayers([]));
    };

    return (
        <div className={styles.wrapper}>
            <FilterSelect
                options={species}
                title="Виды"
                value="species"
                onSelect={onChange}
                addLayers={setSpeciesLayers}
            />
            <DoubleSlider
                value={dates}
                onChange={onChange}
            />
            <FilterSelect
                options={months}
                title="Месяцы"
                value="months"
                onSelect={onChange}
            />
            <FilterSelect
                options={museums}
                title="Источник данных"
                value="museum"
                onSelect={onChange}
            />
            <FilterSelect
                options={methods}
                title="Способ определения"
                value="determinationMethod"
                onSelect={onChange}
            />
            <Checkbox
                label="Только надежные"
                isChecked={isReliable}
                onChange={() => onChange("isReliable", !isReliable)}
            />
            <ResetButton
                onReset={onReset}
            />
        </div>
    )
};