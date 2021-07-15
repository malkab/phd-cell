import { PgOrm } from "@malkab/rxpg"

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { Variable } from "../core/variable";

import { GridderTask } from "./griddertask";

import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { NodeLogger } from "@malkab/node-logger";

import { Grid } from "../core/grid";

/**
 *
 * An interface to describe the variables member items.
 *
 */
interface IPointAggregationsGridderTaskVariable {
  name: string;
  description: string;
  expression: string;
}

/**
 *
 * Point aggregations Gridder Task.
 *
 * This Gridder Task generates as many variables entries in its variables
 * member.
 *
 * This Gridder Task takes the set of points present in the cell and aggregates
 * their properties using the expressions provided in the variables member.
 *
 * The index var for this Gridder Task stores the following stats:
 * - nPoints: number of points in the cell.
 *
 */
export class PointAggregationsGridderTask extends GridderTask implements PgOrm.IPgOrm<PointAggregationsGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<PointAggregationsGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<PointAggregationsGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<PointAggregationsGridderTask> = (pg) => rx.of();

  /**
   *
   * The template name of the variables to be created.
   *
   */
  private _variableDefinitions: IPointAggregationsGridderTaskVariable[];
  get variableDefinitions(): IPointAggregationsGridderTaskVariable[] { return this._variableDefinitions }

  /**
   *
   * Constructor.
   *
   * @param __namedParameters
   * GridderTask deconstructed parameters.
   *
   * @param nameTemplate
   *
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      sourceTable,
      geomField,
      indexVariableKey,
      indexVariable,
      variableDefinitions
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      indexVariable?: Variable;
      variableDefinitions: IPointAggregationsGridderTaskVariable[];
  }) {

    super({
      gridderTaskId: gridderTaskId,
      gridderTaskType: EGRIDDERTASKTYPE.POINTAGGREGATIONS,
      gridderTaskTypeName: "Discrete variable on polygon area summary",
      gridderTaskTypeDescription: "Given a vector of discrete variables, create as many variables as categories present in the cell presenting the area covered by this category in the cell.",
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      pgDataType: "numeric",
      indexVariableKey: indexVariableKey,
      indexVariable: indexVariable
    });

    this._variableDefinitions = variableDefinitions;

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: () => `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7, $8);`,
        params$: () => rx.of([
          this.gridderTaskId,
          this.gridderTaskType,
          this.name,
          this.description,
          this.sourceTable,
          this.geomField,
          {
            variableDefinitions: this._variableDefinitions
          },
          this.indexVariableKey
        ])
      },

      pgUpdate$: {
        sql: () => `
        update cell_meta.gridder_task
        set
          name = $1,
          description = $2;`,
        params$: () => rx.of([
          this.name,
          this.description
        ])
      }

    })

  }

  /**
   *
   * Set ups the GridderTask for the GridderJob setup$ method. Creates all the
   * variables and catalogs.
   *
   */
  public setup$(sourcePg: RxPg, cellPg: RxPg, log?: NodeLogger):
  rx.Observable<any> {

    // To store the variables
    let variables: Variable[];

    variables =
      this.variableDefinitions.map((o: IPointAggregationsGridderTaskVariable) => {

        return new Variable({
          gridderTaskId: this.gridderTaskId,
          name: o.name,
          description: o.description,
          gridderTask: this
        })

    })

    return rx.concat(...variables.map((x: Variable) => x.pgInsert$(cellPg)))
    .pipe(

      rxo.last(),

      // Add index variable
      rxo.concatMap((o: Variable) => this.setIndexVariableKey$(cellPg)),

      rxo.map((o: any) => this)

    );

  }

  /**
   *
   * Apply the gridder task to a cell. Returns the child cells to compute the
   * next level on. Min zoom is the lowest zoom level to reach.
   *
   */
  public computeCell$(
    sourcePg: RxPg,
    cellPg: RxPg,
    cell: Cell,
    targetZoom: number,
    log?: NodeLogger
  ): rx.Observable<Cell[]> {

    // To store the variables in the same order as the variables member of this
    // GridderTask.
    let variables: Variable[];

    // A flag to signal points where colliding the cell to drill down
    let hasData: boolean = false;

    // Start of the SQL, taking into account the collision of the cell's geom.
    // This is a little bit tricky since PostgreSQL functions don't accept more
    // than 100 parameters, variables must be added in batchs of 50 (one
    // parameter for the var name, another for the value). This is the head of
    // the SQL, there can be more than one of these for many vars.
    let sql: string = `
      with a as (
        select *
        from ${this.sourceTable}
        where st_intersects(geom, st_geomfromewkt('${cell.ewkt}'))
      ),
      total as (
        select count(*) as n_points from a
      )
      select
        jsonb_build_object(
    `;

    // This is to store the SQL if there are too many vars
    const sqlBatches: string[] = [];

    // Number of batches
    let nBatches: number = 1;

    if (log) log.logInfo({
      message: `${this.logHeader(cell)}: compute start`,
      methodName: "computeCell$",
      moduleName: "PointAggregationsGridderTask",
      payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
    })

    // Get the dependencies
    return this.getVariables$(cellPg)
    .pipe(

      // Get cell grid
      rxo.concatMap((o: GridderTask) => {

        // To write less
        variables = (<Variable[]>this._variables);
        return cell.getGrid$(cellPg)

      }),

      // Compose the final SQL adding the variable names and expressions
      rxo.concatMap((o: Cell) => {

        // Check for SQL batches for many variables
        // Get number of 50 vars batches
        nBatches = Math.ceil(variables.length / 50);

        if (log) log.logInfo({
          message: `${this.logHeader(cell)}: ${nBatches} variable batches`,
          methodName: "computeCell$",
          moduleName: "PointAggregationsGridderTask",
          payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
        })

        // Process batches
        for (let i = 0; i < nBatches; i++) {

          // Slice variable definitions. Variable definitions has an order set
          // by the user that may not be the same as the order of the vars
          // retrieved from the DB
          const slicedVarsDef: IPointAggregationsGridderTaskVariable[] =
            this.variableDefinitions.slice(i * 50, (i+1)*50);

          // Create the SQL for the batch
          let batchSql: string = sql;

          // Iterate the sliced variable definitions
          slicedVarsDef.map((x: IPointAggregationsGridderTaskVariable) => {

            // Get the matching variable retrieved from the DB
            const v: Variable = variables.filter((y: Variable) =>
              y.name === x.name)[0];

            batchSql +=
              `'${v.variableKey}', ${x.expression},`;

          })

          batchSql = batchSql.replace(/,+$/, "");
          batchSql += `) as data, n_points from a, total group by n_points;`;

          // Add to the batch
          sqlBatches.push(batchSql);

        }

        return rx.zip(...sqlBatches.map((o: string) =>
          sourcePg.executeParamQuery$(o)));

      }),

      // Check results. If there are any data, update cell's data and update.
      rxo.concatMap((o: QueryResult) => {

        // To store the observables results for the processing of each batch
        const obs$: rx.Observable<Cell>[] = [];

        // Since all SQL batches must have the same row count if there were
        // points colliding the cell, checking results of the first batch is
        // enough to know if a drill down is needed and to write the index var
        if(o[0].rowCount > 0) {

          if (log) log.logInfo({
            message: `${this.logHeader(cell)}: ${o[0].rows[0].n_points} colliding points`,
            methodName: "computeCell$",
            moduleName: "PointAggregationsGridderTask",
            payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
          })

          // Process each batch so it updates the cell
          o.map((x: QueryResult) => {

            // Set the hasData flag
            hasData = true;

            cell.data = x.rows[0].data;

            // Set the index var
            cell.data[<string>(<Variable>this.indexVariable).variableKey] =
              { nPoints: x.rows[0].n_points };

            obs$.push(cell.pgUpdate$(cellPg));

          })

        } else {

          if (log) log.logInfo({
            message: `${this.logHeader(cell)}: no colliding points`,
            methodName: "computeCell$",
            moduleName: "PointAggregationsGridderTask",
            payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
          })

          obs$.push(rx.of(cell));

        }

        return rx.concat(...obs$);

      }),

      // Get the last result, if not, subcells are returned twice, making
      // everything really slow
      rxo.last(),

      // If there are data, check for sub cells to continue computations.
      rxo.map((o: any) => {

        if (hasData && cell.zoom < targetZoom ) {

          const c: Cell[] = cell.getSubCells(cell.zoom+1);

          if (log) log.logInfo({
            message: `${this.logHeader(cell)}: returning ${c.length} subcells`,
            methodName: "computeCell$",
            moduleName: "PointAggregationsGridderTask"
          })

          return c;

        } else {

          if (log) log.logInfo({
            message: `${this.logHeader(cell)}: end of gridding stack`,
            methodName: "computeCell$",
            moduleName: "PointAggregationsGridderTask"
          })

          return [];

        }

      })

    )

  }

}
