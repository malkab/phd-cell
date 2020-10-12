/*

    Imports

*/

import { Grid } from "./grid";
import { Bbox, IBbox } from "./bbox";
import { Coordinate } from "./coordinate";


/**
 * 
 *  Definition interface
 * 
 */

export interface ICell {
    gridid: string;
    zoom: number;
    x: number;
    y: number;
    data: any;
}



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
     * @readonly
     * 
     */

    get sideSize(): number {
        
        return this.grid.zoomLevels[this.zoom].size;

    }

    /**
     *
     * Returns the center of the cell as a Coordinate.
     *
     * @type {Coordinate}: The cell center as a Coordinate.
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

    get persist(): ICell {
        return {
            gridid: this._grid.id,
            x: this._x,
            y: this._y,
            zoom: this._zoom,
            data: this._data
        };
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