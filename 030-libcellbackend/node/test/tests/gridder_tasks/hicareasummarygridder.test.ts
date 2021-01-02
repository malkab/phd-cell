import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyAreaSummaryGridderTask, gridderTaskGet$, Cell
} from "../../../src/index";

import {
  gridderTaskDiscretePolyAreaSummaryHic, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rx from "rxjs";



/**
 *
 * gridderTaskDiscretePolyAreaSummaryHic pgInsert$.
 *
 */
describe("gridderTaskDiscretePolyAreaSummaryHic pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskDiscretePolyAreaSummaryHic pgInsert$",

    observables: [ gridderTaskDiscretePolyAreaSummaryHic.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name)
        .to.be.equal("Desglose de área de Hábitats de Interés Comunitario (HIC)")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * gridderTaskDiscretePolyAreaSummaryHic get$.
 *
 */
describe("gridderTaskDiscretePolyAreaSummaryHic get$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskDiscretePolyAreaSummaryHic get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyAreaSummaryHic") ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => {

        expect(o.name)
          .to.be.equal("Desglose de área de Hábitats de Interés Comunitario (HIC)");

        expect(o.gridId, "gridId").to.be.equal("eu-grid");

        expect(o.grid).to.be.undefined;

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Setup the GridderTask.
 *
 */
describe("gridderTaskDiscretePolyAreaSummaryHic setup$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskDiscretePolyAreaSummaryHic setup$",

    observables: [ gridderTaskDiscretePolyAreaSummaryHic.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) =>
        expect(o.name).to.be.equal("Desglose de área de Hábitats de Interés Comunitario (HIC)")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * computeCell$.
 *
 */
describe("gridderTaskDiscretePolyAreaSummaryHic computeCell$", function() {

  rxMochaTests({

    testCaseName: "gridderTaskDiscretePolyAreaSummaryHic computeCell$",

    timeout: 300000,

    observables: [

      rx.zip(...testCell.map((x: Cell) =>
      gridderTaskDiscretePolyAreaSummaryHic.computeCell$(
          pgConnCellRawData, pgConnCell, x, 4, logger)))

    ],

    assertions: [

      (o: Cell[][]) => {

        expect(o.map((x: Cell[]) => x.length), "Child cells")
          .to.be.deep.equal([ 4, 4, 4, 0, 4, 0, 0, 0 ]);

      }

    ],

    verbose: false,

    active: true

  })

})
