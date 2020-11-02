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

    observable: clearDatabase$,

    assertions: [ (o: boolean) => expect(o).to.be.true ]

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

    observable: cellRawData.pgInsert$(cellPgConn),

    assertions: [
      (o: PgConnection) =>
        expect(o.name, "pgInsert$").to.be.equal("Cell Raw Data") ],

    verbose: false

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

    observable: municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn),

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) => {

        expect(o.gridderTaskId, "GridderTask pgInsert$()").to.be.equal("municipioDiscretePolyTopArea")

      }

    ],

    verbose: false

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

    observable: rx.concat(

      variable.pgInsert$(cellPgConn)

    ),

    assertions: [

      (o: VariableBackend) => {

        expect(o.name).to.be.equal("Var name");

      }

    ],

    verbose: false

  })

})

/**
 *
 * Variable dbSet$.
 *
 */
describe("Variable dbSet$", function() {

  rxMochaTests({

    testCaseName: "Variable dbSet$",

    observable: rx.concat(

      variable.dbSet$(cellPgConn)

    ),

    assertions: [

      (o: VariableBackend) => {

        expect(o.name).to.be.equal("Var name");

      }

    ],

    verbose: false

  })

})
