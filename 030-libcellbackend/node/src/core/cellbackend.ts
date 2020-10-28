import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Cell } from "libcell";

import { GridBackend } from "./gridbackend";

/**
 *
 * Variable, backend version.
 *
 */
export class CellBackend extends Cell implements PgOrm.IPgOrm<CellBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of();

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
      grid?: GridBackend;
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
      grid: grid,
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

}
