import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyTopAreaGridderTask, GridderJob,
  PgConnection, Grid, Cell, gridderTaskGet$, GridderTask
} from "../../src/index";

import {
  gridderJobHuelva, cellPg, cellPgConn, cellRawData, cellRawDataConn, eugrid,
  municipioDiscretePolyTopAreaGridderTask, clearDatabase$, logger
} from "./common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * Initial database clearance.
 *
 */
describe("Initial database clearance", function() {

  rxMochaTests({

    testCaseName: "Initial database clearance",

    observables: [ clearDatabase$ ],

    assertions: [ (o: boolean) => expect(o).to.be.true ]

  })

})

/**
 *
 * Insert Grid.
 *
 */
describe("Grid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid pgInsert$",

    observables: [ eugrid.pgInsert$(cellPgConn) ],

    assertions: [ (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})

/**
 *
 * Create PgConnections.
 *
 */
describe("Create PgConnections", function() {

  /**
   *
   * Create PgConnection.
   *
   */
  rxMochaTests({

    testCaseName: "Create PgConnection",

    observables: [ rx.zip(
      cellRawData.pgInsert$(cellPgConn),
      cellPg.pgInsert$(cellPgConn)
    ) ],

    assertions: [
      (o: PgConnection[]) => expect(o.map((o: PgConnection) => o.name))
        .to.be.deep.equal([ "Cell Raw Data", "Cell DB" ]) ],

    verbose: false

  })

})

/**
 *
 * DiscretePolyTopAreaGridderTask pgInsert$.
 *
 */
describe("DiscretePolyTopAreaGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask pgInsert$",

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobHuelva pgInsert$.
 *
 */
describe("gridderJobHuelva pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobHuelva pgInsert$",

    observables: [ gridderJobHuelva.pgInsert$(cellPgConn) ],

    assertions: [

      (o: GridderJob) => expect(o.gridderJobId).to.be.equal("gridderJobHuelva")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobHuelva get and area retrieval.
 *
 */
describe("gridderJobHuelva get and area retrieval", function() {

  rxMochaTests({

    testCaseName: "gridderJobHuelva get and area retrieval",

    observables: [

      GridderJob.get$(cellPgConn, "gridderJobHuelva")
      .pipe(

        rxo.concatMap((o: GridderJob) =>
          o.getArea$(cellRawDataConn, cellPgConn, eugrid))

      )

    ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("gridderJobHuelva")

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

      GridderJob.get$(cellPgConn, "gridderJobHuelva")
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

      GridderJob.get$(cellPgConn, "gridderJobHuelva")
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
 * Perform a local gridding of a cell.
 *
 */
describe("Perform a local gridding of a cell", function() {

  rxMochaTests({

    testCaseName: "Perform a local gridding of a cell",

    observables: [

      gridderTaskGet$(cellPgConn, "municipioDiscretePolyTopArea")
      .pipe(

        rxo.concatMap((o: GridderTask) =>
          o.setup$(cellRawDataConn, cellPgConn, logger)),

      ),

      GridderJob.get$(cellPgConn, "gridderJobHuelva")
      .pipe(

        rxo.concatMap((o: GridderJob) => o.getGridderTask$(cellPgConn)),

        rxo.concatMap((o: GridderJob) => o.startOnCellLocalMode$(
          cellPgConn,
          cellRawDataConn,
          [ new Cell({
            gridId: "eu-grid",
            zoom: 0,
            x: 2,
            y: 2,
          }) ], 7, logger)
        )

      )

    ],

    assertions: [

      (o: GridderTask) => expect(o.name).to.be.equal("Municipio máxima área"),

      (o: GridderJob) =>
        expect(o).to.be.equal(12)

    ],

    verbose: true

  })

})
