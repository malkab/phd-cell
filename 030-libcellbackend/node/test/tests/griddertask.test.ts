import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Grid, SourcePgConnection, GridderTask, gridderTaskGet$, Cell,
  DiscretePolyTopAreaGridderTask
} from "../../src/index";

import {
  clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu, testCell,
  gridderTaskDiscretePolyTopAreaMunicipio, pgConnCellRawData, logger
} from "./common";

import { EGRIDDERTASKTYPE } from "../../src/griddertasks/egriddertasktype";

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
 * SourcePgConnection pgInsert$.
 *
 */
describe("SourcePgConnection pgInsert$", function() {

  rxMochaTests({

    testCaseName: "SourcePgConnection pgInsert$",

    observables: [ pgConnectionCellRawData.pgInsert$(pgConnCell) ],

    assertions: [
      (o: SourcePgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Grid pgInsert$.
 *
 */
describe("Grid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid pgInsert$",

    observables: [ gridEu.pgInsert$(pgConnCell) ],

    assertions: [

      (o: Grid) => expect(o.gridId).to.be.equal("eu-grid")

    ]

  })

})

/**
 *
 * GridderTask pgInsert$.
 *
 */
describe("GridderTask pgInsert$", function() {

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
 * GridderTask get$.
 *
 */
describe("GridderTask get$", function() {

  rxMochaTests({

    testCaseName: "GridderTask get$",

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

/**
 *
 * GridderTask setup$.
 *
 */
describe("GridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "GridderTask setup$",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * GridderTask computeCell$.
 *
 */
describe("GridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "GridderTask computeCell$",

    timeout: 300000,

    observables: [

      rx.zip(...testCell.map((x: Cell) =>
        gridderTaskDiscretePolyTopAreaMunicipio.computeCell$(
          pgConnCellRawData, pgConnCell, x, 4, logger)))

    ],

    assertions: [

      (o: Cell[][]) => {

        expect(o.map((x: Cell[]) => x.length), "Child cells")
          .to.be.deep.equal([ 0, 4, 4, 0, 4, 0, 0, 0 ]);

      }

    ],

    verbose: false,

    active: true

  })

})
