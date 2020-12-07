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

    observables: [ clearDatabase$ ],

    assertions: [

      (o: boolean) => expect(o).to.be.true,

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

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

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

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) =>
        expect(o.gridderTaskId, "Check ID").to.be.equal("municipioDiscretePolyTopArea")

    ],

    verbose: false,

    active: true

  })

})

describe("municipioDiscretePolyAreaSummaryGridderTaskBackend ORM", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ municipioDiscretePolyAreaSummaryGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.gridderTaskId, "Check ID").to.be.equal("municipioDiscreteAreaSummary")

    ],

    verbose: false,

    active: true

  })

})
