import { RxPg, PgOrm, QueryResult } from '@malkab/rxpg';

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { PgConnection } from '../core/pgconnection';

import { gridderTaskGet$ } from "./griddertaskfactory";

import { Cell } from "../core/cell";

import { Grid } from "../core/grid";

/**
 *
 * This class defines a GridderJob, that is, the application of a GridderTask on
 * a given area and between two zoom ranges. This is the upper level in the
 * gridding process. A GridderJob generates GridderTasks that grid the cells.
 *
 */
export class GridderJob implements PgOrm.IPgOrm<GridderJob> {

  // Placeholder for the required functions at the IPgPersistence interface
  // These will be created automatically by a helper at construction time
  public pgInsert$: (pg: RxPg) => rx.Observable<GridderJob> =
    (pg: RxPg) => rx.of(this);
  public pgUpdate$: (pg: RxPg) => rx.Observable<GridderJob> =
    (pg: RxPg) => rx.of(this);
  public pgDelete$: (pg: RxPg) => rx.Observable<GridderJob> =
    (pg: RxPg) => rx.of(this);

  /**
   *
   * GridderJobId.
   *
   */
  private _gridderJobId: string;
  get gridderJobId(): string { return this._gridderJobId }

  /**
   *
   * GridderTaskId.
   *
   */
  private _gridderTaskId: string;
  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * Max zoom level.
   *
   */
  private _maxZoomLevel: number;
  get maxZoomLevel(): number { return this._maxZoomLevel }

  /**
   *
   * Min zoom level.
   *
   */
  private _minZoomLevel: number;
  get minZoomLevel(): number { return this._minZoomLevel }

  /**
   *
   * SQL to retrieve the area from the PgConnection.
   *
   */
  private _sqlAreaRetrieval: string;
  get sqlAreaRetrieval(): any { return this._sqlAreaRetrieval }

  /**
   *
   * Area.
   *
   */
  private _area: any;
  get area(): any { return this._area }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderJobId,
      gridderTaskId,
      maxZoomLevel,
      minZoomLevel,
      sqlAreaRetrieval,
      area = undefined
    }: {
      gridderJobId: string;
      gridderTaskId: string;
      maxZoomLevel: number;
      minZoomLevel: number;
      sqlAreaRetrieval: string;
      area?: any;
  }) {

    this._gridderJobId = gridderJobId;
    this._gridderTaskId = gridderTaskId;
    this._maxZoomLevel = maxZoomLevel;
    this._minZoomLevel = minZoomLevel;
    this._sqlAreaRetrieval = sqlAreaRetrieval;
    this._area = area;

    PgOrm.generateDefaultPgOrmMethods(this, {
      pgInsert$: {
        sql: () => `
          insert into cell_meta.gridder_job
          values ($1, $2, $3, $4, $5, $6);`,
        params$: () => rx.of([ this._gridderJobId, this._gridderTaskId,
          this._maxZoomLevel, this._minZoomLevel,
          this._sqlAreaRetrieval, this._area ])
      }
    })

  }

  /**
   *
   * Get area geometry and store it.
   *
   */
  public static get$(pg: RxPg, gridderJobId: string): rx.Observable<GridderJob> {

    return PgOrm.select$<GridderJob>({
      sql: `
        select
          gridder_job_id as "gridderJobId",
          gridder_task_id as "gridderTaskId",
          max_zoom_level as "maxZoomLevel",
          min_zoom_level as "minZoomLevel",
          sql_area_retrieval as "sqlAreaRetrieval",
          area
        from cell_meta.gridder_job
        where gridder_job_id = $1;`,
      params: () => [ gridderJobId ],
      pg: pg,
      type: GridderJob
    })

  }

  /**
   *
   * Get area geometry and store it, transforming it to the CRS of the given
   * grid.
   *
   */
  public getArea$(
    areaSourcePgConnection: PgConnection,
    cellPgConnection: PgConnection,
    grid: Grid
  ): rx.Observable<any> {

    const sourcePg: RxPg = areaSourcePgConnection.open();
    const cellPg: RxPg = cellPgConnection.open();

    return sourcePg.executeParamQuery$(
      `select st_asewkt(st_transform(st_union(geom), ${grid.epsg})) as area from (${this._sqlAreaRetrieval}) a`)
    .pipe(

      rxo.concatMap((o: QueryResult) => {

        this._area = o.rows[0].area;

        return cellPg.executeParamQuery$(`
          update cell_meta.gridder_job
          set area = st_multi(st_geomfromewkt('${this.area}'::text))
          where gridder_job_id = $1`,
          { params: [ this.gridderJobId ] }
        );

      }),

      rxo.map((o: QueryResult) => {

        return this;

      })

    )

  }

  /**
   *
   * Start the job.
   *
   */
  // public eventStart$(cellPgConnection: PgConnection): rx.Observable<any> {

  //   const cellPg: RxPg = cellPgConnection.open();

  //   return

  // }

  /**
   *
   * Inserts the cells covering the area in a given zoom. Returns the number of
   * cells generated.
   *
   */
  public getCoveringCells$(pg: RxPg, grid: Grid, zoom: number): rx.Observable<number> {

    const sql: string = `
      with a as (
        select st_transform(area, ${grid.epsg}) as area
        from cell_meta.gridder_job
        where gridder_job_id = '${this.gridderJobId}'
      )
      select
        cell__setcell(cell__getcoverage('${grid.gridId}', ${zoom}, area)) as cell
      from a;`;

    return pg.executeParamQuery$(sql).pipe(

      rxo.map((o: any) => o.rowCount)

    )

  }

}
