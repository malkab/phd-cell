import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointAggregationsGridderTask, gridderTaskGet$, Cell
} from "../../../src/index";

import {
  pgConnCell, pgConnCellRawData,
  testCell, logger, gridderTaskPointAggregationsPoblacion
} from "../common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * PointAggregationsGridderTask pgInsert$.
 *
 */
describe("PointAggregationsGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask pgInsert$",

    observables: [ gridderTaskPointAggregationsPoblacion.pgInsert$(pgConnCell) ],

    assertions: [

      (o: PointAggregationsGridderTask) =>
        expect(o.name).to.be.equal("Estadísticas de población")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * PointAggregationsGridderTask get$.
 *
 */
describe("PointAggregationsGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask get$",

    observables: [ gridderTaskGet$(pgConnCell, "gridderTaskPointAggregationsPoblacion") ],

    assertions: [

      (o: PointAggregationsGridderTask) => {

        expect(o.name).to.be.equal("Estadísticas de población");

        expect(o.variableDefinitions[0]).to.be.deep.equal({
          "description": "Población total del año 2002.",
          "expression": "sum(ptot02)",
          "name": "Población total 2002"
        });

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
describe("PointAggregationsGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask setup$",

    observables: [ gridderTaskPointAggregationsPoblacion.setup$(pgConnCellRawData, pgConnCell) ],

    assertions: [

      (o: PointAggregationsGridderTask) => expect(o.name).to.be.equal("Estadísticas de población")

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
describe("PointAggregationsGridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask computeCell$",

    timeout: 300000,

    observables: [

      gridderTaskGet$(pgConnCell, "gridderTaskPointAggregationsPoblacion")
      .pipe(

        rxo.concatMap((o: PointAggregationsGridderTask) =>
          rx.zip(...testCell.map((x: Cell) =>
            o.computeCell$(
              pgConnCellRawData, pgConnCell, x, 5, logger))))

      )

    ],

    assertions: [

      (o: Cell[][]) => {

        expect(o.map((x: Cell[]) => x.length), "Child cells")
          .to.be.deep.equal([ 4, 4, 4, 0, 0, 0, 0, 0 ]);

      }

    ],

    verbose: false,

    active: true

  })

})