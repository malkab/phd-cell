import { PgOrm } from "@malkab/rxpg";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { miniHash } from '@malkab/node-utils';

import { Variable } from "./variable";

/**
 *
 * Catalog class from libcell encapsulated into a PgORM class.
 *
 * A catalog contains the domain of discrete values for a variable.
 *
 */
export class Catalog implements PgOrm.IPgOrm<Catalog> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgInsert$: (pg: RxPg) => rx.Observable<Catalog> = (pg) => rx.of(this);
  public pgDelete$: (pg: RxPg) => rx.Observable<Catalog> = (pg) => rx.of(this);
  public pgUpdate$: (pg: RxPg) => rx.Observable<Catalog> = (pg) => rx.of(this);

  /**
   *
   * GridderTaskId ID this catalog belongs to.
   *
   */
  private _gridderTaskId: string;
  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * Variable ID this catalog belongs to.
   *
   */
  private _variableKey: string;
  get variableKey(): string { return this._variableKey }

  /**
   *
   * Variable this catalog belongs to, if available.
   *
   */
  private _variable: Variable | undefined;
  get variable(): Variable | undefined { return this._variable }
  set variable(variable: Variable | undefined) { this._variable = variable }

  /**
   *
   * Forward: the key > value mapping for the catalog.
   *
   */
  private _forward: Map<string, string>;
  get forward(): Map<string, string> { return this._forward }

  /**
   *
   * Backward: the value > key mapping for the catalog.
   *
   */
  private _backward: Map<string, string>;
  get backward(): Map<string, string> { return this._backward }

  /**
   *
   * Returns number of items in catalog.
   *
   */
  get nItems(): number {

    const forwardN: number = Array.from(this._forward.keys()).length;
    const backwardN: number = Array.from(this._backward.keys()).length;

    if (forwardN !== backwardN) throw new Error("catalog error: forward and backward entries does not match");

    return forwardN;

  }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      variableKey,
      variable = undefined,
      forward = new Map<string, string>(),
      backward = new Map<string, string>()
    }: {
      gridderTaskId: string;
      variableKey: string;
      variable?: Variable;
      forward?: Map<string, string>;
      backward?: Map<string, string>;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._variableKey = variableKey;
    this._variable = variable;
    this._forward = forward;
    this._backward = backward;

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
        variable_key = $2;`;

    return pg.executeParamQuery$(sql,
      { params: [ this.gridderTaskId, this.variableKey ] })
    .pipe(

      rxo.map((o: QueryResult) => {

        o.rows.map((x: any) => {

          this._forward.set(x.key, x.value);
          this._backward.set(x.value, x.key);

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

    // An array to gather insert values into the catalog
    const obs: rx.Observable<any>[] = [];

    // Add new mini hashes to catalogs and compose SQL to set them at the DB
    for(let i = 0; i < newMiniHashes.length; i++) {

      obs.push(pg.executeParamQuery$(`
        insert into cell_meta.catalog values(
          '${this.gridderTaskId}',
          '${this._variableKey}',
          '${newMiniHashes[i]}',
          '${entries[i]}');`))

    }

    // Write to the DB
    return rx.zip(...obs)
    .pipe(

      rxo.catchError((e: Error) => { return rx.of(e.message); }),

      rxo.map((o: any) => this)

    )

  }

}
