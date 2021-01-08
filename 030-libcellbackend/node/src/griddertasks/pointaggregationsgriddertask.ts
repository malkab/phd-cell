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
  private _variables: IPointAggregationsGridderTaskVariable[];
  get variables(): IPointAggregationsGridderTaskVariable[] { return this._variables }

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
      variables
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      indexVariable?: Variable;
      variables: IPointAggregationsGridderTaskVariable[];
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
      indexVariableKey: indexVariableKey,
      indexVariable: indexVariable
    });

    this._variables = variables;

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
            variables: this._variables
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

    variables = this.variables.map((o: IPointAggregationsGridderTaskVariable) => {

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

    // To get the variables
    let variableObs$: rx.Observable<Variable>[] =
      this.variables.map((o: IPointAggregationsGridderTaskVariable) =>
        Variable.getByGridderTaskIdAndName$(cellPg, this.gridderTaskId,
          o.name))

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

    // Get the dependencies
    return this.getDependencies$(cellPg)
    .pipe(

      // Get cell grid
      rxo.concatMap((o: GridderTask) => cell.getGrid$(cellPg)),

      // Get the variables for this GridderTask in the same order they are coded
      // in the variables member
      rxo.concatMap((o: Cell) => rx.zip(...variableObs$)),

      // Compose the final SQL adding the variable names and expressions
      rxo.concatMap((o: Variable[]) => {

        // Cache variables
        variables = o;

        // Check for SQL batches for many variables
        // Get number of 50 vars batches
        nBatches = Math.ceil(variables.length / 50);

        // Process batches
        for (let i = 0; i < nBatches; i++) {

          // Slice variables and variables descriptions for the batch
          const slicedVars: Variable[] = variables.slice(i * 50, (i+1)*50);
          const slicedVarsDef: IPointAggregationsGridderTaskVariable[] =
            this.variables.slice(i * 50, (i+1)*50);

          // Create the SQL for the batch
          let batchSql: string = sql;

          for(let i=0; i<slicedVars.length; i++) {

            batchSql +=
              `'${slicedVars[i].variableKey}', ${slicedVarsDef[i].expression},`;

          }

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

          obs$.push(rx.of(cell));

        }

        return rx.concat(...obs$);

      }),

      rxo.bufferCount(nBatches),

      // If there are data, check for sub cells to continue computations.
      rxo.map((o: any) => {

        if (hasData) {

          if (cell.zoom < targetZoom ) {

            return cell.getSubCells(cell.zoom+1);

          } else {

            return [];

          }

        } else {

          return [];

        }

      })

    )

  }

}
