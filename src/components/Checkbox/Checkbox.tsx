type TCheckboxProps = {
    isChecked: boolean,
    onChange: () => void,
    label: string,
};

export const Checkbox = ({ isChecked, onChange, label }: TCheckboxProps) => {
    return (
        <div>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onChange()}
            />
            {label}
        </div>
    )
}