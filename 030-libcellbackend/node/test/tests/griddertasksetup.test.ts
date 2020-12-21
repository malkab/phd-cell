import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { PgConnection, Grid } from "../../src/index";

import {
  cellPgConn, cellRawData, eugrid, clearDatabase$
} from "./common";

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
 * Insert Grid.
 *
 */
describe("Grid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid pgInsert$",

    observables: [ eugrid.pgInsert$(cellPgConn) ],

    assertions: [ (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Create PgConnection.
 *
 */
describe("Create PgConnection", function() {

  /**
   *
   * Create PgConnection.
   *
   */
  rxMochaTests({

    testCaseName: "Create PgConnection",

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})
