import { miniHash } from "@malkab/node-utils";

import { PgOrm, QueryResult, RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { EGRIDDERTASKTYPE } from "../griddertasks/egriddertasktype";

import { GridderTask } from "../griddertasks/griddertask";

import { gridderTaskGet$ } from "../griddertasks/griddertaskfactory";

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
  get gridderTaskId(): string { return this._gridderTaskId; }

  /**
   *
   * Column name, that is, a small name suitable for export in a table for other
   * formats. Will return a modified version of _name if null.
   *
   */
  private _columnName: string | undefined;
  get columnName(): string | undefined {

    // Check for undefined
    if (this._columnName === undefined) {

      // Sanitize _name
      return this._name.toLowerCase()
        .replace(/ /g, "_")
        .replace(/ñ/g, "ny")
        .replace(/á/g, "a")
        .replace(/é/g, "e")
        .replace(/í/g, "i")
        .replace(/ó/g, "o")
        .replace(/ú/g, "u")
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/\./g, "")
        .replace(/\//g, "_")
        .replace(/-/g, "_")
        .replace(/¿/g, "")
        .replace(/\?/g, "")
        .replace(/¡/g, "")
        .replace(/!/g, "")
        .replace(/\*/g, "")
        .replace(/:/g, "")
        .replace(/;/g, "")
        .replace(/,/g, "_")
        .replace(/\+/g, "");

    } else {

      return this._columnName;

    }

  }

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
   * The parent GridderTask, doesn't need to be defined.
   *
   */
  private _gridderTask: GridderTask | undefined;
  get gridderTask(): GridderTask | undefined { return this._gridderTask }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      gridderTask = undefined,
      variableKey = undefined,
      columnName = undefined,
      name,
      description
    }: {
      gridderTaskId: string;
      gridderTask?: GridderTask;
      variableKey?: string;
      columnName?: string;
      name: string;
      description: string;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._gridderTask = gridderTask;
    this._variableKey = variableKey;
    this._name = name;
    this._description = description;
    this._columnName = columnName;

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

  /**
   *
   * Retrieves the parent GridderTask.
   *
   */
  public getGridderTask$(pg: RxPg): rx.Observable<Variable> {

    return gridderTaskGet$(pg, this._gridderTaskId).pipe(

      rxo.map((o: GridderTask) => {

        this._gridderTask = o;

        return this;

      })

    )

  }

  /**
   *
   * Returns an SQL to generate a materialized view that extracts the variable
   * to a simple cell data / variable value table. The parent GridderTask must
   * be retrieved for this to work.
   *
   * @param mvName
   * The name of the materialized view to create.
   * @param __namedParameters
   * Optional parameters.
   * @param schema
   * Optional, the PG schema to use. Defaults to "public".
   * @param pgSqlDataType
   * Optional, the PG data type to cast the variable's value to. By default, it
   * gets it from the parent GridderTask.
   * @param minZoom
   * Optional, the min zoom of cells to extract. Must be lower or equal than
   * maxZoom. Both minZoom and maxZoom needs to be provided together.
   * @param maxZoom
   * Optional, the max zoom of cells to extract. Must be higher or equal than
   * maxZoom. Both minZoom and maxZoom needs to be provided together.
   * @returns
   * The SQL to create the materialized view and an index on it.
   *
   */
  public getSql(
    mvName: string,
    {
      schema = "public",
      pgSqlDataType = <string>this.gridderTask?.pgDataType,
      minZoom = undefined,
      maxZoom = undefined
    }: {
      schema?: string;
      pgSqlDataType?: string;
      minZoom?: number;
      maxZoom?: number;
    } = {}):
  string {

    if (this.gridderTask === undefined) {

      throw new Error("The parent GridderTask is undefined and no SQL string can be returned");

    }

    // To store the SQL
    let sql: string;

    if (this.gridderTask.gridderTaskType === EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA) {

      sql = `create materialized view ${schema}.${mvName} as select grid_id, epsg, zoom, x, y, b.value::${pgSqlDataType} as ${this.columnName}, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '${this.variableKey}' and data ->> '${this.variableKey}' = b.key where data ? '${this.variableKey}'`;

    } else {

      sql = `create materialized view ${schema}.${mvName} as select grid_id, epsg, zoom, x, y, (data ->> '${this.variableKey}')::${pgSqlDataType} as ${this.columnName}, geom from cell_data.data where data ? '${this.variableKey}'`;

    }

    // Check min zoom and max zoom
    if (minZoom !== undefined && maxZoom !== undefined) {

      // Check values
      if (minZoom <= maxZoom) {

        sql = `${sql} and zoom between ${minZoom} and ${maxZoom}`;

      } else {

        throw new Error("minZoom must be smaller or equal than maxZoom");

      }

    }

    // Add the index
    return `${sql}; create index idx_${mvName} on ${schema}.${mvName} using btree(grid_id, epsg, zoom, x, y);`;

  }

}
