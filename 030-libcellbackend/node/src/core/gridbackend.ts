import { Grid, Coordinate, ZoomLevel } from "libcell";

import { PgOrm } from "@malkab/rxpg";

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

/**
 *
 * Grid, backend version.
 *
 */
export class GridBackend extends Grid implements PgOrm.IPgOrm<GridBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<GridBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<GridBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<GridBackend> = (pg) => rx.of();

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
      zoomLevels: any[];
  }) {

    super({
      description: description,
      gridId: gridId,
      name: name,
      origin: new Coordinate({ epsg: originEpsg, x: originX, y: originY }),
      zoomLevels: zoomLevels.map((o: any) => new ZoomLevel({ name: o.name,
        size: o.size}))
    })

    PgOrm.generateDefaultPgOrmMethods(this,
      {

        pgInsert$: {
          sql: `insert into cell_meta.grid values($1, $2, $3, $4, $5, $6, $7)`,
          params: () => [ this.gridId, this.name, this.description,
            this.origin.epsg, this.origin.x, this.origin.y,
            this.zoomLevels.map((o: ZoomLevel) => o.apiSafeSerial) ]
        }

      })

  }

}
