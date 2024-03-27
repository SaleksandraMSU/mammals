import { PropsWithChildren, useState } from "react";
import styles from "./statistics-item.module.scss";

type TStaticsItemProps = {
    title: string,
}

export const StatisticsItem = ({ title, children }: PropsWithChildren<TStaticsItemProps>) => {
    const [active, setActive] = useState(false);

    return (
        <div className={styles.background}>
            <div className={styles.block} onClick={() => setActive(!active)}>{title}</div>
            {active &&
                children}
        </div>
    )
}