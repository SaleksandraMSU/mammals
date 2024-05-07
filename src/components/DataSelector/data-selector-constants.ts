import { IconType } from "react-icons";
import { MdLayers, MdFilterAlt } from "react-icons/md";

type TDataSelector = {
    key: string,
    value: boolean,
    icon: IconType,
}

export const DATA_SELECTORS: TDataSelector[] = [
    {
        key: "Фильтрация",
        value: false,
        icon: MdFilterAlt,
    },
    {
        key: "Выборка",
        value: true,
        icon: MdLayers,
    },
];