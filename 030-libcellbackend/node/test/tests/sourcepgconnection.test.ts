import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { SourcePgConnection } from "../../src/index";

import { cellPgConn, cellRawData, clearDatabase$ } from "./common";

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

    assertions: [

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true

    ],

    verbose: false

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

    observables: [

      cellRawData.pgInsert$(cellPgConn)

    ],

    assertions: [

      (o: SourcePgConnection) => expect(o.name).to.be.equal("Cell Raw Data")

    ],

    verbose: false,

    active: true

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

    observables: [ SourcePgConnection.get$(cellPgConn, cellRawData.sourcePgConnectionId) ],

    assertions: [
      (o: SourcePgConnection) => expect(o.name).to.be.equal(cellRawData.name) ],

    verbose: false,

    active: true

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

    observables: [ SourcePgConnection.get$(cellPgConn, cellRawData.sourcePgConnectionId)
    .pipe(

      rxo.map((o: SourcePgConnection) => o.open()),

      rxo.concatMap((o: RxPg) => o.executeParamQuery$(
        "select postgis_full_version() as x"
      ))

    ) ],

    assertions: [

      (o: QueryResult) => expect(o.command).to.be.equal("SELECT")

    ],

    verbose: false,

    active: true

  })

})
