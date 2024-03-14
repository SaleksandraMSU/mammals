import { useDispatch, useSelector } from 'react-redux';
import Select, { OptionsOrGroups, GroupBase, MultiValue } from 'react-select';
import { IFiltersState } from '../../redux/types';
import { setFilters, setLayers } from '../../redux/actions';
import { DEFAULT_GRADIENT, getFiltersState } from '../../redux';
import { useState } from 'react';
import { getRandomColor } from './select-utils';

type TSelectProps = {
    options: OptionsOrGroups<any, GroupBase<any>>,
    title: string,
    value: keyof IFiltersState,
}

export const FilterSelect = ({ options, title, value }: TSelectProps) => {
    const filters = useSelector(getFiltersState);
    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState(false);

    const onChange = (selected: MultiValue<any>) => {
        if (selected.length === 4) {
            setDisabled(true);
        } else {
            disabled && setDisabled(false);
        };
        
        dispatch(setFilters({ [value]: selected.map(option => parseInt(option.value)) }));
        if (value === "species") {
            dispatch(setLayers(selected.map(option => (
                {
                    title: option.label.split('|')[1].trim(),
                    value: +option.value,
                    opacity: 1,
                    color: getRandomColor(),
                    gradient: DEFAULT_GRADIENT,
                }
            ))))
        }
    }

    return (
        <Select
            options={options}
            placeholder={title}
            value={options.filter(option => (filters[value] as number[]).includes(Number(option.value)))}
            onChange={(selected) => onChange(selected)}
            isOptionDisabled={() => disabled}
            isMulti
            isSearchable
            className="basic-multi-select"
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    marginTop: "10px",
                }),
            }}
        />
    )

}