/*

    Cell class.

*/

import { Grid } from "./grid";
import { Bbox, IBbox } from "./bbox";
import { Coordinate } from "./coordinate";


/*

    Definition interface

*/
export interface ICell {
    gridid: string;
    zoom: number;
    x: number;
    y: number;
    data: any;
}


/*

    Cell class

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
            ox + (this._x * s),
            oy + (this._y * s)
        );

    }


    // Lower left corner
    get upperRight(): Coordinate {

        const ox: number = this._grid.origin.x;
        const oy: number = this._grid.origin.y;
        const s: number = this._grid.zoomLevels[this._zoom].size;

        return new Coordinate(
            this._grid.epsg,
            ox + ((this._x + 1) * s),
            oy + ((this._y + 1) * s)
        );

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



    /*

        Constructor

    */

    constructor(grid: Grid, zoom: number, x: number, y: number, data: any) {

        this._zoom = zoom;
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._grid = grid;
        this._data = data;

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



    /*

        Private members

    */

    /*

        Returns a Bbox object from the envelope of this cell

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