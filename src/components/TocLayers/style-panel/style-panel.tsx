import { useDispatch, useSelector } from "react-redux";
import {
    EDisplayTypes,
    IGradientConfig,
    getIsDisplayMethodChange,
    updateDefaultLayer,
    updateSpeciesLayer
} from "../../../redux";
import { SingleSlider } from "../../Slider";
import { GradientPicker } from "../../GradientPicker";
import styles from "./style-panel.module.scss";

type TStylePanelProps = {
    title: string,
    opacity: number,
    color?: string,
    gradient: IGradientConfig,
    displayMethod: string,
}

export const StylePanel = (
    { title, opacity, color, gradient, displayMethod }: TStylePanelProps) => {
    const dispatch = useDispatch();
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const isGradientRender = !isDisplayChangeActive || displayMethod !== EDisplayTypes.POINTS;


    const onChange = (v: number) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ opacity: v }));
        } else {
            dispatch(updateSpeciesLayer({ title: title, prop: 'opacity', value: v }));
        };
    };

    const onColorChange = (color: string) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ "color": color }));
        } else {
            dispatch(updateSpeciesLayer({ title: title, prop: 'color', value: color }));
        };
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.panel}>
                <label>Непрозрачность</label>
                <SingleSlider
                    min={0}
                    max={1}
                    step={0.1}
                    value={opacity}
                    onChange={onChange}
                />
            </div>
            {isGradientRender && <GradientPicker title={title} gradient={gradient} />}
            <div className={styles.panel}>
                <label>Цвет точек</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onColorChange(e.target.value)}
                />
            </div>
        </div>
    )
}