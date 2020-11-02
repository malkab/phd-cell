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

    observable: clearDatabase$,

    assertions: [ (o: boolean) => expect(o).to.be.true ]

  })

})

/**
 *
 * Test PgConnection.
 *
 */
describe("PgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "ORM pgInsert$",

    observable: cellRawData.pgInsert$(cellPgConn),

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false

  })

  /**
   *
   * Connection DB get.
   *
   */
  rxMochaTests({

    testCaseName: "ORM get$",

    observable: PgConnection.get$(cellPgConn, cellRawData.pgConnectionId),

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal(cellRawData.name) ],

    verbose: false

  })

  /**
   *
   * Connection DB open().
   *
   */
  rxMochaTests({

    testCaseName: "open()",

    observable: PgConnection.get$(cellPgConn, cellRawData.pgConnectionId)
    .pipe(

      rxo.map((o: PgConnection) => o.open()),

      rxo.concatMap((o: RxPg) => o.executeQuery$(
        "select postgis_full_version() as x"
      ))

    ),

    assertions: [

      (o: QueryResult) => expect(o.command).to.be.equal("SELECT")

    ],

    verbose: false

  })

})
