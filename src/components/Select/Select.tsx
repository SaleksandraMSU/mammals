import { useSelector } from 'react-redux';
import { useState } from 'react';
import Select, { OptionsOrGroups, GroupBase, MultiValue } from 'react-select';
import { type IFiltersState, getFiltersState } from '../../redux';

type TFilter = keyof IFiltersState;

type TSelectProps = {
    options: OptionsOrGroups<any, GroupBase<any>>,
    title: string,
    value: TFilter,
    onSelect: (param: TFilter, value: boolean | number[]) => void,
    addLayers?: (options: MultiValue<any>) => void,
};

export const FilterSelect = ({ options, title, value, onSelect, addLayers }: TSelectProps) => {
    const filters = useSelector(getFiltersState);
    const [disabled, setDisabled] = useState(false);

    const onChange = (selected: MultiValue<any>) => {
        if (selected.length === 4) {
            setDisabled(true);
        } else {
            disabled && setDisabled(false);
        };
        onSelect(value, selected.map(option => parseInt(option.value)));
        addLayers && addLayers(selected);
    };

    return (
        <Select
            options={options}
            placeholder={title}
            value={options.filter(option =>
                (filters[value] as number[]).includes(Number(option.value))
            )}
            onChange={(selected) => onChange(selected)}
            isOptionDisabled={() => disabled}
            isMulti
            isSearchable
        />
    )

}