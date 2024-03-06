import { displayMethods } from "./visualization-constants";
import { useDispatch, useSelector } from "react-redux";
import { 
    toggleDisplayChange, 
    getDisplayMethod, 
    getIsDisplayMethodChange, 
    setDisplayMethod 
} from "../../redux";
import styles from "./Toggle.module.scss";

export const Toggle = () => {
    const dispatch = useDispatch();

    const displayMethod = useSelector(getDisplayMethod);
    const toggled = useSelector(getIsDisplayMethodChange);
    const onMethodChange = (e: any) => {
        dispatch(setDisplayMethod(e.target.value));
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
                <div className={styles.radioGroup} onChange={onMethodChange}>
                    {
                        displayMethods.map((method) => (
                            <label key={method.key}>
                                <input
                                    type="radio"
                                    value={method.value}
                                    checked={method.value === displayMethod}
                                    readOnly />
                                {method.key}
                            </label>
                        ))
                    }
                </div>
            }
        </>
    );
};