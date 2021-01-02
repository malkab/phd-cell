import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Grid, SourcePgConnection, GridderTask, gridderTaskGet$,
  DiscretePolyTopAreaGridderTask
} from "../../src/index";

import {
  clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu,
  gridderTaskDiscretePolyTopAreaMunicipio
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
 * Test SourcePgConnection.
 *
 */
describe("Create SourcePgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "ORM pgInsert$",

    observables: [ pgConnectionCellRawData.pgInsert$(pgConnCell) ],

    assertions: [
      (o: SourcePgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

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
 * DiscretePolyTopAreaGridderTaskBackend ORM.
 *
 */
describe("gridderTaskDiscretePolyTopAreaMunicipio ORM", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) =>
        expect(o.gridderTaskId, "Check ID")
          .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipio")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * get$ gridderTaskDiscretePolyTopAreaMunicipio.
 *
 */
describe("get$ gridderTaskDiscretePolyTopAreaMunicipio", function() {

  rxMochaTests({

    testCaseName: "get$ gridderTaskDiscretePolyTopAreaMunicipio",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyTopAreaMunicipio") ],

    assertions: [

      (o: GridderTask) => {

        expect(o.name).to.equal("Municipio máxima área");
        expect(o.gridderTaskType)
          .to.equal(EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA);

      }

    ]

  })

})
