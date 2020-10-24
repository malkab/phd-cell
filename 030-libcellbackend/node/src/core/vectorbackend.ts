import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Vector } from "libcell";

/**
 *
 * Vector, backend version.
 *
 */
export class VectorBackend extends Vector implements PgOrm.IPgOrm<VectorBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<VectorBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<VectorBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<VectorBackend> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      vectorId,
      name,
      title,
      description,
      pgConnectionId,
      sourceTable,
      catalogNames,
      catalogFieldNames,
      variableNames
    }: {
      vectorId: string;
      name: string;
      title: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      catalogNames: string[];
      catalogFieldNames: string[];
      variableNames: string[];
  }) {

    super({
      vectorId: vectorId,
      name: name,
      title: title,
      description: description,
      pgConnectionId: pgConnectionId,
      sourceTable: sourceTable,
      catalogNames: catalogNames,
      catalogFieldNames: catalogFieldNames,
      variableNames: variableNames
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: `
          insert into cell_meta.vector
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        params: () => [ this.vectorId, this.name, this.title,
          this.description, this.pgConnectionId, this.sourceTable,
          this.catalogNames, this.catalogFieldNames, this.variableNames ]
      }

    })

  }

  /**
   *
   * Gets a catalog from the DB.
   *
   */
  public static get$(pg: RxPg, id: string): rx.Observable<VectorBackend> {

    return PgOrm.select$<VectorBackend>({
      pg: pg,
      sql: `
        select
          vector_id as "vectorId",
          name,
          title,
          description,
          pg_connection_id as "pgConnectionId",
          source_table as "sourceTable",
          catalog_names as "catalogNames",
          catalog_field_names as "catalogFieldNames",
          variable_names as "variableNames"
        from cell_meta.vector where vector_id = $1;`,
      params: () => [ id ],
      type: VectorBackend
    })

  }

}
