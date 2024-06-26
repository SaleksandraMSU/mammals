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
import { POINT_DISPLAY_TYPES } from "../../../modules/constants";

type TStylePanelProps = {
    title: string,
    opacity: number,
    color?: string,
    gradient: IGradientConfig,
    displayMethod: EDisplayTypes,
}

export const StylePanel = (
    { title, opacity, color, gradient, displayMethod }: TStylePanelProps) => {
    const dispatch = useDispatch();
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange);
    const isGradientRender = !isDisplayChangeActive || displayMethod !== EDisplayTypes.POINTS;
    const isPointRender = POINT_DISPLAY_TYPES.includes(displayMethod);

    const onOpacityChange = (v: number) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ 'opacity': v }));
        } else {
            dispatch(updateSpeciesLayer({ title: title, prop: 'opacity', value: v }));
        };
    };

    const onColorChange = (color: string) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ 'color': color }));
        } else {
            dispatch(updateSpeciesLayer({ title: title, prop: 'color', value: color }));
        };
    };

    const onGradientColorChange = (param: keyof IGradientConfig, color: string) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ 'gradient': { ...gradient, [param]: color } }));
        } else {
            dispatch(updateSpeciesLayer({
                title: title,
                prop: 'gradient',
                value: { ...gradient, [param]: color }
            }));
        };
    };

    const onGradientChange = (selected: any) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ 'gradient': selected.value }));
        } else {
            dispatch(updateSpeciesLayer({
                title: title,
                prop: 'gradient',
                value: selected.value
            }));
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
                    onChange={onOpacityChange}
                />
            </div>
            {isGradientRender &&
                <GradientPicker
                    gradient={gradient}
                    onGradientChange={onGradientChange}
                    onGradientColorChange={onGradientColorChange}
                />
            }
            {isPointRender &&
                <div className={styles.panel}>
                    <label>Цвет точек</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                    />
                </div>
            }
        </div>
    )
}