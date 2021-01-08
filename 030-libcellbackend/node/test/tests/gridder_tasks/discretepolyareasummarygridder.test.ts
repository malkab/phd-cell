import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyAreaSummaryGridderTask, gridderTaskGet$, Cell, GridderTask
} from "../../../src/index";

import {
  gridderTaskDiscretePolyAreaSummaryMunicipio, pgConnCell, pgConnCellRawData,
  testCell, logger
} from "../common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * DiscretePolyAreaSummaryGridderTask pgInsert$.
 *
 */
describe("DiscretePolyAreaSummaryGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask pgInsert$",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name).to.be.equal("Desglose de área de municipios")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * DiscretePolyAreaSummaryGridderTask get$.
 *
 */
describe("DiscretePolyAreaSummaryGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyAreaSummaryMunicipio") ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => {

        expect(o.name).to.be.equal("Desglose de área de municipios");

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
describe("DiscretePolyAreaSummaryGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask setup$",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio
      .setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name).to.be.equal("Desglose de área de municipios")

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
describe("DiscretePolyAreaSummaryGridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTask computeCell$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskDiscretePolyAreaSummaryMunicipio")
      .pipe(

        rxo.concatMap((o: DiscretePolyAreaSummaryGridderTask) =>
          rx.zip(...testCell.map((x: Cell) =>
            o.computeCell$(pgConnCellRawData, pgConnCell, x, 5, logger))))

      )

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