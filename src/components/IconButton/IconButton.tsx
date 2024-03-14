import { PropsWithChildren } from "react";
import cn from "classnames";
import styles from "./IconButton.module.scss";

type TIconButtonProps = {
    value: string | number,
    active: boolean,
    onClick: (value: string | number) => void,
}

export const IconButton = ({ value, onClick, children, active }: PropsWithChildren<TIconButtonProps>) => {
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