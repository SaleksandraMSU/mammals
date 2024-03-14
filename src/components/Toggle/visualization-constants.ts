import { EDisplayTypes } from "../../redux";
import { GridIcon, HeatmapIcon, MixIcon, PointsIcon } from "../Icons";

export const displayMethods = [
    {
        key: "Точечное",
        icon: PointsIcon,
        value: EDisplayTypes.POINTS,
    },
    {
        key: "Сеточное",
        icon: GridIcon,
        value: EDisplayTypes.GRID,
    },
    {
        key: "Смешанное",
        icon: MixIcon,
        value: EDisplayTypes.MIX,
    },
    {
        key: "Поверхность",
        icon: HeatmapIcon,
        value: EDisplayTypes.HEATMAP,
    },
]