/*

    Imports

*/

import { KeeperPrototype } from "@malkab/keeper-core";
import { Grid } from "./grid";
import { Bbox, IBbox } from "./bbox";
import { Coordinate } from "./coordinate";
import * as proj4 from "proj4";
import * as turf from "@turf/turf";
import { Polygon } from "./polygon";




/**
 *
 * 
 * This class represents a cell.
 * 
 * Cells have an important member that is the **offset**, which defaults
 * to 0. When the offset is positive, it expands the cell outwards, when
 * it's negative, it shrinks the cell inwards.
 * 
 */

@KeeperPrototype({

    serialize: {

        members: [ "zoom", "x", "y", "data", "offset" ],
        dependencies: [ "grid" ]

    },

    type: "Cell"

})
export class Cell {

    /*

        Members

    */

    private _zoom: number;
    private _x: number;
    private _y: number;
    private _grid: Grid;
    private _data: any;
    private _offset: number;


    /*

        Getters & setters

    */

    get x(): number {

        return this._x;

    }

    get y(): number {

        return this._y;

    }

    get grid(): Grid {

        return this._grid;

    }


    /**
     *
     * Size of the side of the cell.
     * 
     */

    get sideSize(): number {
        
        return +this.grid.zoomLevels[this.zoom].size;

    }

    /**
     * 
     * Area of the cell.
     * 
     */

    get area(): number {

        return this.sideSize * this.sideSize;

    }

    /**
     *
     * Returns the center of the cell as a Coordinate.
     * 
     */
    
    get center(): Coordinate {

        return new Coordinate(
            this.grid.epsg,
            this.lowerLeft.x + (this.sideSize / 2),
            this.lowerLeft.y + (this.sideSize / 2)
        );

    }

    set grid(grid: Grid) {

        this._grid = grid;

    }

    get zoom(): number {

        return this._zoom;

    }

    get data(): any {
        return this._data;
    }

    set data(data: any) {
        this._data = data;
    }

    get asString(): string {

        return `${this._zoom}/${this._x}/${this._y}`;

    }


    // Lower left corner
    get lowerLeft(): Coordinate {

        const ox: number = this._grid.origin.x;
        const oy: number = this._grid.origin.y;
        const s: number = this._grid.zoomLevels[this._zoom].size;

        return new Coordinate(
            this._grid.epsg,
            ox + (this._x * s) - this._offset,
            oy + (this._y * s) - this._offset
        );

    }


    // Lower left corner
    get upperRight(): Coordinate {

        const ox: number = this._grid.origin.x;
        const oy: number = this._grid.origin.y;
        const s: number = this._grid.zoomLevels[this._zoom].size;

        return new Coordinate(
            this._grid.epsg,
            ox + ((this._x + 1) * s) + this._offset,
            oy + ((this._y + 1) * s) + this._offset
        );

    }

    /**
     *
     * The cell's offset
     *
     */

    set offset(offset: number) {

        this._offset = offset;

    }

    get offset(): number {

        return this._offset;

    }


    /*

        Gets a BBox object from this cell

    */

    get bbox(): Bbox {

        return this._getBbox();

    }


    // Returns the EWKT representation of the cell
    
    get ewkt(): string {

        const ll: Coordinate = this.lowerLeft;
        const ur: Coordinate = this.upperRight;

        let ewkt: string = `SRID=${this._grid.epsg};`;

        ewkt += `POLYGON((${ll.x} ${ll.y},${ur.x} ${ll.y},${ur.x} ${ur.y},${ll.x} ${ur.y},${ll.x} ${ll.y}))`;

        return ewkt;

    }


    /**
     *
     * Returns the GeoJSON representation of the cell.
     *
     * TODO: THIS IS FIXED TO A EPSG:3035 PROJ4 STRING. THIS CONVERSION
     * STRING SHOULD BE GIVE AS ANOTHER PARAMETER FOR THE GRID WHEN IT
     * SRID IS FORMALIZED
     * 
     */

    get geojson(): any {

        const geojson: any = {};

        geojson.type = "Feature";

        geojson.geometry = {};

        geojson.geometry.type = "Polygon";

        // Transformed coordinates from 3035 to 4326
        // THIS SHOULD BE REVISED AND GENERALIZED

        // The four points that forms the cell

        console.log("Corners", this.corners);

        const corners = this.corners;

        corners.lowerLeft = corners.lowerLeft.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

        corners.upperLeft = corners.upperLeft.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

        corners.upperRight = corners.upperRight.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

        corners.lowerRight = corners.lowerRight.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326");

        console.log(corners);

        geojson.geometry.coordinates = [ [
            corners.lowerLeft.coordsPair,
            corners.upperLeft.coordsPair,
            corners.upperRight.coordsPair,
            corners.lowerRight.coordsPair,
            corners.lowerLeft.coordsPair
        ] ];

        return geojson;

    }


    /**
     * 
     * Gets a Polygon from the cell
     * 
     */

    get polygon(): Polygon {

        const p: Polygon = new Polygon();

        p.fromGeoJson(this.geojson);

        return p;

    }


    /**
     *
     * Returns the corners of the cell as four Coordinates, starting
     * from the lower left and ending clockwise at the lower right. Returns a data structure in the form:
     * 
     * ```JavaScript
     * {
     *  lowerLeft: Coordinate,
     *  upperLeft: Coordinate,
     *  upperRight: Coordinate,
     *  lowerRight: Coordinate
     * }
     * ```
     * 
     * @returns         A structure in the aforementioned form.
     * 
     */
     
    get corners(): {
        lowerLeft: Coordinate,
        upperLeft: Coordinate,
        upperRight: Coordinate,
        lowerRight: Coordinate
    } {
     
         return {
         
             // Lower left
             lowerLeft: new Coordinate(this.grid.epsg, 
                 this.lowerLeft.x, this.lowerLeft.y),
             
             // Upper left
             upperLeft: new Coordinate(this.grid.epsg, 
                 this.lowerLeft.x, this.upperRight.y),
             
             // Upper right
             upperRight: new Coordinate(this.grid.epsg,
                 this.upperRight.x, this.upperRight.y),
             
             // Lower right
             lowerRight: new Coordinate(this.grid.epsg,
                 this.upperRight.x, this.lowerLeft.y)
             
         }
     
     }

    
    /**
     *
     * Gets the scale factor for this cell, that is, the ratio between
     * the area of the cell measured on the WGS84 ellipsoid by Turf and
     * the projected area. This measure is expressed in 1%.
     *
     * @returns The scale factor.
     *
     */

    get scaleFactor(): number {

        return this.polygon.area / this.area;

    }



    /**
     *
     * Constructor.
     * 
     * @param grid      The grid the cell is defined on.
     * @param zoom      The cell's zoom level.
     * @param x         The cell's x.
     * @param y         The cell's y.
     * @param data      The cell's data.
     * @param offset    The cell's offset, if any.
     * 
     */

    constructor(grid: Grid, zoom: number, x: number, y: number, 
        data: any, offset?: number)
    {

        this._zoom = zoom;
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._grid = grid;
        this._data = data;

        // Offset defaults to 0 if absent

        this._offset = offset ? offset : 0;

    }


    /*

        Public members

    */

    // Returns subcells in a given zoom level
    public getSubCells(zoom: number): Cell[] {

        const thisSize = this.grid.zoomLevels[this.zoom].size;
        const targetSize = this.grid.zoomLevels[zoom].size;
        const sizeRatio = thisSize / targetSize;

        const out: Cell[] = [];

        for (let x = this.x * sizeRatio ;
             x < (this.x * sizeRatio) + sizeRatio ;
             x++ ) {

            for (let y = this.y * sizeRatio ;
                 y < (this.y * sizeRatio) + sizeRatio ;
                  y++ ) {

                out.push(new Cell(this.grid, zoom, x, y, {}));

            }

        }

        return out;

    }


    /**
     *
     * Returns true if Coordinate is within the cell.
     *
     * @param {Coordinate} coordinate: The coordinate to test.
     * @returns {boolean}
     * 
     */

    public coordinateInCell(coordinate: Coordinate): boolean {

        return this.bbox.coordinateInBbox(coordinate);

    }


    /**
     * 
     * Intersects a Turf polygon with this cell.
     * 
     * @param polygon       The Turf polygon to intersect.
     * 
     */

    public intersectPolygon(polygon: Polygon): any {

        return this.polygon.intersection(polygon);

    }



    /*

        Private members

    */

    /**
     *
     * Returns a Bbox object from the envelope of this cell.
     *
     * @returns {Bbox}
     * 
     */

    private _getBbox(): Bbox {

        return new Bbox(<IBbox>{
            epsg: this.grid.epsg,
            maxx: this.upperRight.x,
            maxy: this.upperRight.y,
            minx: this.lowerLeft.x,
            miny: this.lowerLeft.y
        });

    }

}