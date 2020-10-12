import { Coordinate } from "./coordinate";

import { ZoomLevel } from "./zoomlevel";

import { Bbox } from "./bbox";

import { Cell } from "./cell";

/*

    Grid class

*/
export class Grid {

  /**
   *
   * The EPSG of the grid.
   *
   */
  get epsg(): string { return this._epsg; }

  private _epsg: string;

  /**
   *
   * Zoom levels.
   *
   */
  get zoomLevels(): ZoomLevel[] { return this._zoomLevels; }

  private _zoomLevels: ZoomLevel[];

  /**
   *
   * Origin.
   *
   */
  get origin(): Coordinate { return this._origin; }

  private _origin: Coordinate;

  /**
   *
   * Name of the grid.
   *
   */

  get name(): string { return this._name; }

  private _name: string;

  /**
   *
   * Description of the grid.
   *
   */
  get description(): string { return this._description; }

  private _description: string;

  /**
   *
   * Long description of the grid.
   *
   */
  get longDescription(): string { return this._longDescription; }

  private _longDescription: string;

  /*

    Constructor.

  */
  constructor({
      name,
      description,
      longDescription,
      origin,
      zoomLevels
    }: {
      name: string,
      description: string,
      longDescription: string,
      origin: Coordinate,
      zoomLevels: ZoomLevel[]
  }) {

    this._name = name;
    this._description = description;
    this._longDescription = longDescription;
    this._epsg = origin.epsg;
    this._zoomLevels = zoomLevels;
    this._origin = origin;

  }

  /*

    Returns the cell a point is on at a certain zoom level.

  */
  public coordinateInCell(coordinate: Coordinate, zoomLevel: number): Cell {

    const size = this._zoomLevels[zoomLevel].size;

    const x: number = Math.floor((coordinate.x - this._origin.x) / size);
    const y: number = Math.floor((coordinate.y - this._origin.y) / size);

    return new Cell({ grid: this, zoom: zoomLevel, x: x, y: y });

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
    const out: Cell[] = [];

    // Iterate cells enclosed by squares
    for (let x = lowerLeft.x ; x <= upperRight.x ; x++) {

      for (let y = lowerLeft.y ; y <= upperRight.y ; y++) {

        out.push(new Cell({ grid: this, zoom: zoomLevel, x: x, y: y }));

      }

    }

    return(out);

  }

  /*

    Returns lower left and upper right cells that collides with a Bbox at a
    given zoom

  */
  public getSquareCellsInBbox(bbox: Bbox, zoom: number): {
    lowerLeft: Cell,
    upperRight: Cell
  } {

    const lowerLeft: Cell = this.coordinateInCell(bbox.lowerLeft, zoom);
    const upperRight: Cell = this.coordinateInCell(bbox.upperRight, zoom);
    return { lowerLeft: lowerLeft, upperRight: upperRight };

  }

  /*

    Returns the number of child cells a top level one has way down
    to a certain inferior level. For example, a 100km cell has a total
    of 4 50km + 100 10km + 400 5km + 10000 1km = 10504 total child cells

    topLevel: number: The top level cell

    bottomLevel: number: The bottom level cell

    returns: number: The number of child cells on all intermediate levels
                      (including the bottom but not the top)

  */
  public numChildCells(topLevel: number, bottomLevel: number): number {

    let out: number = 0;

    for (let i = topLevel + 1 ; i <= bottomLevel ; i++ ) {

      out += Math.pow(
        this._zoomLevels[topLevel].size / this._zoomLevels[i].size, 2);

    }

    return out;

  }

}
