import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { PgConnection, GridderTasks as gt } from "../../src/index";

import { cellPgConn, cellRawData, clearDatabase$, municipioDiscretePolyTopAreaGridderTask, municipioDiscretePolyAreaSummaryGridderTask } from "./common";

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
describe("Create PgConnection", function() {

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

})

/**
 *
 * DiscretePolyTopAreaGridderTaskBackend ORM.
 *
 */
describe("municipioDiscretePolyTopAreaGridderTask ORM", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observable: municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn),

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) =>
        expect(o.gridderTaskId, "Check ID").to.be.equal("municipioDiscretePolyTopArea")

    ],

    verbose: false

  })

})

describe("municipioDiscretePolyAreaSummaryGridderTaskBackend ORM", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observable: municipioDiscretePolyAreaSummaryGridderTask.pgInsert$(cellPgConn),

    assertions: [

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.gridderTaskId, "Check ID").to.be.equal("municipioDiscreteAreaSummary")

    ],

    verbose: false

  })

})
