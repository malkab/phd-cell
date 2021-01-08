import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyAreaSummaryGridderTask, GridderJob,
  gridderTaskGet$, GridderTask
} from "../../../src/index";

import {
  pgConnCell, logger,
  pgConnCellRawData, gridderTaskDiscretePolyAreaSummaryMunicipio,
  gridderJobDiscretePolyAreaSummaryMunicipio, testCell
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

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name)
        .to.be.equal("Desglose de área de municipios")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobAreaSummary pgInsert$.
 *
 */
describe("gridderJobAreaSummary pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobAreaSummary pgInsert$",

    observables: [ gridderJobDiscretePolyAreaSummaryMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("gridderJobDiscretePolyAreaSummaryMunicipio")

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

      gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyAreaSummaryMunicipio")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(pgConnCellRawData, pgConnCell, logger)),

      )

    ],

    assertions: [

      (o: GridderTask) => expect(o.name)
        .to.be.equal("Desglose de área de municipios")

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

      GridderJob.get$(pgConnCell, "gridderJobDiscretePolyAreaSummaryMunicipio")
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
