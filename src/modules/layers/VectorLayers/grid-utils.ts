import * as turf from '@turf/turf';
import { EGridTypes } from "../../../redux";

export const createGrid = (
    type: EGridTypes,
    bbox: number[],
    size: number,
) => {
    switch (type) {
        case EGridTypes.SQUARE:
            return turf.squareGrid(bbox, size, { units: 'degrees' });
        case EGridTypes.HEX:
            return turf.hexGrid(bbox, size, { units: 'degrees' });
        case EGridTypes.TRIANGLE:
            return turf.triangleGrid(bbox, size, { units: 'degrees' });
    }
}