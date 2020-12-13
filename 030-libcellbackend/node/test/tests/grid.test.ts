import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { Grid } from "../../src/index";

import { eugrid, clearDatabase$, cellPgConn } from "./common";

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
 * Grid pgInsert$.
 *
 */
describe("Grid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid pgInsert$",

    observables: [ eugrid.pgInsert$(cellPgConn) ],

    assertions: [
      (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})

/**
 *
 * Grid get$.
 *
 */
describe("Grid get$", function() {

  rxMochaTests({

    testCaseName: "Grid get$",

    observables: [ Grid.get$(cellPgConn, "eu-grid") ],

    assertions: [
      (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})
