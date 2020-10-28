import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridBackend } from "../../src/index";

import { gridBackend, clearDatabase$, cellPg } from "./common";

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
 * Insert GridBackend.
 *
 */
describe("GridBackend pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridBackend pgInsert$",

    observable: gridBackend.pgInsert$(cellPg),

    assertions: [
      (o: GridBackend) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})
