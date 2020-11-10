import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridderTasks as gt, PgConnection, GridBackend } from "../../src/index";

import { gridderCellA, gridderJobHuelva, cellPg, cellPgConn, cellRawData, cellRawDataExternal, cellRawDataConn, gridBackend, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31, testCell_2_28_30, testCell_0_2_1, testCell_0_3_1, testCell_0_2_2, testCell_0_3_2, municipioDiscretePolyTopAreaGridderTask, clearDatabase$ } from "./common";

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

    observable: clearDatabase$,

    assertions: [ (o: boolean) => expect(o).to.be.true ]

  })

})

/**
 *
 * pgInsert$ dependencies.
 *
 */
describe("pgInsert$ dependencies", function() {

  rxMochaTests({

    testCaseName: "pgInsert$ dependencies",

    observable: rx.concat(

      municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn),

      gridderJobHuelva.pgInsert$(cellPgConn)

    ),

    assertions: [

      (o: gt.GridderTaskBackend) => expect(o.name).to.be.equal("Municipio máxima área"),

      (o: gt.GridderJob) => expect(o.minZoomLevel).to.be.equal(2)

    ]

  })

})

/**
 *
 * Insert GridderCell.
 *
 */
describe("GridderCell pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridderCell pgInsert$",

    observable: gridderCellA.pgInsert$(cellPgConn),

    assertions: [

      (o: gt.GridderCell) => expect(o.gridderCellId).to.be.equal("gridderCellA") ],

    verbose: true

  })

})

/**
 *
 * GridderCell Process.
 *
 */
describe("GridderCell Process", function() {

  rxMochaTests({

    testCaseName: "GridderCell Process",

    observable: rx.concat(

      gt.GridderCell.get$(cellPgConn, "gridderCellA")

    ),

    assertions: [

      (o: gt.GridderCell) => expect(o.gridderCellId).to.be.equal("gridderCellA") ],

    verbose: true

  })

})
