import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Variable, PgConnection, DiscretePolyTopAreaGridderTask, Grid
} from "../../src/index";

import {
  clearDatabase$, variable, cellRawData, cellPgConn, eugrid,
  municipioDiscretePolyTopAreaGridderTask
} from "./common";

import * as rx from "rxjs";

/**
 *
 * Initial database clearance.
 *
 */
describe("Initial database clearance", function() {

  rxMochaTests({

    testCaseName: "Initial database clearance",

    observables: [ clearDatabase$ ],

    assertions: [

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true

    ],

    verbose: false

  })

})

/**
 *
 * Insert PgConnection.
 *
 */
describe("Insert PgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "pgInsert$",

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) =>
        expect(o.name, "pgInsert$").to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Grid eugrid pgInsert$.
 *
 */
describe("Grid eugrid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid eugrid pgInsert$",

    observables: [ eugrid.pgInsert$(cellPgConn) ],

    assertions: [

      (o: Grid) => expect(o.gridId).to.be.equal("eu-grid")

    ]

  })

})

/**
 *
 * Insert DiscretePolyTopAreaGridderTaskBackend.
 *
 */
describe("Insert municipioDiscretePolyTopAreaGridderTask", function() {

  rxMochaTests({

    testCaseName: "Insert municipioDiscretePolyTopAreaGridderTask",

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.gridderTaskId).to.be.equal("municipioDiscretePolyTopArea")

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Variable pgInsert$.
 *
 */
describe("Variable pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Variable pgInsert$",

    observables: [ rx.concat(

      variable.pgInsert$(cellPgConn),
      variable.pgInsert$(cellPgConn)

    ) ],

    assertions: [

      (o: Variable) => expect(o.name).to.be.equal("Var name"),
      (o: Error) =>
        expect(o.message).to.be.equal('duplicate key value violates unique constraint "unique_gridder_task_id_name"')

    ],

    verbose: false,

    active: true

  })

})
