import styles from "./Toggle.module.scss";

type TToggleProps = {
    isChecked: boolean,
    label: string,
    onChange: () => void,
};

export const Toggle = ({ isChecked, label, onChange }: TToggleProps) => {
    return (
        <div className={styles.wrapper}>
            <span style={{
                opacity: isChecked ? 1 : 0.6,
                fontWeight: 600,
            }}
            >
                {label}
            </span>
            <input
                id={label}
                type="checkbox"
                checked={isChecked}
                onChange={() => onChange()}
                className={styles.checkbox}
            />
            <label
                style={{ background: isChecked ? '#FF8000' : 'lightgrey' }}
                className={styles.label}
                htmlFor={label}
            >
                <span className={styles.button} />
            </label>
        </div>
    );
};