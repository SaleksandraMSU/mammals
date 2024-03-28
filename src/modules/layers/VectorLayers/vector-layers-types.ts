import type {
    Feature,
    Polygon,
    Point,
    GeoJsonProperties,
    FeatureCollection,
} from "geojson";


export type geoJsonPolygon = Feature<Polygon, GeoJsonProperties>;
export type geoJsonPoint = Feature<Point, GeoJsonProperties>;


export type polygonFeatureCollection = FeatureCollection<Polygon, GeoJsonProperties>;
export type pointFeatureCollection = FeatureCollection<Point, GeoJsonProperties>;

