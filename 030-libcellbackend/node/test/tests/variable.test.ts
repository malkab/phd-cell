import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { VariableBackend, GridderTasks as gt, PgConnection } from "../../src/index";

import { clearDatabase$, variable, cellRawData, cellPgConn, municipioDiscretePolyTopAreaGridderTask } from "./common";

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
 * Insert DiscretePolyTopAreaGridderTaskBackend.
 *
 */
describe("Insert municipioDiscretePolyTopAreaGridderTask", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) => {

        expect(o.gridderTaskId, "GridderTask pgInsert$()").to.be.equal("municipioDiscretePolyTopArea")

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

      variable.pgInsert$(cellPgConn)

    ) ],

    assertions: [

      (o: VariableBackend) => {

        expect(o.name).to.be.equal("Var name");

      }

    ],

    verbose: false,

    active: true

  })

})
