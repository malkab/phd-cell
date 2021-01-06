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

import { uniq } from "lodash";

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
      gridId,
      grid = undefined,
      name,
      description,
      sourceTable,
      geomField,
      indexVariableKey,
      variables
    }: {
      gridderTaskId: string;
      gridId: string;
      grid?: Grid;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      variables: IPointAggregationsGridderTaskVariable[];
  }) {

    super({
      gridderTaskId: gridderTaskId,
      gridderTaskType: EGRIDDERTASKTYPE.POINTAGGREGATIONS,
      gridderTaskTypeName: "Discrete variable on polygon area summary",
      gridderTaskTypeDescription: "Given a vector of discrete variables, create as many variables as categories present in the cell presenting the area covered by this category in the cell.",
      gridId: gridId,
      grid: grid,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      indexVariableKey: indexVariableKey
    });

    this._variables = variables;

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: () => `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        params$: () => rx.of([
          this.gridderTaskId,
          this.gridderTaskType,
          this.gridId,
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
      rxo.concatMap((o: Variable) => this.setIndexVariableKey(cellPg)),

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

    // Start of the SQL, taking into account the collision of the cell's geom.
    let sql: string = `
      with a as (
        select
          *
        from
          ${this.sourceTable}
        where st_intersects(geom, st_geomfromewkt('${cell.ewkt}'))
      )
      select
        jsonb_build_object(
    `;

    // Get the variables for this GridderTask in the same order they are coded
    // in the variables member
    return rx.zip(

      ...this.variables.map((o: IPointAggregationsGridderTaskVariable) => {

        return Variable.getByGridderTaskIdAndName$(cellPg, this.gridderTaskId,
          o.name)

      })

    )
    .pipe(

      // Compose the final SQL adding the variable names and expressions
      rxo.concatMap((o: Variable[]) => {

        variables = o;

        for(let i=0; i<this.variables.length; i++) {

          sql += `'${variables[i].variableKey}', ${this.variables[i].expression},`;

        }

        sql = sql.replace(/,+$/, "");
        sql += `) as data from a;`;

        return sourcePg.executeParamQuery$(sql);

      }),

      // Check results. If there are any data, update cell's data and update.
      rxo.concatMap((o: QueryResult) => {

        // Check for empty results
        if (uniq(Object.values(o.rows[0].data))[0]) {

          cell.data = o.rows[0].data;

          return cell.pgUpdate$(cellPg);

        } else {

          return rx.of(cell);

        }

      }),

      // If there are data, check for sub cells to continue computations.
      rxo.map((o: Cell) => {

        if (Object.keys(o.data).length > 0) {

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
