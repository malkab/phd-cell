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
      gridId,
      grid = undefined,
      name,
      description,
      sourceTable,
      geomField,
      discreteFields,
      variableNameTemplate,
      variableDescriptionTemplate,
      areaRound = 2
    }: {
      gridderTaskId: string;
      gridId: string;
      grid?: Grid;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
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
      gridId: gridId,
      grid: grid,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField
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
          this.gridId,
          this.name,
          this.description,
          this.sourceTable,
          this.geomField,
          {
            discreteFields: this.discreteFields,
            variableNameTemplate: this.variableNameTemplate,
            variableDescriptionTemplate: this.variableDescriptionTemplate
          }
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

      // Build variables from discrete items
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

    // Set the grid of the cell
    cell.grid = this.grid;

    if (log) log.logInfo({
      message: `start cell (${cell.epsg},${cell.zoom},${cell.x},${cell.y})`,
      methodName: "computeCell$",
      moduleName: "DiscretePolyAreaSummaryGridderTask",
      payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
    })

    // Analysis SQL: returns the percentage of the area of the cell covered
    // by each category
    const sql: string = `
      with a as (
        select
          ${this.discreteFields.join(",")},
          ${this.geomField} as geom,
          st_intersection(${this.geomField}, st_geomfromewkt('${cell.ewkt}')) as geom_inter,
          st_area(st_intersection(${this.geomField}, st_geomfromewkt('${cell.ewkt}'))) as a
        from ${this.sourceTable}
        where st_intersects(${this.geomField}, st_geomfromewkt('${cell.ewkt}'))
      )
      select
        ${this.discreteFields.join(",")},
        round((sum(a)::float / st_area(st_geomfromewkt('${cell.ewkt}')))::numeric, ${this.areaRound}) as a
      from a
      group by ${this.discreteFields.join(",")}
      order by a desc;`;

    // Find overlapping polygons
    return sourcePg.executeParamQuery$(sql)
    .pipe(

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

        return rx.zip(...o.rows.map((x: any) => {

          return Variable.getByGridderTaskIdAndName$(
            cellPg, this.gridderTaskId,
            processTemplate(this.variableNameTemplate, x));

        }))

      }),

      // Compose cell data member and update the cell
      rxo.concatMap((o: any) => {

        if (log) log.logInfo({
          message: `got ${o.length} variables`,
          methodName: "computeCell$",
          moduleName: "DiscretePolyAreaSummaryGridderTask",
          payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
        })

        const data: any = {};
        variables = <Variable[]>o;

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
      rxo.catchError((e: Error) => rx.of([])),

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
