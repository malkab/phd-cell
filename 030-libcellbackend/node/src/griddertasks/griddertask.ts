import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { EGRIDDERTASKTYPE } from "./egriddertasktype";

import { NodeLogger } from "@malkab/node-logger";

import { Grid } from "../core/grid";

import { Variable } from "../core/variable";

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
  protected _gridderTaskType: EGRIDDERTASKTYPE | undefined;
  get gridderTaskType(): EGRIDDERTASKTYPE | undefined { return this._gridderTaskType }

  /**
   *
   * GridderTask type name. This is the name of the GridderTask type itself, not
   * the specific task. It will be fixed for all GridderTasks for this type.
   *
   */
  protected _gridderTaskTypeName: string | undefined;
  get gridderTaskTypeName(): string | undefined { return this._gridderTaskTypeName }

  /**
   *
   * GridderTask type description. Like name, this is the GridderTask
   * description type itself, not for the specific GridderTask. All GridderTasks
   * of this type will have the same description.
   *
   */
  protected _gridderTaskTypeDescription: string | undefined;
  get gridderTaskTypeDescription(): string | undefined { return this._gridderTaskTypeDescription }

  /**
   *
   * Source table.
   *
   */
  protected _sourceTable: string;
  get sourceTable(): string { return this._sourceTable }

  /**
   *
   * GridderTaskId.
   *
   */
  protected _gridderTaskId: string;
  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * Name.
   *
   */
  protected _name: string;
  get name(): string { return this._name }

  /**
   *
   * Description.
   *
   */
  protected _description: string;
  get description(): string { return this._description }

  /**
   *
   * Description template for variables.
   *
   */
  protected _geomField: string;
  get geomField(): string { return this._geomField }

  /**
   *
   * The index variable key.
   *
   */
  protected _indexVariableKey: string | undefined;
  get indexVariableKey(): string | undefined { return this._indexVariableKey }

  /**
   *
   *
   * The index variable.
   *
   */
  protected _indexVariable: Variable | undefined;
  get indexVariable(): Variable | undefined { return this._indexVariable }

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
      name,
      description,
      sourceTable,
      geomField,
      indexVariableKey,
      indexVariable = undefined
    }: {
      gridderTaskId: string;
      gridderTaskType: EGRIDDERTASKTYPE;
      gridderTaskTypeName: string;
      gridderTaskTypeDescription: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      indexVariable?: Variable;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._gridderTaskType = gridderTaskType;
    this._gridderTaskTypeName = gridderTaskTypeName;
    this._gridderTaskTypeDescription = gridderTaskTypeDescription;
    this._name = name;
    this._description = description;
    this._sourceTable=  sourceTable;
    this._geomField = geomField;
    this._indexVariableKey = indexVariableKey;
    this._indexVariable = indexVariable;

  }

  /**
   *
   * Apply the gridder task to a cell. This method must return a single item
   * Observable with the child cells of the computed cell. This Observable is
   * allowed to throw errors.
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
   * return a single stream Observable with the GridderTask. This Observable is
   * allowed to throw errors.
   *
   */
  public setup$(sourcePg: RxPg, cellPg: RxPg, log?: NodeLogger):
  rx.Observable<GridderTask> {

    throw new Error("setup$ must be implemented in child classes");

  }

  /**
   *
   * Sets the index variable key. Some single-variable returning GridderTask
   * will use the single variable as the key, so no additional variable must
   * be created. This GridderTask should provide the indexVariableKey param.
   * For multi-variable producing GridderTask, however, a brand new index
   * variable is created.
   *
   */
  public setIndexVariableKey$(cellPg: RxPg, indexVariableKey?: string):
  rx.Observable<GridderTask> {

    // This is an index variable for multi-variable returning GridderTasks.
    // Single-variable returning GridderTasks won't use it.
    const idxVar: Variable = new Variable({
      gridderTaskId: this.gridderTaskId,
      name: `Index var ${this.gridderTaskId}`,
      description: `Index variable for GridderTask ${this.gridderTaskId}.`,
      gridderTask: this
    });

    // To store the final key of the index variable. This will depend on the
    // GridderTask supplying an indexVariableKey or not.
    const initialObservable$: rx.Observable<string> =
      indexVariableKey ? rx.of(indexVariableKey) :
      idxVar.pgInsert$(cellPg).pipe(rxo.map((o: Variable) => <string>o.variableKey));

    return initialObservable$
    .pipe(

      rxo.concatMap((o: string) => {

        return cellPg.executeParamQuery$(`
          update cell_meta.gridder_task
          set index_variable_key = $1
          where gridder_task_id = $2;`,
          {
            params: [ o, this.gridderTaskId ]
          }
        );

      })

    )

  }

  /**
   *
   * Gets the index variable and store it in the indexVariable member, returning
   * this GridderTask.
   *
   */
  public getIndexVariable$(cellPg: RxPg): rx.Observable<GridderTask> {

    return Variable.getByKey$(cellPg, <string>this.indexVariableKey)
    .pipe(

      rxo.catchError((o: Error) => {

        return rx.throwError(new Error(`GridderTask ${this.gridderTaskId} of type ${this.gridderTaskType} has no index Variable, set it up first`));

      }),

      rxo.map((o: Variable) => {

        this._indexVariable = o;
        return this;

      })

    )

  }

  /**
   *
   * Gets dependencies: Grid and index variable, setting them in the right
   * members.
   *
   */
  public getDependencies$(cellPg: RxPg): rx.Observable<GridderTask> {

    return rx.zip(this.getIndexVariable$(cellPg))
    .pipe(

      rxo.map((o: any) => o[0])

    )

  }

}
