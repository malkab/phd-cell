import { Catalog as CatalogL, Variable as VariableL } from "@malkab/libcell";

import { PgOrm } from "@malkab/rxpg";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { miniHash } from '@malkab/node-utils';

import { PgConnection } from "./pgconnection";

import { conformsTo } from 'lodash';

import { Variable } from "./variable";

/**
 *
 * Catalog class from libcell encapsulated into a PgORM class.
 *
 * A catalog contains the domain of discrete values for a variable.
 *
 */
export class Catalog extends CatalogL implements PgOrm.IPgOrm<Catalog> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgInsert$: (pg: RxPg) => rx.Observable<Catalog> = (pg) => rx.of(this);
  public pgDelete$: (pg: RxPg) => rx.Observable<Catalog> = (pg) => rx.of(this);
  public pgUpdate$: (pg: RxPg) => rx.Observable<Catalog> = (pg) => rx.of(this);

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      variableId,
      variable = undefined,
      forward = undefined,
      backward = undefined
    }: {
      gridderTaskId: string;
      variableId: string;
      variable?: Variable;
      forward?: any;
      backward?: any;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      variableId: variableId,
      variable: variable,
      forward: forward,
      backward: backward
    });

  }

  /**
   *
   * Load forward and backward.
   *
   */
  public dbLoadForwardBackward$(pg: RxPg): rx.Observable<Catalog> {

    const sql: string = `
      select key, value
      from cell_meta.catalog
      where
        gridder_task_id = $1 and
        variable_id = $2;`;

    return pg.executeParamQuery$(sql,
      { params: [ this.gridderTaskId, this.variableId ] })
    .pipe(

      rxo.map((o: QueryResult) => {

        o.rows.map((o: any) => {

          this._forward.set(o.key, o.value);
          this._backward.set(o.value, o.key);

        })

        return this;

      })

    )

  }

  /**
   *
   * Add an entry to the catalog.
   *
   */
  public dbAddEntries$(pg: RxPg, entries: string[]): rx.Observable<Catalog> {

    // Add hashes to the set
    const newMiniHashes: string[] = miniHash({
      values: entries,
      existingMiniHashes: Array.from(this.forward.keys())
    });

    // SQL to insert at DB
    let sql: string = "";

    // Add new mini hashes to catalogs and compose SQL to set them at the DB
    for(let i = 0; i < newMiniHashes.length; i++) {

      this.forward.set(newMiniHashes[i], entries[i]);
      this.backward.set(entries[i], newMiniHashes[i]);

      sql = `${sql}
        insert into cell_meta.catalog values(
          '${this.gridderTaskId}',
          '${this._variableId}',
          '${newMiniHashes[i]}',
          '${entries[i]}');`;

    }

    // Write to the DB
    return pg.executeParamQuery$(sql)
    .pipe( rxo.map((o: QueryResult) => this) )

  }

  /**
   *
   * Gets a catalog from the DB and loads its forward and backward.
   *
   */
  public static get$(pg: RxPg, gridderTaskId: string, variableId: string): rx.Observable<Catalog> {

    return new Catalog({
      gridderTaskId: gridderTaskId,
      variableId: variableId
    }).dbLoadForwardBackward$(pg);

  }

}
