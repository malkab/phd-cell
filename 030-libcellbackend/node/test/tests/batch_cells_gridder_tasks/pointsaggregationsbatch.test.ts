import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointAggregationsGridderTask, gridderTaskGet$,
} from "../../../src/index";

import {
  gridderTaskPointAggregationsPoblacion, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rxo from "rxjs/operators";

/**
 *
 * PointAggregationsGridderTask pgInsert$.
 *
 */
describe("PointAggregationsGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask pgInsert$",

    observables: [ gridderTaskPointAggregationsPoblacion.pgInsert$(pgConnCell) ],

    assertions: [

      (o: PointAggregationsGridderTask) => expect(o.name).to.be.equal("Estadísticas de población")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * PointAggregationsGridderTask get$.
 *
 */
describe("PointAggregationsGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskPointAggregationsPoblacion") ],

    assertions: [

      (o: PointAggregationsGridderTask) => {

        expect(o.name).to.be.equal("Estadísticas de población");

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Setup the GridderTask.
 *
 */
describe("PointAggregationsGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask setup$",

    observables: [ gridderTaskPointAggregationsPoblacion.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: PointAggregationsGridderTask) => expect(o.name).to.be.equal("Estadísticas de población")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Run batch.
 *
 */
describe("PointAggregationsGridderTask computeCellsBatch$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask computeCellsBatch$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskPointAggregationsPoblacion")
      .pipe(

        rxo.concatMap((o: PointAggregationsGridderTask) => {

          return o.computeCellsBatch$(
            pgConnCellRawData, pgConnCell, testCell, 5, logger)

        })


      )

    ],

    assertions: [],

    verbose: true,

    active: true

  })

})
