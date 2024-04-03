import { useDispatch, useSelector } from "react-redux";
import Select, { components, ControlProps, OptionProps } from 'react-select';
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

    const CustomOption = (
        { innerRef, data, isSelected, innerProps }: OptionProps<IBasemapItem>
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

    const CustomControl = (
        { children, ...props }: ControlProps<IBasemapItem>
    ) => {
        const { value } = props.selectProps;
        const style = { margin: "3px" };

        return (
            <components.Control {...props}>
                <img src={(value as IBasemapItem).icon} height={30} width={40} style={style} />
                {children}
            </components.Control>
        );
    };

    return (
        <>
            <div className={styles.title}>Базовая карта</div>
            <Select
                options={basemapsItems}
                value={basemapsItems.find(option => option.value === activeBasemap)}
                onChange={(selected) => onBasemapChange(selected)}
                components={{ Option: CustomOption, Control: CustomControl }}
                blurInputOnSelect
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