import { DoubleSlider } from "../Slider/DoubleSlider"
import { FilterSelect } from "./Select"
import { methods, months, museums, species } from "./data"

export const Filters = () => {
    return (
        <>
        <FilterSelect options={species} title="Виды" value="species" />
        <DoubleSlider />
        <FilterSelect options={months} title="Месяцы" value="months" />
        <FilterSelect options={museums} title="Источник данных" value="museum" />
        <FilterSelect options={methods} title="Способ определения" value="determinationMethod" />
        </>
    )
}