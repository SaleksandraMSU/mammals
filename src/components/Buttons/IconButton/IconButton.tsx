import { PropsWithChildren } from "react";
import cn from "classnames";
import styles from "./IconButton.module.scss";

type TIconButtonProps = {
    value: any,
    active: boolean,
    onClick: (value: any) => void,
}

export const IconButton = (
    { value, onClick, children, active }: PropsWithChildren<TIconButtonProps>) => {
    return (
        <button
            className={cn(styles.button, {
                [styles.active]: active,
            })}
            value={value}
            onClick={() => onClick(value)}
        >
            {children}
        </button>
    );
};