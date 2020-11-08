import { RxPg, PgOrm, QueryResult } from '@malkab/rxpg';

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { PgConnection } from 'src/core/pgconnection';

/**
 *
 * This class defines a GridderJob, that is, the application of a GridderTask
 * on a given area and between two zoom ranges.
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
   * PgConnection ID.
   *
   */
  private _pgConnectionId: string;

  get pgConnectionId(): any { return this._pgConnectionId }

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
      pgConnectionId,
      sqlAreaRetrieval,
      area = undefined
    }: {
      gridderJobId: string;
      gridderTaskId: string;
      maxZoomLevel: number;
      minZoomLevel: number;
      pgConnectionId: string;
      pgConnection?: PgConnection;
      sqlAreaRetrieval: string;
      area?: any;
  }) {

    this._gridderJobId = gridderJobId;
    this._gridderTaskId = gridderTaskId;
    this._maxZoomLevel = maxZoomLevel;
    this._minZoomLevel = minZoomLevel;
    this._pgConnectionId = pgConnectionId;
    this._sqlAreaRetrieval = sqlAreaRetrieval;
    this._area = area;

    PgOrm.generateDefaultPgOrmMethods(this, {
      pgInsert$: {
        sql: `
          insert into cell_meta.gridder_job
          values ($1, $2, $3, $4, $5, $6, $7);`,
        params: () => [ this._gridderJobId, this._gridderTaskId,
          this._maxZoomLevel, this._minZoomLevel, this._pgConnectionId,
          this._sqlAreaRetrieval, this._area ]
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
          pg_connection_id as "pgConnectionId",
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
   * Get area geometry and store it.
   *
   */
  public getArea$(areaSourcePgConnection: PgConnection, cellPgConnection: PgConnection):
  rx.Observable<any> {

    const sourcePg: RxPg = areaSourcePgConnection.open();
    const cellPg: RxPg = cellPgConnection.open();

    return sourcePg.executeQuery$(
      `select st_asewkt(st_transform(st_union(geom), 4326)) as area from (${this._sqlAreaRetrieval}) a`)
    .pipe(

      rxo.concatMap((o: QueryResult) => {

        this._area = o.rows[0].area;

        return cellPg.executeParamQuery$(`
          update cell_meta.gridder_job
          set area = st_geomfromewkt('${this.area}'::text)
          where gridder_job_id = $1`,
          [ this.gridderJobId ]
        );

      }),

      rxo.map((o: QueryResult) => {

        return this;

      })

    )

  }

}
