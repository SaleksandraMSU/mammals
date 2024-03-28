import { useDispatch, useSelector } from "react-redux";
import { getHeatmapConfig, updateHeatmapConfig } from "../../redux";
import { SingleSlider } from "../Slider";
import styles from "./ParamsPanel.module.scss";

export const HeatmapParameters = () => {
    const config = useSelector(getHeatmapConfig);
    const dispatch = useDispatch();

    const onBlurChange = (v: number) => {
        dispatch(updateHeatmapConfig({ "blur": v }));
    };

    const onRadiusChange = (v: number) => {
        dispatch(updateHeatmapConfig({ "radius": v }));
    };

    return (
        <>
            <div className={styles.wrapper}>
                <label>Радиус</label>
                <SingleSlider
                    min={1}
                    max={20}
                    step={1}
                    value={config.radius}
                    onChange={onRadiusChange}
                />
            </div>
            <div className={styles.wrapper}>
                <label>Размытие</label>
                <SingleSlider
                    min={1}
                    max={30}
                    step={1}
                    value={config.blur}
                    onChange={onBlurChange}
                />
            </div>
        </>
    )
}