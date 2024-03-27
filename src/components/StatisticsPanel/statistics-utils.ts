import { equalTo, or } from 'ol/format/filter';

export const getItems = (
    overall: number,
    mean: number,
    median: number,
    max: number,
    min: number
) => {
    return (
        [
            {
                label: "Общее",
                value: overall,
            },
            {
                label: "Среднее",
                value: mean,
            },
            {
                label: "Медианное",
                value: median,
            },
            {
                label: "Минимальное",
                value: min,
            },
            {
                label: "Максимальное",
                value: max,
            },
        ]
    )
};

export const getMedian = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2)
    const nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export const createFilter = (array: number[], prop: string) => {
    return (
        array.length ?
            array.length > 1 ?
                or(...array.map((i) => equalTo(prop, i)))
                :
                equalTo(prop, array[0])
            :
            null
    )
};