import { useDispatch } from "react-redux";
import Select, { components, ControlProps, OptionProps } from 'react-select';
import cn from "classnames";
import { IGradientConfig, updateDefaultLayer, updateSpeciesLayer } from "../../redux";
import styles from "./GradientPicker.module.scss";
import { GRADIENT_ITEMS, TGradientItem } from "./gradient-picker-constants";

type TGradientPickerProps = {
    title: string,
    gradient: IGradientConfig,
};

export const GradientPicker = ({ title, gradient }: TGradientPickerProps) => {

    const dispatch = useDispatch();
    const { color1, color2, color3 } = gradient;
    const colors = Object.keys(gradient) as (keyof IGradientConfig)[];

    const CustomOption = (
        { innerRef, data, innerProps }: OptionProps<TGradientItem>
    ) => (
        <div
            ref={innerRef}
            {...innerProps} >
            <div className={styles.container}>
                <div className={styles.boxGradient} style={{ background: `linear-gradient(to right, ${data.value.color1}, ${data.value.color2}, ${data.value.color3})` }} />
            </div>
        </div>
    );

    const CustomControl = (
        { children, ...props }: ControlProps<TGradientItem>
    ) => {
        const { value } = props.selectProps;
        //@ts-ignore
        const style = { margin: "5px", width: "40px", height: "20px", background: `linear-gradient(to right, ${value.value.color1}, ${value.value.color2}, ${value.value.color3})` };

        return (
            <components.Control {...props}>
                <div style={style} />
                {children}
            </components.Control>
        );
    };

    const onColorChange = (param: keyof IGradientConfig, color: string) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ "gradient": { ...gradient, [param]: color } }));
        } else {
            dispatch(updateSpeciesLayer({
                title: title,
                prop: 'gradient',
                value: { ...gradient, [param]: color }
            }));
        };
    }

    const onGradientChange = (selected: any) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ "gradient": selected.value }));
        } else {
            dispatch(updateSpeciesLayer({
                title: title,
                prop: 'gradient',
                value: selected.value
            }));
        };
    }

    return (
        <div className={styles.wrapper}>
            Градиент
            <div className={styles.boxWrapper}>
                <Select
                    options={GRADIENT_ITEMS}
                    value={GRADIENT_ITEMS.find(option => JSON.stringify(option.value) === JSON.stringify(gradient))}
                    onChange={(selected) => onGradientChange(selected)}
                    components={{ Option: CustomOption, Control: CustomControl }}
                />
                <div
                    className={styles.box}
                    style={{ background: `linear-gradient(to right, ${color1}, ${color2}, ${color3})` }}>
                    <div className={styles.colorsInput}>
                        {colors.map((color) => (
                            <input
                                key={color}
                                type="color"
                                value={gradient[color]}
                                onChange={(e) => onColorChange(color, e.target.value)} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}