import { PgOrm, RxPg, QueryResult } from "@malkab/rxpg"

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Variable } from "libcell";

import { GridderTask } from 'libcell/dist/griddertasks';

import { NodeUtilsHashing } from "@malkab/node-utils";

/**
 *
 * Variable, backend version.
 *
 */
export class VariableBackend extends Variable implements PgOrm.IPgOrm<VariableBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<VariableBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<VariableBackend> = (pg) => rx.of();

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
   */
  public pgInsert$(pg: RxPg): rx.Observable<VariableBackend> {

    // Get existing minihashes to generate a new minihash from the VariableId
    const sql: string = `
      select key from cell_meta.variable`;

    return pg.executeQuery$(sql)
    .pipe(

      rxo.concatMap((o: QueryResult) => {

        const existingMiniHashes: string[] = o.rows.map((o: any) => o.key);

        // Get new minihash
        this._key = NodeUtilsHashing.miniHash({
          values: [ `${this.gridderTaskId}${this.variableId}` ],
          existingMiniHashes: existingMiniHashes
        })[0];

        const sql: string = `
          insert into cell_meta.variable values($1, $2, $3, $4, $5);`;

        return pg.executeParamQuery$(sql,
          [ this.gridderTaskId, this.variableId, this.key, this.name,
            this.description ]);

      }),

      rxo.map((o: QueryResult) => this)

    )

  }

  /**
   *
   * Sets a variable, that is, pgInsert$ with a new hash as key for the data
   * vector if it doesn't exists, nothing if exists.
   *
   */
  public dbSet$(pg: RxPg): rx.Observable<VariableBackend> {

    const sql: string = `
      select * from cell_meta.variable
      where gridder_task_id = $1 and variable_id = $2;`;

    return pg.executeParamQuery$(sql, [ this.gridderTaskId, this.variableId ])
    .pipe(

      rxo.concatMap((o: QueryResult) => {

        if (o.rowCount === 0) {

          return this.pgInsert$(pg);

        } else {

          this._key = o.rows[0].key;
          return rx.of(this);

        }

      })

    )

  }

}
