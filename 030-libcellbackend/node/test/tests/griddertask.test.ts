import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Grid, SourcePgConnection, GridderTask, gridderTaskGet$, Cell, GridderJob,
  DiscretePolyTopAreaGridderTask, DiscretePolyAreaSummaryGridderTask
} from "../../src/index";

import {
  clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu, testCell,
  gridderTaskDiscretePolyTopAreaMunicipio, pgConnCellRawData, logger,
  gridderTaskDiscretePolyAreaSummaryMunicipio,
  gridderJobDiscretePolyTopAreaMunicipio,
  gridderJobDiscretePolyAreaSummaryMunicipio
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
 * GridderTask Top Area pgInsert$.
 *
 */
describe("GridderTask Top Area pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Top Area pgInsert$",

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
 * GridderJob Top Area pgInsert$.
 *
 */
describe("GridderJob Top Area pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridderJob Top Area pgInsert$",

    observables: [ gridderJobDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderTaskId, "Check ID")
          .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipio")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * GridderTask Top Area get$.
 *
 */
describe("GridderTask Top Area get$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Top Area get$",

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
 * GridderTask Area Summary setup$.
 *
 */
describe("GridderTask Top Area setup$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Top Area setup$",

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
describe("GridderTask Top Area computeCell$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Top Area computeCell$",

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

/**
 *
 * GridderTask Area Summary pgInsert$.
 *
 */
describe("GridderTask Area Summary pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Area Summary pgInsert$",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) =>
        expect(o.gridderTaskId, "Check ID")
          .to.be.equal("gridderTaskDiscretePolyAreaSummaryMunicipio")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * GridderJob Area Summary pgInsert$.
 *
 */
describe("GridderJob Area Summary pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridderJob Area Summary pgInsert$",

    observables: [ gridderJobDiscretePolyAreaSummaryMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderTaskId, "Check ID")
          .to.be.equal("gridderTaskDiscretePolyAreaSummaryMunicipio")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * GridderTask Area Summary setup$.
 *
 */
describe("GridderTask Area Summary setup$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Area Summary setup$",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name).to.be.equal("Desglose de área de municipios")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * GridderTask Area Summary computeCell$.
 *
 */
describe("GridderTask Area Summary computeCell$", function() {

  rxMochaTests({

    testCaseName: "GridderTask Area Summary computeCell$",

    timeout: 300000,

    observables: [

      rx.zip(...testCell.map((x: Cell) =>
        gridderTaskDiscretePolyAreaSummaryMunicipio.computeCell$(
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
