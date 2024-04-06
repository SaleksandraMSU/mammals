import ReactSlider from 'react-slider';
import { IFiltersState } from '../../redux';
import "./Slider.scss";

type TDoubleSliderProps = {
    value: number[],
    onChange: (param: keyof IFiltersState, value: boolean | number[]) => void,
};

export const DoubleSlider = ({ value, onChange }: TDoubleSliderProps) => {
    return (
        <ReactSlider
            className="slider"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            onAfterChange={(val) => onChange("dateRange", val)}
            min={1697}
            max={2024}
            minDistance={1}
            value={value}
        />
    )
}