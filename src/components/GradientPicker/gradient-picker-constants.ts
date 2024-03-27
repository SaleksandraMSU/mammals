import { IGradientConfig } from "../../redux"

export type TGradientItem = {
    value: IGradientConfig,
}

export const GRADIENT_ITEMS: TGradientItem[] = [
    {
        value: { color1: "#f5f500", color2: "#f57a00", color3: "#f50000"}
    },
    {
        value: { color1: "#ffffcc", color2: "#78c679", color3: "#006837"}
    },
    {
        value: { color1: "#eff3ff", color2: "#41b6c4", color3: "#08519c"}
    },
    {
        value: { color1: "#EEE4F1", color2: "#519EC8", color3: "#014636"}
    },
    {
        value: { color1: "#fde0dd", color2: "#f768a1", color3: "#7a0177"}
    },
    {
        value: { color1: "#fef0d9", color2: "#fc8d59", color3: "#b30000"}
    },
]