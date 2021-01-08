import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { SourcePgConnection, Grid } from "../../../src/index";

import {
  pgConnCell, pgConnectionCellRawData, gridEu, clearDatabase$
} from "../common";

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

    observables: [ gridEu.pgInsert$(pgConnCell) ],

    assertions: [ (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Create SourcePgConnection.
 *
 */
describe("Create SourcePgConnection", function() {

  /**
   *
   * Create SourcePgConnection.
   *
   */
  rxMochaTests({

    testCaseName: "Create SourcePgConnection",

    observables: [ pgConnectionCellRawData.pgInsert$(pgConnCell) ],

    assertions: [
      (o: SourcePgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})
