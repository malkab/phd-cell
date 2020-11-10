import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Cell, Grid } from "libcell";

/**
 *
 * Variable, backend version.
 *
 */
export class CellBackend extends Cell implements PgOrm.IPgOrm<CellBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of(this);
  public pgInsert$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of(this);
  public pgUpdate$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of(this);

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
      grid: grid,
      data: data,
      offset: offset
    })

    PgOrm.generateDefaultPgOrmMethods(this,
      {

        pgInsert$: {
          sql: `
            insert into cell_data.data values(
              $1, $2, $3, $4, $5, '{}'::jsonb,
              cell__cellgeom(($1, $2, $3, $4, $5, '{}'::jsonb)::cell__cell),
              cell__cellgeom4326(($1, $2, $3, $4, $5, '{}'::jsonb)::cell__cell)
            )`,
          params: () => [ this.gridId, this.epsg, this.zoom,
            this.x, this.y ]
        }

      })

  }

  /**
   *
   * Get subcells as CellBackend.
   *
   */
  public getSubCellBackends(zoom: number): CellBackend[] {

    const cells: Cell[] = super.getSubCells(zoom);

    return cells.map((c: Cell) => new CellBackend({
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
