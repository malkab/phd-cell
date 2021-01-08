import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, GridderJob,
  gridderTaskGet$, GridderTask, MdtProcessingGridderTask
} from "../../../src/index";

import {
  pgConnCell, logger, gridderTaskMdtProcessing, gridderJobMdtProcessing,
  pgConnCellRawData, gridderTaskPointIdwMdt,
  gridderJobPointIdwMdt, testCell
} from "../common";

import * as rxo from "rxjs/operators";

/**
 *
 * gridderTaskMdtProcessing pgInsert$.
 *
 */
describe("gridderTaskMdtProcessing pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskMdtProcessing pgInsert$",

    observables: [ gridderTaskMdtProcessing.pgInsert$(pgConnCell) ],

    assertions: [

      (o: MdtProcessingGridderTask) =>
        expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobMdtProcessing pgInsert$.
 *
 */
describe("gridderJobMdtProcessing pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobMdtProcessing pgInsert$",

    observables: [ gridderJobMdtProcessing.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("gridderJobMdtProcessing")

    ],

    verbose: false

  })

})

/**
 *
 * setup$.
 *
 */
describe("setup$", function() {

  rxMochaTests({

    testCaseName: "setup$",

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskMdtProcessing")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(pgConnCellRawData, pgConnCell, logger)),

      )

    ],

    assertions: [

      (o: GridderTask) =>
        expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * computeCell$.
 *
 */
describe("computeCell$", function() {

  rxMochaTests({

    testCaseName: "computeCell$",

    observables: [

      GridderJob.get$(pgConnCell, "gridderJobMdtProcessing")
      .pipe(

        rxo.concatMap((o: GridderJob) => o.getGridderTask$(pgConnCell)),

        rxo.concatMap((o: GridderJob) => o.computeCells$(
          pgConnCell,
          pgConnCellRawData,
          testCell,
          3, logger)
        )

      )

    ],

    // This test must not return any stream
    assertions: [],

    verbose: false,

    active: true

  })

})
