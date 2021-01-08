import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointAggregationsGridderTask, GridderJob,
  gridderTaskGet$, GridderTask
} from "../../../src/index";

import {
  pgConnCell, logger,
  pgConnCellRawData, gridderTaskPointAggregationsPoblacion,
  gridderJobPointAggregationsPoblacion, testCell
} from "../common";

import * as rxo from "rxjs/operators";

/**
 *
 * DiscretePolyTopAreaGridderTask pgInsert$.
 *
 */
describe("PointAggregationsGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask pgInsert$",

    observables: [ gridderTaskPointAggregationsPoblacion.pgInsert$(pgConnCell) ],

    assertions: [

      (o: PointAggregationsGridderTask) => expect(o.name)
        .to.be.equal("Estadísticas de población")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobPointAggregationsPoblacion pgInsert$.
 *
 */
describe("gridderJobPointAggregationsPoblacion pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobPointAggregationsPoblacion pgInsert$",

    observables: [ gridderJobPointAggregationsPoblacion.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) => expect(o.gridderJobId)
        .to.be.equal("gridderJobPointAggregationsPoblacion")

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

      gridderTaskGet$(pgConnCell, "gridderTaskPointAggregationsPoblacion")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(pgConnCellRawData, pgConnCell, logger)),

      )

    ],

    assertions: [

      (o: GridderTask) => expect(o.name).to.be.equal("Estadísticas de población")

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

      GridderJob.get$(pgConnCell, "gridderJobPointAggregationsPoblacion")
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
