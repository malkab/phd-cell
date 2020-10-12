import * as proj4 from "proj4";
import * as turf from "@turf/helpers";
import { CellError, ECellErrorCode } from "./cellerror";


/*

    Persistance interface

*/

export interface ICoordinate {
    epsg: string;
    x: number;
    y: number;
}


/*

    Class

*/

export class Coordinate {
    // EPSG
    private _epsg: string;

    // x, y
    private _x: number;
    private _y: number;


    // Getters & Setters
    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get epsg(): string {
        return this._epsg;
    }

    get persist(): ICoordinate {

        return <ICoordinate>{
            epsg: this._epsg,
            x: this._x,
            y: this._y

        };

    }


    // Constructor
    constructor(epsg: string, x: number, y: number) {
        if (epsg === undefined || x === undefined || y === undefined ||
            epsg === null || x === null || y === null) {
            throw new Error(`Error initializing coordinate (${epsg}, ${x}, ${y})`);
        }

        this._epsg = epsg;
        this._x = x;
        this._y = y;
    }

    // Reproject
    public reproject(epsg: string): Coordinate {
        let coords = proj4(`EPSG:${this._epsg}`, `EPSG:${epsg}`).forward([this._x, this._y]);

        return new Coordinate(epsg, coords[0], coords[1]);
    }


    // Get GeoJSON
    get geojson(): turf.Feature<turf.Point> {
        return turf.point([ this._x, this._y ]);
    }


    // Get PostGIS GeoJSON
    get pggeojson(): any {
        return this.geojson.geometry;
    }


    /*

        Redefines this coordinate based on a GeoJSON point

    */

    public fromGeoJSON(geojson: any) {

        // If not Point, error

        if (geojson.type !== "Point") {

            throw new CellError(ECellErrorCode.DATAERROR, 
                "GeoJSON geometry must be of type Point to initialize a Coordinate object");

        }

        this._x = geojson.coordinates[0];
        this._y = geojson.coordinates[1];   

    }


    /**
     *
     * Returns the euclidean distance from this Coordinate to another one.
     * 
     * @param {Coordinate} coordinate: The target coordinate.
     * @returns {number}: The euclidean distance.
     */

    public euclideanDistance(coordinate: Coordinate): number {

        return Math.sqrt(Math.pow(this.x - coordinate.x, 2) + Math.pow(this.y - coordinate.y, 2));

    }


    /**
     *
     * Returns the euclidean distance from this Coordinate to a point defined by x,y in the same EPSG of this coordinate.
     *
     * @param {[ number, number ]} coordinates: xy target coordinates.
     * @returns {number}: The euclidean distance.
     */
    
    public euclideanDistanceFromXY(coordinates: [ number, number ]): number {

        return this.euclideanDistance(new Coordinate(this.epsg, coordinates[0], coordinates[1]));

    }

}
