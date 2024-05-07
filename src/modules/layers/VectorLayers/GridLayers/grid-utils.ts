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
            return turf.hexGrid(bbox, size / 1.7, units);
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

const getLineCoordinates = (
    startCoords: Coordinate,
    endCoords: Coordinate,
    densities: number[],
    sum: number,
) => {
    const line = turf.lineString([startCoords, endCoords]);
    const lineLength = turf.length(line, units);
    const lineCoordsSliced = densities.slice(1).map((count, index) => {
        let proportion = count / sum;
        if (proportion < 0.2) { proportion = 0.2 + 0.1 * index }
        const length = proportion * lineLength;
        const point = turf.along(line, length, units);
        return point.geometry.coordinates;
    })
    const lineCoords = [endCoords, ...lineCoordsSliced];
    return lineCoords;
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
            const endCoordinates = [coordinates[1], coordinates[3]];
            const linesCoords = endCoordinates.map(
                coordinate => getLineCoordinates(coordinates[0], coordinate, densities, sum)
            );
            for (let i = 0; i < species.length; i++) {
                const sector = turf.polygon([[
                    coordinates[0],
                    linesCoords[0][i],
                    getMiddleCoords(linesCoords[0][i], linesCoords[1][i]),
                    linesCoords[1][i],
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
            const endCoords = [coordinates[0], coordinates[1], coordinates[2]];
            const medianCoords = endCoords.map(
                coordinate => getLineCoordinates(centroid, coordinate, densities, sum)
            );
            for (let i = 0; i < species.length; i++) {
                const sector = turf.polygon([[
                    medianCoords[0][i],
                    medianCoords[1][i],
                    medianCoords[2][i],
                    medianCoords[0][i]
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