import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, GridderJob,
  gridderTaskGet$, GridderTask
} from "../../../src/index";

import {
  pgConnCell, logger,
  pgConnCellRawData, gridderTaskPointIdwMdt,
  gridderJobPointIdwMdt, testCell
} from "../common";

import * as rxo from "rxjs/operators";

/**
 *
 * gridderTaskPointIdwMdt pgInsert$.
 *
 */
describe("gridderTaskPointIdwMdt pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskPointIdwMdt pgInsert$",

    observables: [ gridderTaskPointIdwMdt.pgInsert$(pgConnCell) ],

    assertions: [

      (o: PointIdwGridderTask) =>
        expect(o.name).to.be.equal("Interpolación MDT con IDW")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobPointIdwMdt pgInsert$.
 *
 */
describe("gridderJobPointIdwMdt pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobPointIdwMdt pgInsert$",

    observables: [ gridderJobPointIdwMdt.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("gridderJobPointIdwMdt")

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

      gridderTaskGet$(pgConnCell, "gridderTaskPointIdwMdt")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(pgConnCellRawData, pgConnCell, logger)),

      )

    ],

    assertions: [

      (o: GridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

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

      GridderJob.get$(pgConnCell, "gridderJobPointIdwMdt")
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
