import { useDispatch, useSelector } from "react-redux";
import Select, { OptionProps } from 'react-select';
import cn from "classnames";
import { getActiveBasemap, setActiveBasemap } from "../../../redux";
import { basemapsItems, type IBasemapItem } from "./basemaps-constants";
import styles from "./basemaps-select.module.scss";

export const BasemapsSelect = () => {
    const activeBasemap = useSelector(getActiveBasemap);
    const dispatch = useDispatch();

    const onBasemapChange = (selected: any) => {
        dispatch(setActiveBasemap(selected.value));
    };

    const CustomOption: React.ComponentType<OptionProps<IBasemapItem>> = (
        { innerRef, data, isSelected, innerProps }
    ) => (
        <div
            ref={innerRef}
            {...innerProps} >
            <div className={cn(styles.container, {
                [styles.selected]: isSelected
            })}
            >
                <img src={data.icon} height={34} width={45} />
                {data.label}
            </div>
        </div>
    );

    return (
        <>
            <div className={styles.title}>Базовая карта</div>
            <Select
                options={basemapsItems}
                value={basemapsItems.find(option => option.value === activeBasemap)}
                onChange={(selected) => onBasemapChange(selected)}
                components={{ Option: CustomOption }}
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                        marginTop: "10px",
                    }),
                }}
            />
        </>
    )
};