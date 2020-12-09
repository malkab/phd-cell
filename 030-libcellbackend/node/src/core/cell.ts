import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Cell as CellL } from "@malkab/libcell";

import { Grid } from "./grid";

/**
 *
 * Variable, backend version.
 *
 */
export class Cell extends CellL implements PgOrm.IPgOrm<Cell> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<Cell> = (pg) => rx.of(this);
  public pgInsert$: (pg: RxPg) => rx.Observable<Cell> = (pg) => rx.of(this);
  public pgUpdate$: (pg: RxPg) => rx.Observable<Cell> = (pg) => rx.of(this);

  /**
   *
   * Returns a representation of the cell to insert into a database cell in the
   * form (grid_id, epsg, zoom, x, y, '{}'::json)::cell__cell for insert SQL.
   *
   */
  get sqlInsertRepresentation(): string {

    return `('${this.gridId}', ${this.epsg}, ${this.zoom}, ${this.x}, ${this.y}, '{}'::json)::cell__cell`

  }

  /**
   *
   * Redefinition of grid member.
   *
   */
  protected _grid: Grid | undefined;
  get grid(): Grid | undefined { return this._grid }
  set grid(grid: Grid | undefined) { this._grid = grid }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridId,
      grid = undefined,
      epsg,
      zoom,
      x,
      y,
      data = {},
      offset = 0
    }: {
      gridId: string;
      grid?: Grid;
      epsg: string;
      zoom: number;
      x: number;
      y: number;
      data?: any;
      offset?: number;
  }) {

    super({
      epsg: epsg,
      gridId: gridId,
      x: x,
      y: y,
      zoom: zoom,
      data: data,
      offset: offset
    })

    this._grid = grid;

    PgOrm.generateDefaultPgOrmMethods(this,
      {

        pgInsert$: {
          sql: () => `
            insert into cell_data.data values(
              $1, $2, $3, $4, $5, '{}'::jsonb,
              cell__cellgeom(($1, $2, $3, $4, $5, '{}'::jsonb)::cell__cell),
              cell__cellgeom4326(($1, $2, $3, $4, $5, '{}'::jsonb)::cell__cell)
            )`,
          params$: () => rx.of([ this.gridId, this.epsg, this.zoom,
            this.x, this.y ])
        }

      })

  }

  /**
   *
   * Get subcells as .
   *
   */
  public getSubCells(zoom: number): Cell[] {

    const cells: CellL[] = super.getSubCells(zoom);

    return cells.map((c: CellL) => new Cell({
      gridId: this.gridId,
      epsg: this.epsg,
      x: c.x,
      y: c.y,
      zoom: c.zoom,
      data: c.data,
      grid: this.grid,
      offset: c.offset
    }))

  }

}
