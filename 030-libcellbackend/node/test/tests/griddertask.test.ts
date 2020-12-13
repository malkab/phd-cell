import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Grid, PgConnection, GridderTask, gridderTaskGet$,
  DiscretePolyTopAreaGridderTask, DiscretePolyAreaSummaryGridderTask
} from "../../src/index";

import {
  cellPgConn, cellRawData, clearDatabase$, eugrid,
  municipioDiscretePolyTopAreaGridderTask,
  municipioDiscretePolyAreaSummaryGridderTask
} from "./common";
import { EGRIDDERTASKTYPE } from "../../src/griddertasks/egriddertasktype";

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
 * Test PgConnection.
 *
 */
describe("Create PgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "ORM pgInsert$",

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

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
 * DiscretePolyTopAreaGridderTaskBackend ORM.
 *
 */
describe("municipioDiscretePolyTopAreaGridderTask ORM", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) =>
        expect(o.gridderTaskId, "Check ID").to.be.equal("municipioDiscretePolyTopArea")

    ],

    verbose: false,

    active: true

  })

})

describe("municipioDiscretePolyAreaSummaryGridderTaskBackend ORM", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ municipioDiscretePolyAreaSummaryGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) =>
        expect(o.gridderTaskId, "Check ID").to.be.equal("municipioDiscreteAreaSummary")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * get$ municipioDiscretePolyTopAreaGridderTask.
 *
 */
describe("get$ municipioDiscretePolyTopAreaGridderTask", function() {

  rxMochaTests({

    testCaseName: "get$ municipioDiscretePolyTopAreaGridderTask",

    observables: [ gridderTaskGet$(cellPgConn, "municipioDiscretePolyTopArea") ],

    assertions: [

      (o: GridderTask) => {

        expect(o.name).to.equal("Municipio máxima área");
        expect(o.gridderTaskType).to.equal(EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA);

      }

    ]

  })

})

/**
 *
 * get$ municipioDiscretePolyAreaSummaryGridderTask.
 *
 */
describe("get$ municipioDiscretePolyAreaSummaryGridderTask", function() {

  rxMochaTests({

    testCaseName: "get$ municipioDiscretePolyAreaSummaryGridderTask",

    observables: [ gridderTaskGet$(cellPgConn, "municipioDiscreteAreaSummary") ],

    assertions: [

      (o: GridderTask) => {

        expect(o.name).to.equal("Desglose de área de municipios");
        expect(o.gridderTaskType).to.equal(EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY);

      }

    ]

  })

})
