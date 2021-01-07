import { PgOrm } from "@malkab/rxpg"

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { Variable } from "../core/variable";

import { Catalog } from "../core/catalog";

import { processTemplate } from "../core/utils";

import { GridderTask } from "./griddertask";

import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { NodeLogger } from "@malkab/node-logger";

import { Grid } from "../core/grid";

/**
 *
 * Top Area Polygon Discrete Gridder Task.
 *
 * This Gridder Task generates only one variable with a discrete category
 * catalog value.
 *
 * This Gridder Task takes a set of discrete fields to check and group all
 * polygons in the cell sharing the same values. The area of the categories
 * present at the cell is sum and only to top one is recorded at the variable.
 *
 */
export class DiscretePolyTopAreaGridderTask extends GridderTask implements PgOrm.IPgOrm<DiscretePolyTopAreaGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTask> = (pg) => rx.of();

  /**
   *
   * Discrete fields.
   *
   */
  private _discreteFields: string[];
  get discreteFields(): string[] { return this._discreteFields }

  /**
   *
   * The name of the only variable that will be created by this Gridder Task.
   *
   */
  private _variableName: string;
  get variableName(): string { return this._variableName }

  /**
   *
   * The description of the only variable that will be created by this Gridder
   * Task.
   *
   */
  private _variableDescription: string;
  get variableDescription(): string { return this._variableDescription }

  /**
   *
   * Category template. This template in the form "{{{discreteFieldX}}}" is used
   * to create the name of each category value for the catalog.
   *
   */
  private _categoryTemplate: string;
  get categoryTemplate(): string { return this._categoryTemplate }

  /**
   *
   * Constructor.
   *
   * @param __namedParameters
   * GridderTask deconstructed parameters.
   *
   * @param discreteFields
   * Set of fields to categorize. All records in the cell that has a common set
   * of values in these discrece fields are grouped together and a category (see
   * categoryTemplate) is created from their values.
   *
   * @param variableName
   * The name of the variable to be created in this Gridder Task. Only a
   * variable is created in this task.
   *
   * @param variableDescription
   * The description of the variable to be created in this Gridder Task. Only a
   * variable is created in this task.
   *
   * @param categoryTemplate
   * The template of each discrete category to be created in this task, in the
   * form of "{{{discreteFieldsX}}}".
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
      indexVariable,
      discreteFields,
      variableName,
      variableDescription,
      categoryTemplate
    }: {
      gridderTaskId: string;
      gridId: string;
      grid?: Grid;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      indexVariable?: Variable;
      discreteFields: string[];
      variableName: string;
      variableDescription: string;
      categoryTemplate: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      gridderTaskType: EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA,
      gridderTaskTypeName: "Discrete variable on polygon based on top area",
      gridderTaskTypeDescription: "Given a vector of discrete variables, create a variable with the value of the category covering most area.",
      gridId: gridId,
      grid: grid,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      indexVariableKey: indexVariableKey,
      indexVariable: indexVariable
    });

    this._discreteFields = discreteFields;
    this._variableName = variableName;
    this._variableDescription = variableDescription;
    this._categoryTemplate = categoryTemplate;

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
            discreteFields: this.discreteFields,
            variableName: this.variableName,
            variableDescription: this.variableDescription,
            categoryTemplate: this.categoryTemplate
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

    // Flag that the category got 100% of coverage
    let fullCoverage: boolean = false;

    // A flag for void cell
    let voidCell: boolean = false;

    // To store the variable
    let variable: Variable;

    // To store the catalog
    let catalog: Catalog;

    // This is an array to get all cell-setting SQL, there can be more than one
    // in cases of full coverage
    let sqlSubcells: string[] = [];

    // To hold the key in the catalog in case there are full coverage subcells
    let key: string | undefined;

    if (log) log.logInfo({
      message: `start cell (${cell.epsg},${cell.zoom},${cell.x},${cell.y})`,
      methodName: "computeCell$",
      moduleName: "DiscretePolyTopAreaGridderTask",
      payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
    })

    // Get the dependencies
    return this.getDependencies$(cellPg)
    .pipe(

      rxo.concatMap((o: GridderTask) => {

        // Set the grid of the cell
        cell.grid = this.grid;

        return Variable.getByGridderTaskId$(cellPg, this.gridderTaskId);

      }),

      rxo.concatMap((o: Variable[]) => {

        if (o.length === 0) throw new Error("cannot retrieve variable, run GridderTask.setup$()");

        variable = o[0];
        variable.gridderTask = this;

        if (log) log.logInfo({
          message: `got variable ${variable.name} (${variable.variableKey})`,
          methodName: "computeCell$",
          moduleName: "DiscretePolyTopAreaGridderTask",
          payload: { variableName: variable.name, variableKey: variable.variableKey }
        })

        catalog = variable.getCatalog$();

        return catalog.dbLoadForwardBackward$(cellPg);

      }),

      rxo.concatMap((o: any) => {

        catalog = o;
        o.variable = variable;

        if (log) log.logInfo({
          message: `got catalog ${catalog.gridderTaskId}/${catalog.variableKey}: ${catalog.nItems} items`,
          methodName: "computeCell$",
          moduleName: "DiscretePolyTopAreaGridderTask",
          payload: {
            catalogGridderTaskId: catalog.gridderTaskId,
            catalogVariableKey: catalog.variableKey,
            items: catalog.nItems
          }
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
          sum(a)::float / st_area(st_geomfromewkt('${cell.ewkt}')) as a
          from a
          group by ${this.discreteFields.join(",")}
          order by a desc;`;

          return sourcePg.executeParamQuery$(sql);

        }),

        rxo.concatMap((o: QueryResult) => {

          // Check for results (void cell)
          if (o.rows.length > 0) {

            if (log) log.logInfo({
              message: `SQL processed, results ${o.rows.length}`,
              methodName: "computeCell$",
              moduleName: "DiscretePolyTopAreaGridderTask",
              payload: { results: o.rows.length }
            })

            // Check for full coverage
            if (o.rows[0].a === 1) fullCoverage = true;

            // Get key from the catalog
            key = catalog.backward
            .get(processTemplate(this.categoryTemplate, o.rows[0]));

            let sql: string = `select cell__setcell((
              '${cell.gridId}', ${cell.epsg}, ${cell.zoom}, ${cell.x},
              ${cell.y}, '{ "${variable.variableKey}": "${key}" }'::jsonb)::cell__cell
              );`;

            // Insert cell
            return cellPg.executeParamQuery$(sql);

          } else {

            if (log) log.logInfo({
              message: `SQL processed, void cell`,
              methodName: "computeCell$",
              moduleName: "DiscretePolyTopAreaGridderTask",
              payload: { results: o.rows.length }
            })

            // Signal void cell
            voidCell = true;
            return rx.of(undefined);

          }

        }),

        // Evaluate full coverage
        rxo.concatMap((o: any) => {

          // Check full coverage and that the process is still above the target
          // zoom
          if (fullCoverage && cell.zoom < targetZoom) {

            if (log) log.logInfo({
              message: `processing full coverage`,
              methodName: "computeCell$",
              moduleName: "DiscretePolyTopAreaGridderTask"
            })

            // Get child cells for the current cell
            let childCells: Cell[] = cell.getSubCells(cell.zoom+1);

            // Iterate though available cells
            while (childCells.length > 0) {

              const c: Cell | undefined = childCells.shift();

              if (c) {

                sqlSubcells.push(`select cell__setcell((
                  '${c.gridId}', ${c.epsg}, ${c.zoom}, ${c.x},
                  ${c.y}, '{ "${variable.variableKey}": "${key}" }'::jsonb)::cell__cell
                  );`);

                // Add more subcells
                if (c.zoom < targetZoom) {

                  childCells = childCells.concat(c.getSubCells(c.zoom+1));

                }

              }

            }

          }

          // Write all drilled down cells, if any
          if (sqlSubcells.length > 0) {

            return rx.zip(
              ...sqlSubcells.map((sql: string) => cellPg.executeParamQuery$(sql))
            );

          } else {

            return rx.of([]);

          }

      }),

      // Return the child cells, if needed, if not fullCoverage
      rxo.map((o: any) => {

        if(!fullCoverage && cell.zoom < targetZoom && !voidCell) {

          const c: Cell[] = cell.getSubCells(cell.zoom+1);

          if (log) log.logInfo({
            message: `returning ${c.length} subcells`,
            methodName: "computeCell$",
            moduleName: "DiscretePolyTopAreaGridderTask"
          })

          return c;

        } else {

          if (log) log.logInfo({
            message: `end of gridding stack`,
            methodName: "computeCell$",
            moduleName: "DiscretePolyTopAreaGridderTask"
          })

          return []

        }

      })

    )

  }

  /**
   *
   * Set ups the GridderTask for the GridderJob setup$ method. Creates all the
   * variables and catalogs.
   *
   */
  public setup$(sourcePg: RxPg, cellPg: RxPg, log?: NodeLogger):
  rx.Observable<DiscretePolyTopAreaGridderTask> {

    // This gridder creates only one variable
    const variable: Variable = new Variable({
      description: this.variableDescription,
      name: this.variableName,
      gridderTaskId: this.gridderTaskId,
      gridderTask: this
    })

    let catalog: Catalog;

    return variable.pgInsert$(cellPg)
    .pipe(

      rxo.map((o: Variable) => {

        // Set the index variable key to this only variable
        this._indexVariableKey = o.variableKey;

        // And only one catalog
        catalog = new Catalog({
          gridderTaskId: this.gridderTaskId,
          variableKey: <string>variable.variableKey,
          variable: variable
        })

      }),

      rxo.concatMap((o: any) => sourcePg.executeParamQuery$(`
        select distinct ${this.discreteFields.join(",")}
        from ${this.sourceTable}
        order by ${this.discreteFields.join(",")}`)),

      rxo.concatMap((o: QueryResult) => {

        // Get all templated categories and populate the catalog
        return catalog.dbAddEntries$(cellPg,
          o.rows.map((o: any) => processTemplate(this.categoryTemplate, o)))

      }),

      rxo.concatMap((o: any) => catalog.pgInsert$(cellPg)),

      rxo.concatMap((o:any) =>
        this.setIndexVariableKey$(cellPg, <string>this._indexVariableKey)),

      rxo.map((o: any) => this)

    )

  }

}
