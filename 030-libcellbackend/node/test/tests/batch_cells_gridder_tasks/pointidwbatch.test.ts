import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, gridderTaskGet$
} from "../../../src/index";

import {
  gridderTaskPointIdwMdt, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rxo from "rxjs/operators";


/**
 *
 * PointIdwGridderTask pgInsert$.
 *
 */
describe("PointIdwGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask pgInsert$",

    observables: [ gridderTaskPointIdwMdt.pgInsert$(pgConnCell) ],

    assertions: [

      (o: PointIdwGridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * PointIdwGridderTask get$.
 *
 */
describe("PointIdwGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskPointIdwMdt") ],

    assertions: [

      (o: PointIdwGridderTask) => {

        expect(o.name).to.be.equal("Interpolación MDT con IDW");

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
describe("PointIdwGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask setup$",

    observables: [ gridderTaskPointIdwMdt.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: PointIdwGridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

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
describe("PointIdwGridderTask computeCellsBatch$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask computeCellsBatch$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskPointIdwMdt")
      .pipe(

        rxo.concatMap((o: PointIdwGridderTask) => {

          return o.computeCellsBatch$(
            pgConnCellRawData, pgConnCell, testCell, 5, logger)

        })


      )

    ],

    assertions: [],

    verbose: false,

    active: true

  })

})
