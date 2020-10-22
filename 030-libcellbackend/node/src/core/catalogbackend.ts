import { Catalog } from "libcell";

import { PgOrm } from "@malkab/rxpg";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { NodeUtilsHashing } from '@malkab/node-utils';

/**
 *
 * Catalog class from libcell encapsulated into a PgORM class.
 *
 */
export class CatalogBackend extends Catalog implements PgOrm.IPgOrm<CatalogBackend> {

  // Dummy PgOrm
  public pgDelete$: (pg: RxPg) => rx.Observable<CatalogBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<CatalogBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<CatalogBackend> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      id,
      forward,
      backward
    }: {
      id: string;
      forward?: any;
      backward?: any;
  }) {

    super(id, forward, backward);

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {

        sql: `
          insert into cell_meta.catalog
          values ($1, $2, $3)`,
        params: () => [ this.id, this.forward, this.backward ]

      },

      pgUpdate$: {

        sql: `
          update cell_meta.catalog
          set forward = $1, backward = $2
          where id = $3`,
        params: () => [ this.forward, this.backward, this.id ]

      }

    })

  }

  /**
   *
   * Builds the catalog from a set of items
   *
   */
  public build(pg: RxPg, sql: string): rx.Observable<CatalogBackend> {

    // Get the elements to hash
    return pg.executeQuery$(`
      select distinct coalesce(item::varchar, 'null') as item
      from (${sql}) a
      order by item;
    `)
    .pipe(

      rxo.map((o: QueryResult): CatalogBackend => {

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
      sql: `select * from cell_meta.catalog where id=$1`,
      params: () => [ id ],
      type: CatalogBackend
    })

  }

}
