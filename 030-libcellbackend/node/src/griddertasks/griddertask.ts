import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { EGRIDDERTASKTYPE } from "./egriddertasktype";

import { NodeLogger } from "@malkab/node-logger";

import { Grid } from "../core/grid";

/**
 *
 * Base class to define GridderTasks. A gridder task describes the lower level
 * of abstraction in a gridding process. A gridder task will produce one or
 * several variables and many gridderjobs.
 *
 */
export class GridderTask implements PgOrm.IPgOrm<GridderTask> {

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
   * GridderTask type.
   *
   */
  private _gridderTaskType: EGRIDDERTASKTYPE | undefined;
  get gridderTaskType(): EGRIDDERTASKTYPE | undefined { return this._gridderTaskType }

  /**
   *
   * GridderTask type name. This is the name of the GridderTask type itself, not
   * the specific task. It will be fixed for all GridderTasks for this type.
   *
   */
  private _gridderTaskTypeName: string | undefined;
  get gridderTaskTypeName(): string | undefined { return this._gridderTaskTypeName }

  /**
   *
   * GridderTask type description. Like name, this is the GridderTask
   * description type itself, not for the specific GridderTask. All GridderTasks
   * of this type will have the same description.
   *
   */
  private _gridderTaskTypeDescription: string | undefined;
  get gridderTaskTypeDescription(): string | undefined { return this._gridderTaskTypeDescription }

  /**
   *
   * The grid ID.
   *
   */
  private _gridId: string;
  get gridId(): string { return this._gridId }

  /**
   *
   * The grid.
   *
   */
  private _grid: Grid | undefined;
  get grid(): Grid | undefined { return this._grid };
  set grid(grid: Grid | undefined) { this._grid = grid };

  /**
   *
   * Source table.
   *
   */
  private _sourceTable: string;
  get sourceTable(): string { return this._sourceTable }

  /**
   *
   * GridderTaskId.
   *
   */
  private _gridderTaskId: string;
  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * Name.
   *
   */
  private _name: string;
  get name(): string { return this._name }

  /**
   *
   * Description.
   *
   */
  private _description: string;
  get description(): string { return this._description }

  /**
   *
   * Description template for variables.
   *
   */
  private _geomField: string;
  get geomField(): string { return this._geomField }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      gridderTaskType,
      gridderTaskTypeName,
      gridderTaskTypeDescription,
      gridId,
      grid = undefined,
      name,
      description,
      sourceTable,
      geomField
    }: {
      gridderTaskId: string;
      gridderTaskType: EGRIDDERTASKTYPE;
      gridderTaskTypeName: string;
      gridderTaskTypeDescription: string;
      gridId: string;
      grid?: Grid;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._gridderTaskType = gridderTaskType;
    this._gridderTaskTypeName = gridderTaskTypeName;
    this._gridderTaskTypeDescription = gridderTaskTypeDescription;
    this._gridId = gridId;
    this._grid = grid;
    this._name = name;
    this._description = description;
    this._sourceTable=  sourceTable;
    this._geomField = geomField;

  }

  /**
   *
   * Apply the gridder task to a cell. This method must return a single item
   * Observable with the child cells of the computed cell.
   *
   */
  public computeCell$(
    sourcePg: RxPg,
    cellPg: RxPg,
    cell: Cell,
    minZoom: number,
    log?: NodeLogger
  ):
  rx.Observable<Cell[]> {

    throw new Error("computeCell$ must be implemented in child classes");

  }

  /**
   *
   * Set ups the GridderTask for the GridderJob setup$ method. This method must
   * return a single stream Observable with the GridderTask.
   *
   */
  public setup$(sourcePg: RxPg, cellPg: RxPg, log?: NodeLogger):
  rx.Observable<GridderTask> {

    throw new Error("setup$ must be implemented in child classes");

  }

  /**
   *
   * Get the grid of this GridderTask.
   *
   */
  public getGrid$(cellPg: RxPg): rx.Observable<GridderTask> {

    return Grid.get$(cellPg, this.gridId)
    .pipe(

      rxo.map((o: Grid) => {
        this.grid = o;
        return this;
      })

    )

  }

}
