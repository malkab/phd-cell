import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyAreaSummaryGridderTask, gridderTaskGet$
} from "../../../src/index";

import {
  cellPgConn, cellRawDataConn, testCell_4_270_329,
  testCell_3_54_65, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31,
  testCell_2_28_30,
  hicAreaSummaryGridderTask, logger
} from "../common";



/**
 *
 * DiscretePolyAreaSummaryGridderTask pgInsert$.
 *
 */
describe("hicAreaSummaryGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "hicAreaSummaryGridderTask pgInsert$",

    observables: [ hicAreaSummaryGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: DiscretePolyAreaSummaryGridderTask) => expect(o.name)
        .to.be.equal("Desglose de área de Hábitats de Interés Comunitario (HIC)")

    ],

    verbose: false,

    active: true

  })

})

// /**
//  *
//  * hicAreaSummaryGridderTask get$.
//  *
//  */
describe("hicAreaSummaryGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "hicAreaSummaryGridderTask get$",

    observables: [ gridderTaskGet$(cellPgConn, "hicAreaSummary") ],

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
describe("hicAreaSummaryGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "hicAreaSummaryGridderTask setup$",

    observables: [ hicAreaSummaryGridderTask.setup$(cellRawDataConn, cellPgConn) ],

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
describe("DiscretePolyAreaSummaryGridderTaskBackend computeCell$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTaskBackend computeCell$",

    timeout: 300000,

    observables: [

      // Full coverage, single municipio
      hicAreaSummaryGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_27_32, 4, logger),
      // Partial coverage, several municipios
      hicAreaSummaryGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_24_31, 3, logger),
      // Full coverage, several municipios
      hicAreaSummaryGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_28_30, 3, logger),
      // Void cell
      hicAreaSummaryGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_25_32, 3, logger),
      // Full coverage, single municipio
      hicAreaSummaryGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_3_54_65, 6, logger),
      // Full coverage, single municipio
      hicAreaSummaryGridderTask
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

        expect(o.length, "Child cells for 2,28,30").to.be.equal(4);

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
