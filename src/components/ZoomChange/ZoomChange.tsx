import { useDispatch, useSelector } from "react-redux"
import { getIsDisplayMethodChange, getZoomConfig, setZoomParams } from "../../redux"
import { SingleSlider } from "../Slider";
import styles from "./ZoomChange.module.scss";

export const ZoomChange = () => {
    const isDisplayChange = useSelector(getIsDisplayMethodChange);
    const { change } = useSelector(getZoomConfig);
    const dispatch = useDispatch();

    if (isDisplayChange) {
        return;
    };

    const onChange = (v: number) => {
        dispatch(setZoomParams({ change: v }))
    };

    return (
        <div className={styles.wrapper}>
            <div>Уровень переключения сетки на точки</div>
            <SingleSlider
                min={1}
                max={20}
                step={1}
                value={change}
                onChange={onChange}
            />
        </div>
    )
}