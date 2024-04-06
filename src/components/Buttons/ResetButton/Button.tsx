import styles from "./Button.module.scss";

type TResetButtonProps = {
    onReset: () => void,
}

export const ResetButton = ({ onReset }: TResetButtonProps) => {
    return (
        <button
            onClick={onReset}
            className={styles.btn}
        >
            Сбросить
        </button>
    )
};