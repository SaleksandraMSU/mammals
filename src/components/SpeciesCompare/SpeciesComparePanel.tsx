import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select';
import { useEffect, useState } from "react";
import { IGridsCompare, getGridCompareLayers, getLayers, setCompareGridLayers } from "../../redux"
import { StatisticsItem } from "../StatisticsItem"
import styles from "./SpeciesComparePanel.module.scss";

type TOption = {
    value: number,
    label: string,
}

export const SpeciesComparePanel = () => {
    const layers = useSelector(getLayers);
    const compareLayers = useSelector(getGridCompareLayers);
    const dispatch = useDispatch();
    const [options, setOptions] = useState<TOption[]>([]);

    useEffect(() => {
        if (layers.length) {
            const options = layers.map((lyr) => {
                return (
                    {
                        value: lyr.value!,
                        label: lyr.title,
                    }
                )
            });
            setOptions(options);
        }
    }, [layers]);

    const onLayerChange = (selected: any, param: keyof IGridsCompare) => {
        dispatch(setCompareGridLayers({ [param]: selected.value }));
    };

    return (
        <StatisticsItem title="Распространение видов">
            <div className={styles.wrapper}>
                <Select
                    options={options.filter((opt) => opt.value !== compareLayers.layer2)}
                    value={options.find(option => option.value === compareLayers.layer1)}
                    onChange={(selected) => onLayerChange(selected, "layer1")}
                    isClearable
                />
                <Select
                    options={options.filter((opt) => opt.value !== compareLayers.layer1)}
                    value={options.find(option => option.value === compareLayers.layer2)}
                    onChange={(selected) => onLayerChange(selected, "layer2")}
                    isClearable
                />
            </div>
        </StatisticsItem>
    )
}