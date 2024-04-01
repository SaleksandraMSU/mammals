import * as turf from '@turf/turf';
import { Coordinate } from 'ol/coordinate';
import { EGridTypes } from "../../../../redux";
import { geoJsonPolygon } from '../vector-layers-types';

const units = { units: "kilometers" as turf.Units };

export const createGrid = (
    type: EGridTypes,
    bbox: turf.BBox,
    size: number,
) => {
    switch (type) {
        case EGridTypes.SQUARE:
            return turf.squareGrid(bbox, size, units);
        case EGridTypes.HEX:
            return turf.hexGrid(bbox, size / 2, units);
        case EGridTypes.TRIANGLE:
            return turf.triangleGrid(bbox, size, units);
    }
};

const getMiddleCoords = (
    coord1: Coordinate,
    coord2: Coordinate,
) => {
    const lat = coord1[1];
    const lon = coord2[0];
    return [lon, lat];
};

const splitLinesByPoints = (
    coordinates: Coordinate[],
    densities: number[],
    sum: number,
) => {
    const bottomLine = turf.lineString([coordinates[0], coordinates[3]]);
    const leftLine = turf.lineString([coordinates[0], coordinates[1]]);

    const bottomLineLength = turf.length(bottomLine, units);
    const leftLineLength = turf.length(leftLine, units);
    const densititiesMod = densities.slice(1);

    const bottomLineCoordsUncorr = densititiesMod.map((count, index) => {
        let proportion = count / sum;
        if (proportion < 0.2) { proportion = 0.2 + 0.1 * index }
        const length = proportion * bottomLineLength;
        const point = turf.along(bottomLine, length, units);
        return point.geometry.coordinates;
    })
    const bottomLineCoords = [coordinates[3], ...bottomLineCoordsUncorr];

    const leftLineCoordsUncorr = densititiesMod.map((count, index) => {
        let proportion = count / sum;
        if (proportion < 0.2) { proportion = 0.2 + 0.1 * index }
        const length = proportion * leftLineLength;
        const point = turf.along(leftLine, length, units);
        return point.geometry.coordinates;
    })
    const leftLineCoords = [coordinates[1], ...leftLineCoordsUncorr];
    return { bottomLineCoords, leftLineCoords };
};

const splitTringleInParts = (
    coordinates: Coordinate[],
    centroid: Coordinate,
    densities: number[],
    sum: number,
) => {
    const firstMedian = turf.lineString([centroid, coordinates[0]]);
    const secondMedian = turf.lineString([centroid, coordinates[1]]);
    const thirdMedian = turf.lineString([centroid, coordinates[2]]);

    const firstMedianLength = turf.length(firstMedian, units);
    const secondMedianLength = turf.length(secondMedian, units);
    const thirdMedianLength = turf.length(thirdMedian, units);
    const densititiesMod = densities.slice(1);

    const firstMedianCoordsUncorr = densititiesMod.map((count, index) => {
        let proportion = count / sum;
        if (proportion < 0.2) { proportion = 0.2 + 0.1 * index }
        const length = proportion * firstMedianLength;
        const point = turf.along(firstMedian, length, units);
        return point.geometry.coordinates;
    })
    const firstMedianCoords = [coordinates[0], ...firstMedianCoordsUncorr];

    const secondMedianCoordsUncorr = densititiesMod.map((count, index) => {
        let proportion = count / sum;
        if (proportion < 0.2) { proportion = 0.2 + 0.1 * index }
        const length = proportion * secondMedianLength;
        const point = turf.along(secondMedian, length, units);
        return point.geometry.coordinates;
    })
    const secondMedianCoords = [coordinates[1], ...secondMedianCoordsUncorr];

    const thirdMedianCoordsUncorr = densititiesMod.map((count, index) => {
        let proportion = count / sum;
        if (proportion < 0.2) { proportion = 0.2 + 0.1 * index }
        const length = proportion * thirdMedianLength;
        const point = turf.along(thirdMedian, length, units);
        return point.geometry.coordinates;
    })
    const thirdMedianCoords = [coordinates[2], ...thirdMedianCoordsUncorr];

    return { firstMedianCoords, secondMedianCoords, thirdMedianCoords };
};

const splitHexInParts = (
    coordinates: Coordinate[],
    centroid: Coordinate,
    densities: number[],
    sum: number,
) => {
    const coords = [coordinates[2], coordinates[1], coordinates[0], coordinates[5], coordinates[4], coordinates[3], coordinates[2]]
    const midpoints: Coordinate[] = [];
    for (let i = 0; i < coords.length - 1; i++) {
        midpoints.push([
            (coords[i][0] + coords[i + 1][0]) / 2,
            (coords[i][1] + coords[i + 1][1]) / 2
        ]);
    };
    const parts = []
    for (let i = 0; i < 6; i++) {
        const pol1 = turf.polygon([[coords[i], midpoints[i], centroid, coords[i]]])
        const pol2 = turf.polygon([[midpoints[i], coords[i + 1], centroid, midpoints[i]]])
        parts.push(pol1, pol2)
    }
    const polygonsNumbers = densities.map((count) => {
        let round = Math.round((count / sum) * 12);
        if (round === 0) { round += 1 };
        return round;
    })
    const diff = 12 - polygonsNumbers.reduce((acc, num) => acc + num, 0);;
    if (diff !== 0) {
        const idx = polygonsNumbers.findIndex(num => num === Math.max(...polygonsNumbers));
        polygonsNumbers[idx] += diff;
    }
    return { parts, polygonsNumbers };
};


export const splitGridCell = (
    type: EGridTypes,
    coordinates: Coordinate[],
    centroid: Coordinate,
    data: { species: number[], densities: number[] },
) => {
    const { densities, species } = data;
    const sum = densities.reduce((sum, current) => sum + current, 0);
    const polygons: geoJsonPolygon[] = [];
    let sectors: geoJsonPolygon[][] = [];
    switch (type) {
        case EGridTypes.SQUARE:
            const { leftLineCoords, bottomLineCoords } = splitLinesByPoints(coordinates, densities, sum)
            for (let i = 0; i < species.length; i++) {
                const sector = turf.polygon([[
                    coordinates[0],
                    leftLineCoords[i],
                    getMiddleCoords(leftLineCoords[i], bottomLineCoords[i]),
                    bottomLineCoords[i],
                    coordinates[0]
                ]]);
                sectors.push([sector]);
            };
            break;
        case EGridTypes.HEX:
            const { parts, polygonsNumbers } = splitHexInParts(coordinates, centroid, densities, sum)
            const secondSectorEnd = polygonsNumbers[0] + polygonsNumbers[1];
            const thirdSectorEnd = secondSectorEnd + polygonsNumbers[2];
            if (species.length === 2) {
                const firstSector = parts.slice(0, polygonsNumbers[0]);
                const secondSector = parts.slice(polygonsNumbers[0]);
                sectors = [firstSector, secondSector];
            } else if (species.length === 3) {
                const firstSector = parts.slice(0, polygonsNumbers[0]);
                const secondSector = parts.slice(polygonsNumbers[0], secondSectorEnd);
                const thirdSector = parts.slice(secondSectorEnd);
                sectors = [firstSector, secondSector, thirdSector];
            } else if (species.length === 4) {
                const firstSector = parts.slice(0, polygonsNumbers[0]);
                const secondSector = parts.slice(polygonsNumbers[0], secondSectorEnd);
                const thirdSector = parts.slice(secondSectorEnd, thirdSectorEnd);
                const fourthSector = parts.slice(thirdSectorEnd);
                sectors = [firstSector, secondSector, thirdSector, fourthSector];
            };
            break;
        case EGridTypes.TRIANGLE:
            const {
                firstMedianCoords,
                secondMedianCoords,
                thirdMedianCoords,
            } = splitTringleInParts(coordinates, centroid, densities, sum);
            for (let i = 0; i < species.length; i++) {
                const sector = turf.polygon([[
                    firstMedianCoords[i],
                    secondMedianCoords[i],
                    thirdMedianCoords[i],
                    firstMedianCoords[i]
                ]]);
                sectors.push([sector]);
            };
            break;
    }
    sectors.forEach((sector, index) => {
        const collection = turf.featureCollection(sector)
        const dissolvedSector = turf.dissolve(collection)
        polygons.push({
            ...dissolvedSector.features[0],
            properties: { count: densities[index], species: species[index] }
        })
    })
    return polygons;
};