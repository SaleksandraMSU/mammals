import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { TbZoomInAreaFilled } from "react-icons/tb";
import { ImBin2 } from "react-icons/im";
import cn from "classnames";
import { EDisplayTypes, IGradientConfig } from "../../redux";
import { StylePanel } from "./style-panel";
import styles from "./Toc-layers.module.scss";

type TTocItemProps = {
    id?: number,
    title: string,
    opacity: number,
    color?: string,
    gradient: IGradientConfig,
    onZoom: () => void,
    onRemove?: (id: number) => void,
    displayMethod: EDisplayTypes,
};

export const TocItem = ({ title, id, opacity, color, gradient, onZoom, onRemove, displayMethod }: TTocItemProps) => {
    const [styleActive, setStyleActive] = useState(false);

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
                        onClick={() => onZoom()}
                    />
                    {onRemove && id !== undefined &&
                        <ImBin2
                            size={17}
                            className={styles.icon}
                            onClick={() => onRemove(id)}
                        />
                    }
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