import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridderTasks as gt, PgConnection, GridBackend } from "../../src/index";

import { cellPgConn, cellRawData, cellRawDataConn, gridBackend, testCell021, testCell031, testCell022, testCell032, municipioDiscretePolyTopAreaGridderTask, clearDatabase$ } from "./common";

import * as rx from "rxjs";

/**
 *
 * Initial database clearance.
 *
 */
describe("Initial database clearance", function() {

  rxMochaTests({

    testCaseName: "Initial database clearance",

    observable: clearDatabase$,

    assertions: [ (o: boolean) => expect(o).to.be.true ]

  })

})

/**
 *
 * Insert GridBackend.
 *
 */
describe("GridBackend pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridBackend pgInsert$",

    observable: gridBackend.pgInsert$(cellPgConn),

    assertions: [ (o: GridBackend) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})

/**
 *
 * Create PgConnection.
 *
 */
describe("Create PgConnection", function() {

  /**
   *
   * Create PgConnection.
   *
   */
  rxMochaTests({

    testCaseName: "Create PgConnection",

    observable: cellRawData.pgInsert$(cellPgConn),

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false

  })

})

/**
 *
 * DiscretePolyTopAreaGridderTaskBackend pgInsert$.
 *
 */
describe("DiscretePolyTopAreaGridderTaskBackend pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTaskBackend pgInsert$",

    observable: municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn),

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) => expect(o.name).to.be.equal("Municipio máxima área")

    ],

    verbose: false

  })

})

/**
 *
 * computeCell$.
 *
 */
describe("DiscretePolyTopAreaGridderTaskBackend computeCell$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTaskBackend computeCell$",

    observable: rx.concat(

      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell021),
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell031),
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell022),
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell032)

    ),

    assertions: [

      (o: any) => {

        console.log("D: jj", );

      }

    ],

    verbose: false

  })

})
