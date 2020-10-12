/*

    Grid object.

*/

import { CellObject, ICellObject } from "./cellobject";
import { Coordinate, ICoordinate } from "./coordinate";
import { ZoomLevel, IZoomLevel } from "./zoomlevel";
import { IPersistable } from "./ipersistable";
import { Bbox } from "./bbox";
import { Cell } from "./cell";



/*

    Grid API definition interface

*/

export interface IGrid extends ICellObject {
    origin: ICoordinate;
    zoomlevels: IZoomLevel[];
}



/*

    Grid class

*/

export class Grid extends CellObject implements IPersistable {

    /*

        Private members

    */

    // The EPSG of the grid
    private _epsg: string;

    // Zoom levels
    private _zoomLevels: ZoomLevel[];

    // Origin
    private _origin: Coordinate;


    /*

        Getters and setters

    */

    get epsg(): string {
        return this._epsg;
    }

    get zoomLevels(): ZoomLevel[] {
        return this._zoomLevels;
    }

    get origin(): Coordinate {
        return this._origin;
    }

    get persist(): IGrid {

        const base: ICellObject = super.persist;

        (<IGrid>base).origin = this.origin.persist;

        const zl: IZoomLevel[] = [];

        for (let i of this._zoomLevels) {
            zl.push(i.persist);
        }

        (<IGrid>base).zoomlevels = zl;

        return <IGrid>base;

    }


    /*

        Constructor

    */

    constructor(id: string, init: IGrid) {

        super(id, init);

        this._epsg = init.origin.epsg;

        this._zoomLevels = [];

        this._type = "Grid";

        for ( let zl of init.zoomlevels ) {
            this._zoomLevels.push(new ZoomLevel(zl.name, zl.size));
        }

        this._origin = new Coordinate(init.origin.epsg,
            init.origin.x, init.origin.y);

    }


    /*

        Returns the cell a point is on at a certain zoom level

    */

    public coordinateInCell(coordinate: Coordinate, zoomLevel: number): Cell {

        const size = this._zoomLevels[zoomLevel].size;

        const x: number = Math.floor((coordinate.x - this._origin.x) / size);
        const y: number = Math.floor((coordinate.y - this._origin.y) / size);

        return new Cell(this, zoomLevel, x, y, null);

    }


    /*

        Returns all cells contained in a bbox.
        The bbox must be expressed in the
        coordinate system of the grid.

        bbox: bbox to test
        returns: list of cells

    */

    public getBboxCellCoverage(bbox: Bbox, zoomLevel: number): Cell[] {

        // Get squares
        const lowerLeft: Cell = this.coordinateInCell(bbox.lowerLeft, zoomLevel);
        const upperRight: Cell = this.coordinateInCell(bbox.upperRight, zoomLevel);

        // Output var
        let out: Cell[] = [];

        // Iterate cells enclosed by squares
        for (let x = lowerLeft.x ; x <= upperRight.x ; x++) {
            for (let y = lowerLeft.y ; y <= upperRight.y ; y++) {

                out.push(new Cell(this, zoomLevel, x, y, null));

            }

        }

        return(out);

    }



    /*

        Returns lower left and upper right cells that collides with a
        Bbox at a given zoom

    */
    public getSquareCellsInBbox(bbox: Bbox, zoom: number): {
        lowerLeft: Cell,
        upperRight: Cell
    } {

        const lowerLeft: Cell = this.coordinateInCell(bbox.lowerLeft, zoom);
        const upperRight: Cell = this.coordinateInCell(bbox.upperRight, zoom);

        return { lowerLeft: lowerLeft, upperRight: upperRight };

    }

}
