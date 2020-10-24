import { Catalog } from "libcell";

import { PgOrm } from "@malkab/rxpg";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { NodeUtilsHashing } from '@malkab/node-utils';

import { PgConnection } from "./pgconnection";

/**
 *
 * Catalog class from libcell encapsulated into a PgORM class.
 *
 */
export class CatalogBackend extends Catalog implements PgOrm.IPgOrm<CatalogBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<CatalogBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<CatalogBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<CatalogBackend> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      catalogId,
      name,
      title,
      description,
      pgConnectionId,
      sourceTable,
      sourceField,
      forward,
      backward
    }: {
      catalogId: string;
      name: string;
      title: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      sourceField: string;
      forward?: any;
      backward?: any;
  }) {

    super({
      catalogId: catalogId,
      name: name,
      title: title,
      description: description,
      forward: forward,
      backward: backward,
      pgConnectionId: pgConnectionId,
      sourceField: sourceField,
      sourceTable: sourceTable
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: `
          insert into cell_meta.catalog
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        params: () => [ this.catalogId, this.name, this.title, this.description,
          this.pgConnectionId, this.sourceTable, this.sourceField,
          this.forward, this.backward ]
      },

      pgUpdate$: {
        sql: `
          update cell_meta.catalog
          set
            name = $1,
            title = $2,
            description = $3,
            pg_connection_id = $4,
            source_table = $5,
            source_field = $6,
            forward = $7,
            backward = $8
          where catalog_id = $9`,
        params: () => [ this.name, this.title, this.description,
          this.pgConnectionId, this.sourceTable, this.sourceField,
          this.forward, this.backward, this.catalogId ]
      }

    })

  }

  /**
   *
   * Builds the catalog from a set of items
   *
   */
  public build(pg: PgConnection): rx.Observable<CatalogBackend | undefined> {

    // Get the elements to hash
    return pg.open()
    .pipe(

      rxo.concatMap((o: PgConnection) => {

        if (o.conn) {

          return o.conn.executeQuery$(`
            select distinct coalesce(${this.sourceField}::varchar, 'null') as item
            from ${this.sourceTable}
            order by item;`);

        } else {

          return rx.throwError(new Error(`unable to connect to ${o.db}`))

        }

      }),

      rxo.map((o: QueryResult | undefined): CatalogBackend | undefined=> {

        const items: string[] = o.rows.map((o: any) => o.item);

        const miniHashes: string[] = NodeUtilsHashing.miniHash(items);

        for (const i in items) {

          this.forward[items[i]] = miniHashes[i];

          this.backward[miniHashes[i]] = items[i];

        }

        return this;

      })

    )

  }

  /**
   *
   * Gets a catalog from the DB.
   *
   */
  public static get$(pg: RxPg, id: string): rx.Observable<CatalogBackend> {

    return PgOrm.select$<CatalogBackend>({
      pg: pg,
      sql: `
        select
          catalog_id as "catalogId",
          name,
          title,
          description,
          forward,
          backward
        from cell_meta.catalog where catalog_id=$1`,
      params: () => [ id ],
      type: CatalogBackend
    })

  }

}
