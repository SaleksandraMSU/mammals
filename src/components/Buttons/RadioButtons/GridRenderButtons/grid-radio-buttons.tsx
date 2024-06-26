import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { useEffect } from "react";
import { EGridsRenderMethods, getGridConfig, updateGridConfig } from "../../../../redux";
import { GRID_RENDER_METHODS } from "./constants";
import styles from "./radio-buttons.module.scss";

export const GridRadioButtons = () => {
    const { method } = useSelector(getGridConfig);
    const dispatch = useDispatch();

    const onClick = (e: any) => {
        dispatch(updateGridConfig({ method: e.target.value }))
    };

    useEffect(() => {
        return () => {
            dispatch(updateGridConfig({ method: EGridsRenderMethods.QUANTITY }));
        }
    }, [dispatch]);

    return (
        <div className={styles.wrapper}>
            {GRID_RENDER_METHODS.map((m) =>
                <button
                    key={m.value}
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