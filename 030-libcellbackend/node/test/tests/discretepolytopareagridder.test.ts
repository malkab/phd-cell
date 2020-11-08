import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridderTasks as gt, PgConnection, GridBackend } from "../../src/index";

import { cellPgConn, cellRawData, cellRawDataConn, gridBackend, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31, testCell_2_28_30, testCell_0_2_1, testCell_0_3_1, testCell_0_2_2, testCell_0_3_2, municipioDiscretePolyTopAreaGridderTask, clearDatabase$ } from "./common";

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

  // Set a high timeout, 5 min
  this.timeout(300000);

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTaskBackend computeCell$",

    observable: rx.concat(

      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_27_32, 7),
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_24_31, 4),
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_28_30, 4),
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_25_32, 4)

    ),

    assertions: [

      (o: any) => {

        expect(o.length, "Child cells for 2,27,32").to.be.equal(0);

      },

      (o: any) => {

        expect(o.length, "Child cells for 2,24,31").to.be.equal(4);

      },

      (o: any) => {

        expect(o.length, "Child cells for 2,28,32").to.be.equal(4);

      },

      (o: any) => {

        expect(o.length, "Child cells for 2,25,32").to.be.undefined;

      }

    ],

    verbose: false

  })

})
