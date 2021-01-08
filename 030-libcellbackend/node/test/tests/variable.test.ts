import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Variable, SourcePgConnection, DiscretePolyTopAreaGridderTask, Grid
} from "../../src/index";

import {
  clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu,
  gridderTaskDiscretePolyTopAreaMunicipio, variableDefault
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
 * Insert SourcePgConnection.
 *
 */
describe("Insert SourcePgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "pgInsert$",

    observables: [ pgConnectionCellRawData.pgInsert$(pgConnCell) ],

    assertions: [
      (o: SourcePgConnection) =>
        expect(o.name, "pgInsert$").to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Grid gridEu pgInsert$.
 *
 */
describe("Grid gridEu pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid gridEu pgInsert$",

    observables: [ gridEu.pgInsert$(pgConnCell) ],

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
describe("Insert gridderTaskDiscretePolyTopAreaMunicipio", function() {

  rxMochaTests({

    testCaseName: "Insert gridderTaskDiscretePolyTopAreaMunicipio",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.gridderTaskId)
          .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipio")

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

      variableDefault.pgInsert$(pgConnCell),
      variableDefault.pgInsert$(pgConnCell)

    ) ],

    assertions: [

      (o: Variable) => expect(o.name).to.be.equal("Var default name"),
      (o: Error) =>
        expect(o.message).to.be.equal('duplicate key value violates unique constraint "unique_gridder_task_id_name"')

    ],

    verbose: false,

    active: true

  })

})
