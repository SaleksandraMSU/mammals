import { useDispatch, useSelector } from "react-redux";
import { getPointsConfig, updatePointConfig } from "../../redux";
import styles from "./ParamsPanel.module.scss";
import { SingleSlider } from "../Slider/SingleSlider";

export const PointsParameters = () => {
    const config = useSelector(getPointsConfig);
    const dispatch = useDispatch();

    const onRadiusChange = (v: number) => {
        dispatch(updatePointConfig({ "pointRadius": v }));
    };

    return (
        <div className={styles.paramsWrapper}>
            <div className={styles.wrapper}>
                <span style={{ opacity: config.auto ? 0.6 : 1 }}>Радиус точек</span>
                <input
                    checked={!config.auto}
                    onChange={() => dispatch(updatePointConfig({ auto: !config.auto }))}
                    className={styles.checkbox}
                    id={`react-switch-new-point`}
                    type="checkbox"
                />
                <label
                    style={{ background: config.auto ? 'lightgrey' : '#FF8000' }}
                    className={styles.label}
                    htmlFor={`react-switch-new-point`}
                >
                    <span className={styles.button} />
                </label>
            </div>
            {!config.auto && <div style={{ width: 'auto' }}>
                <SingleSlider
                    min={1}
                    max={20}
                    step={1}
                    value={config.pointRadius}
                    onChange={onRadiusChange}
                />
            </div>}
        </div>

    )
}