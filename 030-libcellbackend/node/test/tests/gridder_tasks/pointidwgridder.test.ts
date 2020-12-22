import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, gridderTaskGet$
} from "../../../src/index";

import {
  cellPgConn, cellRawDataConn, testCell_4_270_329,
  testCell_3_54_65, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31,
  testCell_2_28_30,
  mdtGridderTask, logger
} from "../common";

/**
 *
 * PointIdwGridderTask pgInsert$.
 *
 */
describe("PointIdwGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask pgInsert$",

    observables: [ mdtGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: PointIdwGridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * PointIdwGridderTask get$.
 *
 */
describe("PointIdwGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask get$",

    observables: [ gridderTaskGet$(cellPgConn, "mdtIdw") ],

    assertions: [

      (o: PointIdwGridderTask) => {

        expect(o.name).to.be.equal("Interpolación MDT con IDW");

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
 * PointIdwGridderTask setup$.
 *
 */
describe("PointIdwGridderTask setup$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask setup$",

    observables: [ mdtGridderTask.setup$(cellRawDataConn, cellPgConn) ],

    assertions: [

      (o: PointIdwGridderTask) => expect(o.name).to.be.equal("Interpolación MDT con IDW")

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
describe("PointIdwGridderTask computeCell$", function() {

  rxMochaTests({

    testCaseName: "PointIdwGridderTask computeCell$",

    timeout: 300000,

    observables: [

      // Full coverage, single municipio
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_27_32, 4, logger),
      // Partial coverage, several municipios
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_24_31, 3, logger),
      // Full coverage, several municipios
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_28_30, 3, logger),
      // Void cell
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_2_25_32, 3, logger),
      // Full coverage, single municipio
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_3_54_65, 6, logger),
      // Full coverage, single municipio
      mdtGridderTask
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

        expect(o.length, "Child cells for 2,25,32").to.be.equal(4);

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
