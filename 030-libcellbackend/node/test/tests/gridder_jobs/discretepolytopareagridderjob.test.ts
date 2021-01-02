import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyTopAreaGridderTask, GridderJob,
  gridderTaskGet$, GridderTask
} from "../../../src/index";

import {
  pgConnCell, logger,
  pgConnCellRawData, gridderTaskDiscretePolyTopAreaMunicipio,
  gridderJobDiscretePolyTopAreaMunicipio, testCell
} from "../common";

import * as rxo from "rxjs/operators";

/**
 *
 * DiscretePolyTopAreaGridderTask pgInsert$.
 *
 */
describe("DiscretePolyTopAreaGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask pgInsert$",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobTopArea pgInsert$.
 *
 */
describe("gridderJobTopArea pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobTopArea pgInsert$",

    observables: [ gridderJobDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) => expect(o.gridderJobId)
        .to.be.equal("gridderJobDiscretePolyTopAreaMunicipio")

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

      gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyTopAreaMunicipio")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(pgConnCellRawData, pgConnCell, logger)),

      )

    ],

    assertions: [

      (o: GridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

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

      GridderJob.get$(pgConnCell, "gridderJobDiscretePolyTopAreaMunicipio")
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
