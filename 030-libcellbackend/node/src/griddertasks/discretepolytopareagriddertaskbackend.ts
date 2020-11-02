import { GridderTasks as GT } from "libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { CellBackend } from "../core/cellbackend";

import { VariableBackend } from "../core/variablebackend";

import { IComputeCellResults } from './icomputecellresults';

import { CatalogBackend } from "../core/catalogbackend";

import { processTemplate } from "../core/utils";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyTopAreaGridderTaskBackend extends GT.DiscretePolyTopAreaGridderTask  implements PgOrm.IPgOrm<DiscretePolyTopAreaGridderTaskBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTaskBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTaskBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTaskBackend> = (pg) => rx.of();

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
        sql: `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7);`,
        params: () => [
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
        ]
      }

    })

  }

  /**
   *
   * Apply the gridder task to a cell.
   *
   */
  public computeCell$(sourcePg: RxPg, cellPg: RxPg, cell: CellBackend):
  rx.Observable<any> {

    // Create the new variable
    const variable: VariableBackend = new VariableBackend({
      description: this.variableDescription,
      gridderTaskId: this.gridderTaskId,
      name: this.variableName,
      variableId: this.gridderTaskId,
      gridderTask: this
    })

    // To store the analysis result row
    let resultRow: any;

    // To store the templated category value
    let category: string;

    // Set into the DB
    return variable.dbSet$(cellPg)
    .pipe(

      rxo.concatMap((o: any) => {

        // Analysis SQL
        let sql: string = `
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
            sum(a)::float as a
          from a
          group by ${this.discreteFields.join(",")}
          order by a desc
          limit 1;`;

        return sourcePg.executeQuery$(sql)
        .pipe(

          // Get the new entry at the catalog
          rxo.concatMap((o: QueryResult) => {

            resultRow = o.rows[0];

            // const catalog: CatalogBackend = new CatalogBackend({
            //   gridderTaskId: this.gridderTaskId,
            //   variableId: variable.variableId
            // });

            return CatalogBackend.get$(cellPg, this.gridderTaskId, variable.variableId);

          }),

          rxo.concatMap((o: CatalogBackend) => {

            category = processTemplate(this.categoryTemplate, resultRow);

            return o.dbAddEntries$(cellPg, [ category ])

          }),

          rxo.concatMap((o: CatalogBackend) => {

            const sql: string = `select cell__setcell((
              '${cell.gridId}', ${cell.epsg}, ${cell.zoom}, ${cell.x},
              ${cell.y}, '{ "${variable.key}": "${o.backward.get(category)}" }'::jsonb)::cell__cell
            )`;

            // Insert cell
            return cellPg.executeQuery$(sql);

          })

        )

      })

    )

  }

}
