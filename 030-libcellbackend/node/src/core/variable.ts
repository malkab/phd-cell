import { PgOrm, RxPg, QueryResult } from "@malkab/rxpg"

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { GridderTask } from "../griddertasks/griddertask";

import { miniHash } from "@malkab/node-utils";

import { Catalog } from "./catalog";

/**
 *
 * Variable, backend version.
 *
 */
export class Variable implements PgOrm.IPgOrm<Variable> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<Variable> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<Variable> = (pg) => rx.of();

  /**
   *
   * The Gridder Task ID.
   *
   */
  private _gridderTaskId: string;
  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * The Gridder Task.
   *
   */
  private _gridderTask: GridderTask | undefined;
  get gridderTask(): GridderTask | undefined { return this._gridderTask }
  set gridderTask(gridderTask: GridderTask | undefined) { this._gridderTask = gridderTask }

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
   * Key. This is the key used at the data vector to refer to the variable.
   *
   */
  private _variableKey: string | undefined;
  get variableKey(): string | undefined { return this._variableKey }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      gridderTask = undefined,
      variableKey = undefined,
      name,
      description
    }: {
      gridderTaskId: string;
      gridderTask?: GridderTask;
      variableKey?: string;
      name: string;
      description: string;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._gridderTask = gridderTask;
    this._variableKey = variableKey;
    this._name = name;
    this._description = description;

  }

  /**
   *
   * pgInsert$: this will create a new key different from all other present
   * already in the system to use at the data vector.
   *
   * The key is assigned based on the variable ID.
   *
   */
  public pgInsert$(pg: RxPg): rx.Observable<Variable> {

    // Get existing minihashes to generate a new minihash from the VariableId
    const sql: string = `
      select variable_key from cell_meta.variable`;

    return pg.executeParamQuery$(sql)
    .pipe(

      rxo.concatMap((o: QueryResult) => {

        const existingMiniHashes: string[] = o.rows.map((o: any) =>
          o.variable_key);

        // Get new minihash
        this._variableKey = miniHash({
          values: [ `${this.gridderTaskId}${this.name}` ],
          existingMiniHashes: existingMiniHashes
        })[0];

        const sql: string = `
          insert into cell_meta.variable values($1, $2, $3, $4);`;

        return pg.executeParamQuery$(sql,
          { params: [ this.gridderTaskId, this.variableKey, this.name,
            this.description ] });

      }),

      rxo.map((o: QueryResult) => this)

    )

  }

  /**
   *
   * Get variables by its GridderTaskId.
   *
   */
  public static getByGridderTaskId$(pg: RxPg, gridderTaskId: string): rx.Observable<Variable[]> {

    return PgOrm.selectMany$<Variable>({
      pg: pg,
      sql: `
        select
          gridder_task_id as "gridderTaskId",
          variable_key as "variableKey",
          *
        from cell_meta.variable
        where gridder_task_id = $1`,
      params: () => [ gridderTaskId ],
      type: Variable
    })

  }

  /**
   *
   * Returns a catalog for a discrete variable.
   *
   */
  public getCatalog$(): Catalog {

    return new Catalog({
      gridderTaskId: this.gridderTaskId,
      variableKey: <string>this.variableKey
    })

  }

  /**
   *
   * Get variables by its GridderTaskId and name. This is needed for the
   * DiscretePolyAreaSummary Gridder Task that generates many variables.
   *
   */
  public static getByGridderTaskIdAndName$(
    pg: RxPg,
    gridderTaskId: string,
    variableName: string
  ): rx.Observable<Variable> {

    return PgOrm.select$<Variable>({
      pg: pg,
      sql: `
        select
          gridder_task_id as "gridderTaskId",
          variable_key as "variableKey",
          *
        from cell_meta.variable
        where gridder_task_id = $1 and name = $2`,
      params: () => [ gridderTaskId, variableName ],
      type: Variable
    })

  }

  /**
   *
   * Get variable by key.
   *
   */
  public static getByKey$(pg: RxPg, key: string):
  rx.Observable<Variable> {

    return PgOrm.select$<Variable>({
      pg: pg,
      sql: `
        select
          gridder_task_id as "gridderTaskId",
          variable_key as "variableKey",
          *
        from cell_meta.variable
        where variable_key = $1`,
      params: () => [ key ],
      type: Variable
    })

  }

}
