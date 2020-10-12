/**
 * CellJS class
 *
 * Encapsulates all CellJS functionality.
 */

import * as proj4 from "proj4";
import * as pg from "pg";


// SRS definitions

proj4.defs([
    [
        "EPSG:3035",
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs"
    ]
]);


export class Coordinate {
    // EPSG
    public epsg: string;

    // x, y
    public x: number;
    public y: number;

    // Constructor
    constructor(epsg: string, x: number, y: number) {
        this.epsg = epsg;
        this.x = x;
        this.y = y;
    }

    // Reproject
    public reproject(epsg: string): Coordinate {
        let coords = proj4(`EPSG:${this.epsg}`, `EPSG:${epsg}`).forward([this.x, this.y]);

        return new Coordinate(epsg, coords[0], coords[1]);
    }

}


export class Bbox {

    // EPSG
    public epsg: string;

    // Lower left coordinate
    private lowerLeft: Coordinate;

    // Top right coordinate
    private topRight: Coordinate;

    // Constructor
    constructor(epsg: string, lowerLeft: Coordinate, topRight: Coordinate) {
        this.epsg = epsg;
        this.lowerLeft = lowerLeft.reproject(epsg);
        this.topRight = topRight.reproject(epsg);
    }

    // Reproject
    public reproject(epsg: string): Bbox {
        return new Bbox(epsg, this.lowerLeft.reproject(epsg), this.topRight.reproject(epsg));
    }

}


export class CellJS {

    private pgPool: pg.Pool;
    private pgClient: pg.Client;


    // Returns a coordinate translator

    public getTranslator(fromEPSG: string, toEPSG: string) {
        return proj4(`EPSG:${fromEPSG}`, `EPSG:${toEPSG}`);
    }


    // Connects to CellDS database

    public cellDsCreatePool(host: string, port: number = 5432, user: string = "postgres", pass: string = "postgres", database: string = "cellds") {
        this.pgPool = new pg.Pool({
            user: user,
            host: host,
            database: database,
            password: pass,
            port: port
        });
    }


    // Closes pool

    public cellDsClosePool() {
        this.pgPool.end();
    }


    // Return a set of cells in a given zoom

    // public getCells(gridId: string, zoom: number, bbox: Bbox) {

    //     }


    // Launch an arbitrary query to the database

    public cellDsQuery(query: string) {
        this.pgPool.query(query)
            .then(res => { return res; })
            .catch(e => { return e.stack; });
    }

}
