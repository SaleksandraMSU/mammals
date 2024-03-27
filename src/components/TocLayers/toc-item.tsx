import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit } from "react-icons/ai";
import { TbZoomInAreaFilled } from "react-icons/tb";
import cn from "classnames";
import { StylePanel } from "./style-panel";
import styles from "./Toc-layers.module.scss";
import { IGradientConfig, getDisplayMethod, setZoomParams } from "../../redux";

type TTocItemProps = {
    title: string,
    value?: number,
    opacity: number,
    color?: string,
    gradient: IGradientConfig,
};

export const TocItem = ({ title, value, opacity, color, gradient }: TTocItemProps) => {

    const [styleActive, setStyleActive] = useState(false);
    const displayMethod = useSelector(getDisplayMethod);
    const dispatch = useDispatch();

    const onZoomClick = () => {
        dispatch(setZoomParams({ toLayer: value }));
    }

    return (
        <>
            <div className={styles.wrapper}>
                <span>{title}</span>
                <div className={styles.buttons}>
                    <AiFillEdit
                        size={20}
                        className={cn(styles.icon, {
                            [styles.active]: styleActive,
                        })}
                        onClick={() => setStyleActive(!styleActive)}
                    />
                    <TbZoomInAreaFilled
                        size={20}
                        className={styles.icon} 
                        onClick={() => onZoomClick()}
                        />
                </div>
            </div>
            {styleActive &&
                <StylePanel
                    opacity={opacity}
                    title={title}
                    color={color}
                    gradient={gradient}
                    displayMethod={displayMethod}
                />
            }
        </>
    )
};