import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Variable } from "libcell";

/**
 *
 * Variable, backend version.
 *
 */
export class VariableBackend extends Variable implements PgOrm.IPgOrm<VariableBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<VariableBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<VariableBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<VariableBackend> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      variableId,
      name,
      title,
      description,
      pgConnectionId,
      sourceTable,
      sourceField
    }: {
      variableId: string;
      name: string;
      title: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      sourceField: string;
  }) {

    super({
      description: description,
      name: name,
      title: title,
      variableId: variableId,
      pgConnectionId: pgConnectionId,
      sourceTable: sourceTable,
      sourceField: sourceField
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: `
          insert into cell_meta.variable
          values ($1, $2, $3, $4, $5, $6, $7);`,
        params: () => [ this.variableId, this.name, this.title,
          this.description, this.pgConnectionId, this.sourceTable,
          this.sourceField ]
      }

    })

  }

  /**
   *
   * Gets a catalog from the DB.
   *
   */
  public static get$(pg: RxPg, id: string): rx.Observable<VariableBackend> {

    return PgOrm.select$<VariableBackend>({
      pg: pg,
      sql: `
        select
          variable_id as "variableId",
          name,
          title,
          description,
          pg_connection_id as "pgConnectionId",
          source_table as "sourceTable",
          source_field as "sourceField"
        from cell_meta.variable where variable_id=$1;`,
      params: () => [ id ],
      type: VariableBackend
    })

  }

}
