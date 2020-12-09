import { Cell } from '../node/src/core/cell';

import { RxPg, PgOrm } from '@malkab/rxpg';

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { GridderJob } from '../node/src/griddertasks/gridderjob';

import { gridderTaskGet$ } from '../node/src/griddertasks/griddertaskfactory';

import { GridderTask } from '../node/src/griddertasks/griddertask';

/**
 *
 * This object handles the gridding of a cell in terms defined by a GridderTask.
 *
 * A GridderTask defines the GridderTask type and their configuration in terms
 * of source table, geom field, discrete fields, etc.
 *
 * On a GridderTask, a GridderJob is created. A GridderJob is the application of
 * a GridderTask on a zoom range and an area.
 *
 * Finally, the GridderTask creates several GridderCell items that performs the
 * real gridding and, in turn, produces more GridderCells to process child
 * cells.
 *
 */
export class GridderCell implements PgOrm.IPgOrm<GridderCell> {

  // Placeholder for the required functions at the IPgPersistence interface
  // These will be created automatically by a helper at construction time
  public pgUpdate$: (pg: RxPg) => rx.Observable<GridderCell> =
    (pg: RxPg) => rx.of(this);
  public pgDelete$: (pg: RxPg) => rx.Observable<GridderCell> =
    (pg: RxPg) => rx.of(this);

  /**
   *
   * GridderCell ID.
   *
   */
  private _gridderCellId: string;

  get gridderCellId(): string { return this._gridderCellId }

  /**
   *
   * GridderJob ID.
   *
   */
  private _gridderJobId: string;

  get gridderJobId(): string { return this._gridderJobId }

  /**
   *
   * GridderJob.
   *
   */
  private _gridderJob: GridderJob | undefined;

  get gridderJob(): GridderJob | undefined { return this._gridderJob }

  /**
   *
   * Cell.
   *
   */
  private _cell: Cell;

  get cell(): Cell { return this._cell }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderCellId,
      gridderJobId,
      gridderJob,
      gridId,
      epsg,
      zoom,
      x,
      y
    }: {
      gridderCellId: string;
      gridderJobId: string;
      gridderJob?: GridderJob;
      gridId: string;
      epsg: string;
      zoom: number;
      x: number;
      y: number;
  }) {

    this._gridderCellId = gridderCellId;
    this._gridderJobId = gridderJobId;
    this._gridderJob = gridderJob;
    this._cell = new Cell({
      epsg: epsg,
      gridId: gridId,
      x: x,
      y: y,
      zoom: zoom
    });

  }

  /**
   *
   * pgInsert$.
   *
   */
  public pgInsert$(pg: RxPg): rx.Observable<GridderCell> {

    const sql: string = `
      insert into cell_meta.gridder_cell
      values ($1, $2, ${this.cell.sqlInsertRepresentation});`;

    return pg.executeParamQuery$(sql,
        { params: [ this._gridderCellId, this._gridderJobId ] })
    .pipe(rxo.map((o: any) => this))

  }

  /**
   *
   * get$.
   *
   */
  public static get$(pg: RxPg, gridderCellId: string): rx.Observable<GridderCell> {

    return PgOrm.select$<GridderCell>({
      pg: pg,
      sql: `
        select
          gridder_cell_id as "gridderCellId",
          gridder_job_id as "gridderJobId",
          (cell).grid_id as "gridId",
          (cell).epsg,
          (cell).zoom,
          (cell).x,
          (cell).y
        from
          cell_meta.gridder_cell
        where gridder_cell_id = $1;`,
      params: () => [ gridderCellId ],
      type: GridderCell
    }).pipe(

      rxo.concatMap((o: GridderCell) => {

        return rx.of(o);

      })
    )

  }

  /**
   *
   * Process.
   *
   */
  public process(pg: RxPg): rx.Observable<any> {

    // Get the GridderJob
    return GridderJob.get$(pg, this.gridderJobId)
    .pipe(

      rxo.concatMap((o: GridderJob) => {

        return gridderTaskGet$(pg, o.gridderTaskId);

      }),

      rxo.map((o: GridderTask) => {

        console.log("D: kkkkkk", o);

        return this;

      })

    )

  }

}
