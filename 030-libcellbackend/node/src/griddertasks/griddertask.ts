import { GridderTasks as gt } from "@malkab/libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Cell } from "../core/cell";

/**
 *
 * Base class to define GridderTasks. A gridder task describes the lower level
 * of abstraction in a gridding process. A gridder task will produce one or
 * several variables and many gridderjobs.
 *
 */
export class GridderTask extends gt.GridderTask implements PgOrm.IPgOrm<GridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<GridderTask> = (pg) =>
    { throw new Error("GridderTaskBackend pgDelete$ must be redefined in child classes") };
  public pgInsert$: (pg: RxPg) => rx.Observable<GridderTask> = (pg) =>
    { throw new Error("GridderTaskBackend pgInsert$ must be redefined in child classes") };
  public pgUpdate$: (pg: RxPg) => rx.Observable<GridderTask> = (pg) =>
    { throw new Error("GridderTaskBackend pgUpdate$ must be redefined in child classes") };

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      sourceTable,
      geomField
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField
    });

  }

  /**
   *
   * Apply the gridder task to a cell. This method must return child
   *
   */
  public computeCell$(sourcePg: RxPg, cellPg: RxPg, cell: Cell, minZoom: number):
  rx.Observable<any> { // Cell[]> {

    throw new Error("computeCell$ must be implemented in child classes");

  }

  /**
   *
   * Set ups the GridderTask for the GridderJob setup$ method.
   *
   */
  public setup$(sourcePg: RxPg, cellPg: RxPg): rx.Observable<any> {

    throw new Error("setup$ must be implemented in child classes");

  }

}
