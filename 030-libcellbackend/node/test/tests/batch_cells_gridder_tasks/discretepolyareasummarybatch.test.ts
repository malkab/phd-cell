import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyAreaSummaryGridderTask, gridderTaskGet$,
} from "../../../src/index";

import {
  gridderTaskDiscretePolyAreaSummaryMunicipio, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rxo from "rxjs/operators";


/**
 *
 * DiscretePolyAreaSummaryGridderTask pgInsert$.
 *
 */
describe("DiscretePolyAreaSummaryGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask pgInsert$",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name).to.be.equal("Desglose de área de municipios")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * DiscretePolyAreaSummaryGridderTask get$.
 *
 */
describe("DiscretePolyAreaSummaryGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyAreaSummaryMunicipio") ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => {

        expect(o.name).to.be.equal("Desglose de área de municipios");

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
describe("DiscretePolyAreaSummaryGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask setup$",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name).to.be.equal("Desglose de área de municipios")

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
describe("DiscretePolyAreaSummaryGridderTask computeCellsBatch$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask computeCellsBatch$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyAreaSummaryMunicipio")
      .pipe(

        rxo.concatMap((o: DiscretePolyAreaSummaryGridderTask) => {

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
