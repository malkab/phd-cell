import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { PgConnection } from "../../src/index";

import { cellPgConn, cellRawData, cellPg, cellRawDataConn, clearDatabase$ } from "./common";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rxo from "rxjs/operators";

/**
 *
 * Initial database clearance.
 *
 */
describe("Initial database clearance", function() {

  rxMochaTests({

    testCaseName: "Initial database clearance",

    observables: [ clearDatabase$ ],

    assertions: [ (o: boolean) => expect(o).to.be.true ]

  })

})

/**
 *
 * pgInsert$.
 *
 */
describe("pgInsert$", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "pgInsert$",

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false

  })

})

/**
 *
 * Connection DB get$.
 *
 */
describe("get$", function() {

  rxMochaTests({

    testCaseName: "get$",

    observables: [ PgConnection.get$(cellPgConn, cellRawData.pgConnectionId) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal(cellRawData.name) ],

    verbose: false

  })

})

/**
 *
 * Connection DB open().
 *
 */
describe("open()", function() {

  rxMochaTests({

    testCaseName: "open()",

    observables: [ PgConnection.get$(cellPgConn, cellRawData.pgConnectionId)
    .pipe(

      rxo.map((o: PgConnection) => o.open()),

      rxo.concatMap((o: RxPg) => o.executeQuery$(
        "select postgis_full_version() as x"
      ))

    ) ],

    assertions: [

      (o: QueryResult) => expect(o.command).to.be.equal("SELECT")

    ],

    verbose: true

  })

})
