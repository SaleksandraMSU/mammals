import { useDispatch, useSelector } from "react-redux";
import styles from "./style-panel.module.scss";
import { EDisplayTypes, IGradientConfig, getIsDisplayMethodChange, updateDefaultLayer, updateSpeciesLayer } from "../../../redux";
import { SingleSlider } from "../../Slider/SingleSlider";
import { GradientPicker } from "../../GradientPicker/GradientPicker";

type TStylePanelProps = {
    title: string,
    opacity: number,
    color?: string,
    gradient: IGradientConfig,
    displayMethod: string,
}

export const StylePanel = ({ title, opacity, color, gradient, displayMethod }: TStylePanelProps) => {

    const dispatch = useDispatch();
    const isDisplayChangeActive = useSelector(getIsDisplayMethodChange)
    const allowPointsColor = [EDisplayTypes.POINTS, EDisplayTypes.MIX].includes(displayMethod as EDisplayTypes);


    const onChange = (v: number) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ opacity: v }));
        } else {
            dispatch(updateSpeciesLayer({ title: title, prop: 'opacity', value: v }));
        };
    }

    const onColorChange = (color: string) => {
        if (title === 'Все данные') {
            dispatch(updateDefaultLayer({ "color": color }));
        } else {
            dispatch(updateSpeciesLayer({ title: title, prop: 'color', value: color }));
        };
    }

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
            {(!isDisplayChangeActive || displayMethod !== EDisplayTypes.POINTS) && <GradientPicker title={title} gradient={gradient} />}

            <div className={styles.panel}>
                <label>Цвет точек</label>
                <input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} />
            </div>
        </div>
    )
}