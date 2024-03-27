import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import styles from "./RadioButtons.module.scss";
import { EDisplayTypes, EGridsRenderMethods, getDisplayMethod, getGridConfig, getLayers, updateGridConfig } from "../../redux";
import { GRID_RENDER_METHODS } from "./constants";
import { useEffect } from "react";


export const RadioButtons = () => {

    const { method } = useSelector(getGridConfig);
    const dispatch = useDispatch();

    const onClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(updateGridConfig({ method: e.target.value }))
    }

    useEffect(() => {
        return () => {
            dispatch(updateGridConfig({ method: EGridsRenderMethods.QUANTITY }))
        }
    }, [dispatch]);

    return (
        <div className={styles.wrapper}>
            {GRID_RENDER_METHODS.map((m) =>
                <button
                    className={cn(styles.button, {
                        [styles.active]: method === m.value
                    })}
                    value={m.value}
                    onClick={(e) => onClick(e)}
                >
                    {m.label}
                </button>
            )}
        </div>
    )
}