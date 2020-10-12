// Proper testing must be done with Mocha

console.log(`

---------------------------

Quick Test

---------------------------

`);

import { CatalogBackend } from "../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

const cellPg: RxPg = new RxPg({
  applicationName: "libcellbackend_quick_test",
  db: "cell",
  host: "localhost",
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: "postgres",
  port: 5600,
  user: "postgres"
});

const cellRawDataPg: RxPg = new RxPg({
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: "localhost",
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: "postgres",
  port: 5432,
  user: "postgres"
});

const c: CatalogBackend = new CatalogBackend({ id: "sc_codigo" });

c.pgInsert$(cellPg)
// CatalogBackend.dbGetCatalogBackend(cellPg, "c")
.pipe(

  rxo.concatMap((o: QueryResult): rx.Observable<CatalogBackend> => {

    console.log("D: nn333", o);

    return c.build(cellRawDataPg, "select sc_codigo as item from poblacion.poblacion");

  }),

  rxo.concatMap((o: CatalogBackend): rx.Observable<CatalogBackend> => {

    console.log("D: jee", o);

    return c.pgUpdate$(cellPg);

  }),

)
.subscribe(

  (o: any) => console.log("D: next", o),

  (e: Error) => console.log("D: error", e),

  () => console.log("D: completed")

)
