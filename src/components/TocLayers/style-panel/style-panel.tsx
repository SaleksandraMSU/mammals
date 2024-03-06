import { useDispatch } from "react-redux";
import styles from "./style-panel.module.scss";
import { updateDefaultLayer, updateSpeciesLayer } from "../../../redux";
import { SingleSlider } from "../../Slider/SingleSlider";

type TStylePanelProps = {
    title: string,
    opacity: number,
    color?: string,
}

export const StylePanel = ({ title, opacity, color }: TStylePanelProps) => {

    const dispatch = useDispatch();

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
            <div className={styles.panel}>
                <label>Цвет заливки</label>
                <input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} />
            </div>
        </div>
    )
}