import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointAggregationsGridderTask, gridderTaskGet$
} from "../../../src/index";

import {
  cellPgConn, cellRawDataConn, testCell_4_270_329,
  testCell_3_54_65, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31,
  testCell_2_28_30,
  poblacionPointAggregationsGridderTask, logger
} from "../common";

/**
 *
 * PointAggregationsGridderTask pgInsert$.
 *
 */
describe("PointAggregationsGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTask pgInsert$",

    observables: [ poblacionPointAggregationsGridderTask.pgInsert$(cellPgConn) ],

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

    observables: [ gridderTaskGet$(cellPgConn, "poblacionPointAggregations") ],

    assertions: [

      (o: PointAggregationsGridderTask) => {

        expect(o.name).to.be.equal("Estadísticas de población");

        expect(o.gridId, "gridId").to.be.equal("eu-grid");

        expect(o.grid).to.be.undefined;

        expect(o.variables[0]).to.be.deep.equal({
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
describe("PointAggregationsGridderTaskBackend setup$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTaskBackend setup$",

    observables: [ poblacionPointAggregationsGridderTask.setup$(cellRawDataConn, cellPgConn) ],

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
describe("PointAggregationsGridderTaskBackend computeCell$", function() {

  rxMochaTests({

    testCaseName: "PointAggregationsGridderTaskBackend computeCell$",

    timeout: 300000,

    observables: [

      // Has data
      poblacionPointAggregationsGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_27_32, 4, logger),
      // Partial coverage, does not have data
      poblacionPointAggregationsGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_24_31, 3, logger),
      // Does not have data
      poblacionPointAggregationsGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_28_30, 3, logger),
      // Void cell
      poblacionPointAggregationsGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_25_32, 3, logger),
      // Does not have data
      poblacionPointAggregationsGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_3_54_65, 6, logger),
      // Does not have data
      poblacionPointAggregationsGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_4_270_329, 7, logger)

    ],

    assertions: [

      (o: any) => {

        expect(o.length, "Child cells for 2,27,32").to.be.equal(4);

      },

      (o: any) => {

        expect(o.length, "Child cells for 2,24,31").to.be.equal(4);

      },

      (o: any) => {

        expect(o.length, "Child cells for 2,28,32").to.be.equal(4);

      },

      (o: any) => {

        expect(o.length, "Child cells for 2,25,32").to.be.equal(0);

      },

      (o: any) => {

        expect(o.length, "Child cells for 3,54,65").to.be.equal(25);

      },

      (o: any) => {

        expect(o.length, "Child cells for 4,270,329").to.be.equal(4);

      }

    ],

    verbose: false,

    active: true

  })

})
