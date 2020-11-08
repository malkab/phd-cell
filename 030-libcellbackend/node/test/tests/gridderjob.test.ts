import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridderTasks as gt, PgConnection, GridBackend } from "../../src/index";

import { gridderJobHuelva, cellPg, cellPgConn, cellRawData, cellRawDataConn, gridBackend, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31, testCell_2_28_30, testCell_0_2_1, testCell_0_3_1, testCell_0_2_2, testCell_0_3_2, municipioDiscretePolyTopAreaGridderTask, clearDatabase$ } from "./common";

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

    observable: rx.zip(
      cellRawData.pgInsert$(cellPgConn),
      cellPg.pgInsert$(cellPgConn)
    ),

    assertions: [
      (o: PgConnection[]) => expect(o.map((o: PgConnection) => o.name))
        .to.be.deep.equal([ "Cell Raw Data", "Cell DB" ]) ],

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
 * gridderJobHuelva pgInsert$.
 *
 */
describe("gridderJobHuelva pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobHuelva pgInsert$",

    observable: gridderJobHuelva.pgInsert$(cellPgConn),

    assertions: [

      (o: gt.GridderJob) => expect(o.gridderJobId).to.be.equal("gridderJobHuelva")

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

    observable: gt.GridderJob.get$(cellPgConn, "gridderJobHuelva")
      .pipe(

        rxo.concatMap((o: gt.GridderJob) => {

          return o.getArea$(cellRawData, cellPg);

        })

      ),

    assertions: [

      (o: gt.GridderJob) => expect(o.gridderJobId).to.be.equal("gridderJobHuelva")

    ],

    verbose: false

  })

})
