import { GridderTasks as GT } from "@malkab/libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { Variable } from "../core/variable";

import { Catalog } from "../core/catalog";

import { processTemplate } from "../core/utils";

import { genUid } from "@malkab/node-utils";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyTopAreaGridderTask extends GT.DiscretePolyTopAreaGridderTask implements PgOrm.IPgOrm<DiscretePolyTopAreaGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTask> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      sourceTable,
      geomField,
      discreteFields,
      variableName,
      variableDescription,
      categoryTemplate
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      discreteFields: string[];
      variableName: string;
      variableDescription: string;
      categoryTemplate: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      name: name,
      description: description,
      sourceTable: sourceTable,
      discreteFields: discreteFields,
      geomField: geomField,
      variableName: variableName,
      variableDescription: variableDescription,
      categoryTemplate: categoryTemplate
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: () => `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7);`,
        params$: () => rx.of([
          this.gridderTaskId,
          this.gridderTaskType,
          this.name,
          this.description,
          this.sourceTable,
          this.geomField,
          {
            discreteFields: this.discreteFields,
            variableName: this.variableName,
            variableDescription: this.variableDescription,
            categoryTemplate: this.categoryTemplate
          }
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
  public computeCell$(sourcePg: RxPg, cellPg: RxPg, cell: Cell, targetZoom: number):
  rx.Observable<Cell[]> {

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

    // Get the variable and the catalog from the DB
    return Variable.getByGridderTaskId$(cellPg, this.gridderTaskId)
    .pipe(

      rxo.concatMap((o: Variable[]) => {

        variable = o[0];
        variable.gridderTask = this;

        return Catalog.get$(cellPg, this.gridderTaskId, variable.variableId);

      }),

      rxo.concatMap((o: any) => {

        catalog = o;
        o.variable = variable;

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

            // Check for full coverage
            if (o.rows[0].a === 1) fullCoverage = true;

            // Get key from the catalog
            key = catalog.backward
            .get(processTemplate(this.categoryTemplate, o.rows[0]));

            let sql: string = `select cell__setcell((
              '${cell.gridId}', ${cell.epsg}, ${cell.zoom}, ${cell.x},
              ${cell.y}, '{ "${variable.key}": "${key}" }'::jsonb)::cell__cell
              );`;

            // Insert cell
            return cellPg.executeParamQuery$(sql);

          } else {

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

            // Get child cells for the current cell
            let childCells: Cell[] = cell.getSubCells(cell.zoom+1);

            // Iterate though available cells
            while (childCells.length > 0) {

              const c: Cell | undefined = childCells.shift();

              if (c) {

                sqlSubcells.push(`select cell__setcell((
                  '${c.gridId}', ${c.epsg}, ${c.zoom}, ${c.x},
                  ${c.y}, '{ "${variable.key}": "${key}" }'::jsonb)::cell__cell
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

          return cell.getSubCells(cell.zoom+1);

        } else {

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
  public setup$(sourcePg: RxPg, cellPg: RxPg): rx.Observable<any> {

    // This gridder creates only one variable
    const variable: Variable = new Variable({
      description: this.variableDescription,
      name: this.variableName,
      variableId: genUid(),
      gridderTaskId: this.gridderTaskId,
      gridderTask: this
    })

    // And only one catalog
    const catalog: Catalog = new Catalog({
      gridderTaskId: this.gridderTaskId,
      variableId: variable.variableId,
      variable: variable
    })

    return variable.pgInsert$(cellPg)
    .pipe(

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

      rxo.map((o: any) => this)

    )

  }

}
