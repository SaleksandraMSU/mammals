import { useDispatch, useSelector } from "react-redux";
import { getPointsConfig, updatePointConfig } from "../../redux";
import { SingleSlider } from "../Slider";
import { Toggle } from "../Toggle";
import styles from "./ParamsPanel.module.scss";

export const PointsParameters = () => {
    const config = useSelector(getPointsConfig);
    const dispatch = useDispatch();

    const onRadiusChange = (v: number) => {
        dispatch(updatePointConfig({ "pointRadius": v }));
    };

    const onAutoChange = () => {
        dispatch(updatePointConfig({ auto: !config.auto }));
    };

    return (
        <div className={styles.paramsWrapper}>
            <Toggle
                isChecked={!config.auto}
                onChange={onAutoChange}
                label="Радиус точек"
            />
            {!config.auto &&
                <div style={{ width: 'auto' }}>
                    <SingleSlider
                        min={1}
                        max={20}
                        step={1}
                        value={config.pointRadius}
                        onChange={onRadiusChange}
                    />
                </div>
            }
        </div>

    )
}