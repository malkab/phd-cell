import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  GridderJob, DiscretePolyAreaSummaryGridderTask, Grid
} from "../../src/index";

import {
  gridderJobDefault, gridderTaskDefault, pgConnCell, pgConnCellRawData, gridEu,
  clearDatabase$
} from "./common";

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
 * Grid pgInsert$.
 *
 */
describe("Grid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid pgInsert$",

    observables: [ gridEu.pgInsert$(pgConnCell) ],

    assertions: [
      (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})

/**
 *
 * gridderTaskDefault pgInsert$.
 *
 */
describe("gridderTaskDefault pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskDefault pgInsert$",

    observables: [ gridderTaskDefault.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) =>
        expect(o.name).to.be.equal("Name Default")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobDefault pgInsert$.
 *
 */
describe("gridderJobDefault pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobDefault pgInsert$",

    observables: [ gridderJobDefault.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("defaultGridderJob")

    ],

    verbose: false

  })

})

/**
 *
 * Get and area retrieval.
 *
 */
describe("Get and area retrieval", function() {

  rxMochaTests({

    testCaseName: "Get and area retrieval",

    observables: [

      GridderJob.get$(pgConnCell, "defaultGridderJob")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getArea$(pgConnCellRawData, pgConnCell, gridEu))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("defaultGridderJob")

    ],

    verbose: false

  })

})

/**
 *
 * Get coverage of target area at zoom 0.
 *
 */
describe("Get coverage of target area at zoom 0", function() {

  rxMochaTests({

    testCaseName: "Get coverage of target area at zoom 0",

    observables: [

      GridderJob.get$(pgConnCell, "defaultGridderJob")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getCoveringCells$(pgConnCell, gridEu, 0))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o).to.be.equal(20)

    ],

    verbose: false

  })

})

/**
 *
 * Get coverage of target area at zoom 1.
 *
 */
describe("Get coverage of target area at zoom 1", function() {

  rxMochaTests({

    testCaseName: "Get coverage of target area at zoom 1",

    observables: [

      GridderJob.get$(pgConnCell, "defaultGridderJob")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getCoveringCells$(pgConnCell, gridEu, 1))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o).to.be.equal(54)

    ],

    verbose: false

  })

})
