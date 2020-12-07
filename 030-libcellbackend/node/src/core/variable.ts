import { PgOrm, RxPg, QueryResult } from "@malkab/rxpg"

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Variable as VariableL } from "@malkab/libcell";

import { GridderTask } from "../griddertasks/griddertask";

import { miniHash } from "@malkab/node-utils";

/**
 *
 * Variable, backend version.
 *
 */
export class Variable extends VariableL implements PgOrm.IPgOrm<Variable> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<Variable> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<Variable> = (pg) => rx.of();

  /**
   *
   * The GridderTask.
   *
   */

  /**
   *
   * Constructor.
   *
   */
  constructor({
      variableId,
      gridderTaskId,
      gridderTask = undefined,
      key = undefined,
      name,
      description
    }: {
      variableId: string;
      gridderTaskId: string;
      gridderTask?: GridderTask;
      key?: string;
      name: string;
      description: string;
  }) {

    super({
      variableId: variableId,
      gridderTaskId: gridderTaskId,
      gridderTask: gridderTask,
      key: key,
      name: name,
      description: description
    });

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
      select key from cell_meta.variable`;

    return pg.executeParamQuery$(sql)
    .pipe(

      rxo.concatMap((o: QueryResult) => {

        const existingMiniHashes: string[] = o.rows.map((o: any) => o.key);

        // Get new minihash
        this._key = miniHash({
          values: [ `${this.gridderTaskId}${this.variableId}` ],
          existingMiniHashes: existingMiniHashes
        })[0];

        const sql: string = `
          insert into cell_meta.variable values($1, $2, $3, $4, $5);`;

        return pg.executeParamQuery$(sql,
          { params: [ this.gridderTaskId, this.variableId, this.key, this.name,
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
          variable_id as "variableId",
          *
        from cell_meta.variable
        where gridder_task_id = $1`,
      params: () => [ gridderTaskId ],
      type: Variable
    })

  }

}
