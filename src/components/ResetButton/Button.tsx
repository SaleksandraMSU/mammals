import { useDispatch } from "react-redux";
import { resetFilters, setLayers } from "../../redux";
import styles from "./Button.module.scss";

export const ResetButton = () => {

    const dispatch = useDispatch();

    const onReset = () => {
        dispatch(resetFilters());
        dispatch(setLayers([]));
    }

    return (
        <button
            onClick={onReset}
            className={styles.btn}
        >
            Сбросить
        </button>
    )
};