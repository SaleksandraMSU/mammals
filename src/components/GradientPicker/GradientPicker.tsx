import Select, { components, ControlProps, OptionProps } from 'react-select';
import { IGradientConfig } from "../../redux";
import styles from "./GradientPicker.module.scss";
import { GRADIENT_ITEMS, TGradientItem } from "./gradient-picker-constants";

type TGradientPickerProps = {
    gradient: IGradientConfig,
    onGradientColorChange: (param: keyof IGradientConfig, color: string) => void,
    onGradientChange: (v: any) => void,
};

export const GradientPicker = ({ gradient, onGradientColorChange, onGradientChange }: TGradientPickerProps) => {
    const { color1, color2, color3 } = gradient;
    const colors = Object.keys(gradient) as (keyof IGradientConfig)[];

    const CustomOption = (
        { innerRef, data, innerProps }: OptionProps<TGradientItem>
    ) => (
        <div
            ref={innerRef}
            {...innerProps} >
            <div className={styles.container}>
                <div
                    className={styles.boxGradient}
                    style={{
                        background: `linear-gradient(to right, 
                    ${data.value.color1}, 
                    ${data.value.color2}, 
                    ${data.value.color3})`
                    }}
                />
            </div>
        </div>
    );

    const CustomControl = (
        { children, ...props }: ControlProps<TGradientItem>
    ) => {
        const { value } = props.selectProps;
        if (!value) {
            return;
        }
        const val = (value as TGradientItem).value;
        const style = {
            marginLeft: "5px",
            width: "50px",
            height: "20px",
            background: `linear-gradient(to right, ${val.color1}, ${val.color2}, ${val.color3})`
        };

        return (
            <components.Control {...props}>
                <div style={style} />
                {children}
            </components.Control>
        );
    };

    return (
        <div className={styles.wrapper}>
            Градиент
            <div className={styles.boxWrapper}>
                <Select
                    options={GRADIENT_ITEMS}
                    value={GRADIENT_ITEMS.find(option => JSON.stringify(option.value) === JSON.stringify(gradient))}
                    onChange={(selected) => onGradientChange(selected)}
                    components={{ Option: CustomOption, Control: CustomControl }}
                    blurInputOnSelect
                    styles={{
                        valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            padding: "0px",
                        }),
                        control: (baseStyles) => ({
                            ...baseStyles,
                            border: "none",
                            backgroundColor: "transparent",
                        }),
                    }}
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
                                onChange={(e) => onGradientColorChange(color, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}