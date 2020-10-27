import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { Cell } from "libcell";

/**
 *
 * Variable, backend version.
 *
 */
export class CellBackend extends Cell implements PgOrm.IPgOrm<CellBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<CellBackend> = (pg) => rx.of();

//   /**
//    *
//    * Constructor.
//    *
//    */
//   constructor({
//       gridId,
//       zoom,
//       x,
//       y,
//       data = {},
//       offset = 0
//     }: {
//       grid: Grid,
//       zoom: number,
//       x: number,
//       y: number,
//       data?: any,
//       offset?: number
// }) {

// }

}
