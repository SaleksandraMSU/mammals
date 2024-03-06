import ReactSlider from 'react-slider';
import "./SingleSlider.scss";

type TSliderProps = {
    onChange: (v: number) => void,
    min: number,
    max: number,
    step: number,
    value: number,
    disabled?: boolean,
}

export const SingleSlider = ({min, max, value, step, onChange, disabled}: TSliderProps) => {

    return (
        <ReactSlider
            className="singleSlider"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            onAfterChange={(val) => onChange(val)}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
        />
    )
}