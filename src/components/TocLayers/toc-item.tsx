import { AiFillEdit } from "react-icons/ai";
import { TbZoomInAreaFilled } from "react-icons/tb";
import styles from "./Toc-layers.module.scss";
import { useState } from "react";
import { StylePanel } from "./style-panel/style-panel";

type TTocItemProps = {
    title: string,
    opacity: number,
    color?: string,
}

export const TocItem = ({title, opacity, color}: TTocItemProps) => {

    const [styleActive, setStyleActive] = useState(false);

    return (
        <>
        <div className={styles.wrapper}>
            <span>{title}</span>
            <div className={styles.buttons}>
                <AiFillEdit size={20} className={styles.icon} onClick={() => setStyleActive(!styleActive)}/>
                <TbZoomInAreaFilled size={20} className={styles.icon} />
            </div>
        </div>
        {styleActive && <StylePanel opacity={opacity} title={title} color={color} />}
        </>
    )
}