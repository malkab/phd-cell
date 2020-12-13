import { PgOrm } from "@malkab/rxpg";

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Coordinate } from "../core/coordinate";

import { ZoomLevel } from "../core/zoomlevel";

import { Cell } from "../core/cell";

import { Bbox } from "../core/bbox";

/**
 *
 * Grid, backend version.
 *
 */
export class Grid implements PgOrm.IPgOrm<Grid> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<Grid> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<Grid> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<Grid> = (pg) => rx.of();

  /**
   *
   * Grid ID.
   *
   */
  private _gridId: string;
  get gridId(): string { return this._gridId }

  /**
   *
   * The EPSG of the grid.
   *
   */
  get epsg(): string { return this.origin.epsg; }

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
   * Constructor.
   *
   */
  constructor({
    gridId,
    name,
    description,
    originEpsg,
    originX,
    originY,
    zoomLevels
  }: {
    gridId: string;
    name: string;
    description: string;
    originEpsg: string;
    originX: number;
    originY: number;
    zoomLevels: { name: string, size: number }[];
}) {

  this._gridId = gridId;
  this._name = name;
  this._description = description;
  this._zoomLevels = zoomLevels.map((o: any) =>
    new ZoomLevel({ name: o.name, size: o.size }));
  this._origin = new Coordinate({ epsg: originEpsg, x: originX, y: originY });

  PgOrm.generateDefaultPgOrmMethods(this,
    {

      pgInsert$: {
        sql: () => `insert into cell_meta.grid values($1, $2, $3, $4, $5, $6, $7)`,
        params$: () => rx.of([ this.gridId, this.name, this.description,
          this.origin.epsg, this.origin.x, this.origin.y,
          this.zoomLevels.map((o: ZoomLevel) => o.apiSafeSerial) ])
      }

    })

  }

  /*

      Returns the cell a point is on at a certain zoom level.

    */
  public coordinateInCell(coordinate: Coordinate, zoomLevel: number): Cell {

    const size = this._zoomLevels[zoomLevel].size;

    const x: number = Math.floor((coordinate.x - this._origin.x) / size);
    const y: number = Math.floor((coordinate.y - this._origin.y) / size);

    return new Cell({
      grid: this,
      zoom: zoomLevel,
      x: x,
      y: y,
      gridId: this._gridId,
    });

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

        out.push(new Cell({
          grid: this,
          zoom: zoomLevel,
          x: x,
          y: y,
          gridId: this._gridId
        }));

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

  /**
   *
   * Get the grid from the DB.
   *
   */
  public static get$(pg: RxPg, gridId: string): rx.Observable<Grid> {

    return PgOrm.select$<Grid>({
      pg: pg,
      sql: `
        select
          grid_id as "gridId",
          name,
          description,
          origin_epsg as "originEpsg",
          origin_x as "originX",
          origin_y as "originY",
          zoom_levels as "zoomLevels"
        from cell_meta.grid
        where grid_id = $1;`,
      type: Grid,
      params: () => [ gridId ]
    })

  }

}
