import { PgOrm } from "@malkab/rxpg"

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { Variable } from "../core/variable";

import { processTemplate } from "../core/utils";

import { GridderTask } from "./griddertask";

import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { NodeLogger } from "@malkab/node-logger";

import { Grid } from "../core/grid";

/**
 *
 * Area Summary Polygon Discrete Gridder Task.
 *
 * This Gridder Task generates as many variables as discrete values in the
 * discrete fields. It doesn't generate catalog entries.
 *
 * This Gridder Task takes a set of discrete fields to check and group all
 * polygons in the cell sharing the same values. The area of the categories
 * present at the cell is sum and all present values are stored in their
 * matching variable in an expresion of the 1% coverage of the cell.
 *
 * This Gridder Task drills down on the event of a single category dominating
 * the whole cell.
 *
 * The index var stores the following cell stats:
 * - area: total area covered by all classes in the cell.
 *
 */
export class DiscretePolyAreaSummaryGridderTask extends GridderTask implements PgOrm.IPgOrm<DiscretePolyAreaSummaryGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTask> = (pg) => rx.of();

  /**
   *
   * Discrete fields.
   *
   */
  private _discreteFields: string[];
  get discreteFields(): string[] { return this._discreteFields }

  /**
   *
   * The template name of the variables to be created.
   *
   */
  private _variableNameTemplate: string;
  get variableNameTemplate(): string { return this._variableNameTemplate }

  /**
   *
   * The template description of the variables to be created.
   *
   */
  private _variableDescriptionTemplate: string;
  get variableDescriptionTemplate(): string { return this._variableDescriptionTemplate }

  /**
   *
   * The template name of the variables to be created.
   *
   */
  private _areaRound: number;
  get areaRound(): number { return this._areaRound }

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
      discreteFields,
      variableNameTemplate,
      variableDescriptionTemplate,
      areaRound = 2
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      indexVariable?: Variable;
      discreteFields: string[];
      variableNameTemplate: string;
      variableDescriptionTemplate: string;
      areaRound?: number;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      gridderTaskType: EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY,
      gridderTaskTypeName: "Discrete variable on polygon area summary",
      gridderTaskTypeDescription: "Given a vector of discrete variables, create as many variables as categories present in the cell presenting the area covered by this category in the cell.",
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      indexVariableKey: indexVariableKey,
      indexVariable: indexVariable
    });

    this._variableNameTemplate = variableNameTemplate;
    this._variableDescriptionTemplate = variableDescriptionTemplate;
    this._discreteFields = discreteFields;
    this._areaRound = areaRound;

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
            discreteFields: this.discreteFields,
            variableNameTemplate: this.variableNameTemplate,
            variableDescriptionTemplate: this.variableDescriptionTemplate
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

    // This gridder creates as many variables as discrete items
    return sourcePg.executeParamQuery$(`
      select distinct ${this.discreteFields.join(",")}
      from ${this.sourceTable}
      order by ${this.discreteFields.join(",")}`
    ).pipe(

      // Build variables from discrete items and the index variable
      rxo.concatMap((o: any) => {

        variables = o.rows.map((x: any) => {

          return new Variable({
            gridderTaskId: this.gridderTaskId,
            name: processTemplate(this.variableNameTemplate, x),
            description: processTemplate(this.variableDescriptionTemplate, x),
            gridderTask: this
          })

        })

        return rx.of(variables);

      }),

      // Write the variables, in order so the keys don't collide
      rxo.concatMap((o: any) => {

        return rx.concat(...variables.map((x: Variable) => x.pgInsert$(cellPg)));

      }),

      rxo.last(),

      // Set the index variable
      rxo.concatMap((o: Variable) => this.setIndexVariableKey$(cellPg)),

      rxo.map((o: any) => this)

    )

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

    // To store areas of overlapping polygons
    let areas: any;

    // To store the retrieved variables
    let variables: Variable[];

    // Full coverage flag
    let fullCoverage = false;

    if (log) log.logInfo({
      message: `start cell (${cell.epsg},${cell.zoom},${cell.x},${cell.y})`,
      methodName: "computeCell$",
      moduleName: "DiscretePolyAreaSummaryGridderTask",
      payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
    })

    // Analysis SQL: returns the percentage of the area of the cell covered
    // by each category
    const sql: string = `
      with geom_cell as (
        select st_geomfromewkt('${cell.ewkt}') as geom_cell
      ),
      geom_cell_area as (
        select st_area(geom_cell)::numeric as geom_cell_area from geom_cell
      ),
      a as (
        select
          ${this.discreteFields.join(",")},
          st_intersection(${this.geomField}, geom_cell) as geom_inter
        from ${this.sourceTable}, geom_cell
        where st_intersects(${this.geomField}, geom_cell)
      ),
      complete as (
        select st_union(geom_inter) as complete_geom
        from a
      )
      select
        ${this.discreteFields.join(",")},
        round((sum(st_area(geom_inter))::numeric / geom_cell_area)::numeric, ${this.areaRound}) as a,
        round((st_area(complete_geom)::numeric / geom_cell_area)::numeric, ${this.areaRound}) as complete
      from a, complete, geom_cell, geom_cell_area
      group by ${this.discreteFields.join(",")}, geom_cell, complete, geom_cell_area
      order by a desc;`;

    // Get the dependencies
    return this.getDependencies$(cellPg)
    .pipe(

      // Get cell grid
      rxo.concatMap((o: GridderTask) => cell.getGrid$(cellPg)),

      // Find overlapping polygons
      rxo.concatMap((o: any) => sourcePg.executeParamQuery$(sql)),

      rxo.catchError((e: Error) => {

        if (log) log.logError({
          message: `error processing geometries: ${e.message}`,
          methodName: "computeCell$",
          moduleName: "DiscretePolyAreaSummaryGridderTask",
          payload: {
            error: e.message,
            cell: cell.apiSafeSerial,
            targetZoom: targetZoom
          }
        })

        throw new Error("geometry processing error");

      }),

      // Get variables matching the discrete terms for each overlapping polygon
      rxo.concatMap((o: QueryResult) => {

        if (log) log.logInfo({
          message: `got ${o.rowCount} colliding polygons`,
          methodName: "computeCell$",
          moduleName: "DiscretePolyAreaSummaryGridderTask",
          payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
        })

        // Keep these results
        areas = o.rows;

        // Get variables
        const vars: rx.Observable<Variable>[] = o.rows.map((x: any) => {
          return Variable.getByGridderTaskIdAndName$(
            cellPg, this.gridderTaskId,
            processTemplate(this.variableNameTemplate, x));
        })

        // If there are results, add the index variable to the variables to be
        // retrieved
        if (o.rowCount>0)
          vars.push(Variable.getByKey$(cellPg, <string>this._indexVariableKey));

        // Get variables
        return rx.zip(...vars);

      }),

      // Compose cell data member and update the cell
      rxo.concatMap((o: Variable[]) => {

        // Get the index var, this modifies the list of variables
        const indexVar: Variable = <Variable>o.pop();

        if (log) log.logInfo({
          message: `got ${o.length} variables`,
          methodName: "computeCell$",
          moduleName: "DiscretePolyAreaSummaryGridderTask",
          payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
        })

        const data: any = {};
        variables = <Variable[]>o;

        // Add the index variable if there area any data
        if (o.length > 0)
          data[<string>indexVar.variableKey] = { area: +areas[0].complete };

        // Add area value for each variable
        for(let i=0; i<areas.length; i++)
          data[<string>variables[i].variableKey] = +areas[i].a;

        cell.data = data;
        return cell.pgUpdate$(cellPg);

      }),

      // Check for complete coverage
      rxo.concatMap((o: any) => {

        // Check there are values
        if (areas.length === 1) {

          // Check for single value and 1.0 area coverage
          if (+areas[0].a === 1.0) {

            // Set full coverage flag
            fullCoverage = true;

            if (log) log.logInfo({
              message: `processing full coverage`,
              methodName: "computeCell$",
              moduleName: "DiscretePolyAreaSummaryGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            return cell.drillDownClone$(cellPg, targetZoom);

          } else {

            return rx.of(cell);

          }

        } else {

          return rx.of(cell);

        }

      }),

      // drillDownClone$ produces a lot of outputs, get only the last
      rxo.last(),

      // For 0 covering polygons there is no last, so an error is detected
      rxo.catchError((e: Error) => {

        // Intercept here again the geometru processing error from the
        // beginning
        if (e.message === "geometry processing error") {

          throw new Error("geometry processing error");

        } else {

          return rx.of([]);

        }

      }),

      rxo.map(() => {

        if (fullCoverage || areas.length === 0) {

          if (log) log.logInfo({
            message: `end of gridding stack`,
            methodName: "computeCell$",
            moduleName: "DiscretePolyAreaSummaryGridderTask",
            payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
          })

          return [];

        } else {

          if (cell.zoom < targetZoom ) {

            const sc: Cell[] = cell.getSubCells(cell.zoom + 1);

            if (log) log.logInfo({
              message: `returning ${sc.length} subcells`,
              methodName: "computeCell$",
              moduleName: "DiscretePolyAreaSummaryGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            return sc;

          } else {

            if (log) log.logInfo({
              message: `end of gridding stack`,
              methodName: "computeCell$",
              moduleName: "DiscretePolyAreaSummaryGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            return [];

          }

        }

      })

    )

  }

}
