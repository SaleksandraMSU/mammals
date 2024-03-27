import * as turf from '@turf/turf';
import type {
    Feature,
    Polygon,
    GeoJsonProperties,
} from "geojson";
import { EGridTypes } from "../../../redux";
import { Coordinate } from 'ol/coordinate';

type geoJsonPolygon = Feature<Polygon, GeoJsonProperties>;

export const createGrid = (
    type: EGridTypes,
    bbox: turf.BBox,
    size: number,
) => {
    switch (type) {
        case EGridTypes.SQUARE:
            return turf.squareGrid(bbox, size, { units: "kilometers" });
        case EGridTypes.HEX:
            return turf.hexGrid(bbox, size / 2, { units: "kilometers" });
        case EGridTypes.TRIANGLE:
            return turf.triangleGrid(bbox, size, { units: "kilometers" });
    }
}


export const splitGridCell = (
    type: EGridTypes,
    coords: Coordinate[],
    centroid: Coordinate,
    data: { species: number[], densities: number[] },
) => {
    const midpoints: Coordinate[] = [];
    for (let i = 0; i < coords.length - 1; i++) {
        midpoints.push([
            (coords[i][0] + coords[i + 1][0]) / 2,
            (coords[i][1] + coords[i + 1][1]) / 2
        ]);
    }
    const parts = []
    for (let i = 0; i < 6; i++) {
        const pol1 = turf.polygon([[coords[i], midpoints[i], centroid, coords[i]]])
        const pol2 = turf.polygon([[midpoints[i], coords[i + 1], centroid, midpoints[i]]])
        parts.push(pol1, pol2)
    }
    const { densities, species } = data;
    const sum = densities.reduce((sum, current) => sum + current, 0);
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
    const polygons: geoJsonPolygon[] = [];
    let sectors: geoJsonPolygon[][] = [];
    switch (type) {
        case EGridTypes.HEX:
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
            }
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
}