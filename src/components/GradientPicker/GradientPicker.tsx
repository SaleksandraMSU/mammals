import { useDispatch } from "react-redux";
import { IGradientConfig, updateDefaultLayer, updateSpeciesLayer } from "../../redux";
import styles from "./GradientPicker.module.scss";

type TGradientPickerProps = {
    title: string,
    gradient: IGradientConfig,
};

export const GradientPicker = ({ title, gradient }: TGradientPickerProps) => {

    const dispatch = useDispatch();
    const { color1, color2, color3 } = gradient;
    const colors = Object.keys(gradient) as (keyof IGradientConfig)[];

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

    return (
        <div className={styles.wrapper}>
            <div className={styles.boxWrapper}>
                <label>Градиент</label>
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