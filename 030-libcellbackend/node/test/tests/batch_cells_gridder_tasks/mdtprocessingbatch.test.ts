import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  gridderTaskGet$, MdtProcessingGridderTask,
} from "../../../src/index";

import {
  gridderTaskMdtProcessing, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rxo from "rxjs/operators";


/**
 *
 * MdtProcessingGridderTask pgInsert$.
 *
 */
describe("MdtProcessingGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask pgInsert$",

    observables: [ gridderTaskMdtProcessing.pgInsert$(pgConnCell) ],

    assertions: [

      (o: MdtProcessingGridderTask) => expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * MdtProcessingGridderTask get$.
 *
 */
describe("MdtProcessingGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskMdtProcessing") ],

    assertions: [

      (o: MdtProcessingGridderTask) => {

        expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW");

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
describe("MdtProcessingGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask setup$",

    observables: [ gridderTaskMdtProcessing.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: MdtProcessingGridderTask) => expect(o.name).to.be.equal("Interpolación MDT por media de alturas e IDW")

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
describe("MdtProcessingGridderTask computeCellsBatch$", function() {

  rxMochaTests({

    testCaseName: "MdtProcessingGridderTask computeCellsBatch$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskMdtProcessing")
      .pipe(

        rxo.concatMap((o: MdtProcessingGridderTask) => {

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
