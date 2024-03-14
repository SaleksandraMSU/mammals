import { displayMethods } from "./visualization-constants";
import { useDispatch, useSelector } from "react-redux";
import {
    toggleDisplayChange,
    getDisplayMethod,
    getIsDisplayMethodChange,
    setDisplayMethod
} from "../../redux";
import styles from "./Toggle.module.scss";
import { PointsIcon } from "../Icons/PointsIcon";
import { GridIcon } from "../Icons/GridIcon";
import { MixIcon } from "../Icons/MixIcon";
import { HeatmapIcon } from "../Icons/HeatmapIcon";
import { IconButton } from "../IconButton/IconButton";

export const Toggle = () => {
    const dispatch = useDispatch();

    const displayMethod = useSelector(getDisplayMethod);
    const toggled = useSelector(getIsDisplayMethodChange);
    const onMethodChange = (value: any) => {
        dispatch(setDisplayMethod(value));
    };

    return (
        <>
            <div className={styles.wrapper}>
                <span style={{ opacity: toggled ? 1 : 0.6, fontWeight: 600 }}>Вид отображения</span>
                <input
                    checked={toggled}
                    onChange={() => dispatch(toggleDisplayChange())}
                    className={styles.checkbox}
                    id={`react-switch-new`}
                    type="checkbox"
                />
                <label
                    style={{ background: toggled ? '#FF8000' : 'lightgrey' }}
                    className={styles.label}
                    htmlFor={`react-switch-new`}
                >
                    <span className={styles.button} />
                </label>
            </div>
            {toggled &&
                <div className={styles.methods}>
                    {
                        displayMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <IconButton
                                    key={method.key}
                                    value={method.value}
                                    onClick={onMethodChange}
                                    active={method.value === displayMethod}
                                >
                                    <Icon />
                                </IconButton>
                            )
                            // <label key={method.key}>
                            //     <input
                            //         type="radio"
                            //         value={method.value}
                            //         checked={method.value === displayMethod}
                            //         readOnly />
                            //     {method.key}
                            // </label>
                        })
                    }
                </div>
            }
        </>
    );
};