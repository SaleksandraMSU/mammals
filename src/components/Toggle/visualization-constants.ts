import { EDisplayTypes } from "../../redux";

export const displayMethods = [
    {
        key: "Точечное",
        value: EDisplayTypes.POINTS,
    },
    {
        key: "Сеточное",
        value: EDisplayTypes.GRID,
    },
    {
        key: "Смешанное",
        value: EDisplayTypes.MIX,
    },
    {
        key: "Поверхность",
        value: EDisplayTypes.HEATMAP,
    },
]