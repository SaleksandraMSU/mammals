import ReactSlider from 'react-slider';
import { useDispatch, useSelector } from 'react-redux';
import { getDates, setFilters } from '../../redux';
import "./Slider.scss";

export const DoubleSlider = () => {
    const dates = useSelector(getDates);
    const dispatch = useDispatch();

    return (
        <ReactSlider
            className="slider"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            onAfterChange={(val) => dispatch(setFilters({ ['dateRange']: val }))}
            min={1697}
            max={2024}
            minDistance={1}
            value={dates}
        />
    )
}