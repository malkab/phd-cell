import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyAreaSummaryGridderTask, GridderJob, Cell,
  gridderTaskGet$, GridderTask
} from "../../../src/index";

import {
  gridderJobAreaSummary, cellPgConn, cellRawDataConn, eugrid,
  municipioDiscretePolyAreaSummaryGridderTask, logger
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

    observables: [ municipioDiscretePolyAreaSummaryGridderTask.pgInsert$(cellPgConn) ],

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

    observables: [ gridderJobAreaSummary.pgInsert$(cellPgConn) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("gridderJobAreaSummary")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobAreaSummary get and area retrieval.
 *
 */
describe("gridderJobAreaSummary get and area retrieval", function() {

  rxMochaTests({

    testCaseName: "gridderJobAreaSummary get and area retrieval",

    observables: [

      GridderJob.get$(cellPgConn, "gridderJobAreaSummary")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getArea$(cellRawDataConn, cellPgConn, eugrid))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("gridderJobAreaSummary")

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

      GridderJob.get$(cellPgConn, "gridderJobAreaSummary")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getCoveringCells$(cellPgConn, eugrid, 0))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o).to.be.equal(7)

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

      GridderJob.get$(cellPgConn, "gridderJobAreaSummary")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getCoveringCells$(cellPgConn, eugrid, 1))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o).to.be.equal(12)

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

      gridderTaskGet$(cellPgConn, "municipioDiscretePolyAreaSummary")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(cellRawDataConn, cellPgConn, logger)),

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

      GridderJob.get$(cellPgConn, "gridderJobAreaSummary")
      .pipe(

        rxo.concatMap((o: GridderJob) => o.getGridderTask$(cellPgConn)),

        rxo.concatMap((o: GridderJob) => o.computeCells$(
          cellPgConn,
          cellRawDataConn,
          [
            new Cell({
              gridId: "eu-grid",
              zoom: 1,
              x: 1,
              y: 6,
            }),
            new Cell({
              gridId: "eu-grid",
              zoom: 1,
              x: 2,
              y: 6,
            }),
            new Cell({
              gridId: "eu-grid",
              zoom: 1,
              x: 2,
              y: 5,
            })
          ], 3, logger)
        )

      )

    ],

    // This test must not return any stream
    assertions: [],

    verbose: false,

    active: true

  })

})
