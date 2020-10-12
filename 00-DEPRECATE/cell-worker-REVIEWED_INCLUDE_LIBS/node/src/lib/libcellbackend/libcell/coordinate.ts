import * as proj4 from "proj4";
import * as turf from "@turf/helpers";


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

}
