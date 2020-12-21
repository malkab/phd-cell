import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyTopAreaGridderTask, GridderJob,
  DiscretePolyAreaSummaryGridderTask, PgConnection, Grid, Cell,
  gridderTaskGet$, GridderTask
} from "../../src/index";

import {
  gridderJobTopArea, cellPg, cellPgConn, cellRawData, cellRawDataConn, eugrid,
  municipioDiscretePolyTopAreaGridderTask, clearDatabase$, logger,
  municipioDiscretePolyAreaSummaryGridderTask,
  gridderJobAreaSummary
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
