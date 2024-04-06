import { useDispatch, useSelector } from "react-redux";
import { type EDisplayTypes, getDisplayMethod, getIsDisplayMethodChange, setDisplayMethod, toggleDisplayChange } from "../../../../redux";
import styles from "./display-radio-buttons.module.scss";
import { displayMethods } from "./display-constants";
import { IconButton } from "../../IconButton";
import { Toggle } from "../../../Toggle";

export const DisplayRadioButtons = () => {
    const dispatch = useDispatch();
    const displayMethod = useSelector(getDisplayMethod);
    const toggled = useSelector(getIsDisplayMethodChange);

    const onMethodChange = (value: EDisplayTypes) => {
        dispatch(setDisplayMethod(value));
    };

    const onDisplayChange = () => {
        dispatch(toggleDisplayChange());
    };

    return (
        <>
            <Toggle
                isChecked={toggled}
                onChange={onDisplayChange}
                label="Вид отображения"
            />
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
                        })
                    }
                </div>
            }
        </>
    )
}