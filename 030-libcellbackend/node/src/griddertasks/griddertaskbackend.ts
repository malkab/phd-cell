import { GridderTasks as gt } from "libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { CellBackend } from "../core/cellbackend";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class GridderTaskBackend extends gt.GridderTask implements PgOrm.IPgOrm<GridderTaskBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<GridderTaskBackend> = (pg) =>
    { throw new Error("GridderTaskBackend pgDelete$ must be redefined in child classes") };
  public pgInsert$: (pg: RxPg) => rx.Observable<GridderTaskBackend> = (pg) =>
    { throw new Error("GridderTaskBackend pgInsert$ must be redefined in child classes") };
  public pgUpdate$: (pg: RxPg) => rx.Observable<GridderTaskBackend> = (pg) =>
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
   * Apply the gridder task to a cell.
   *
   */
  public computeCell(sourcePg: RxPg, cellPg: RxPg, cell: CellBackend):
  rx.Observable<any> {

    throw new Error("computeCell must be implemented in child classes");

  }

}
