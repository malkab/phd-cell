import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  PointIdwGridderTask, gridderTaskGet$, Cell
} from "../../../src/index";

import {
  cellPgConn, cellRawDataConn, testCell_4_270_329, eugrid, testCell_5_108_130,
  testCell_3_54_65, testCell_2_25_32, testCell_2_24_31, cellFamily_2_27_32,
  testCell_2_28_30, testCell_7_2160_2560, testCell_8_10800_12800,
  mdtGridderTask, logger, testCell_9_54000_64000, testCell_6_216_260
} from "../common";

import * as rx from "rxjs";

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

      // Cell family (2,27,32)
      rx.zip(...cellFamily_2_27_32.map((x: Cell) => {

        return mdtGridderTask
          .computeCell$(cellRawDataConn, cellPgConn,
            x, x.zoom === 9 ? x.zoom : x.zoom + 1, logger);

      })),

      // Full coverage, single municipio
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, cellFamily_2_27_32[0], 3, logger),
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
        .computeCell$(cellRawDataConn, cellPgConn, testCell_3_54_65, 4, logger),
      // Full coverage, single municipio
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_4_270_329, 5, logger),
      // Level 5
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_5_108_130, 6, logger),
      // Level 6
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_6_216_260, 7, logger),
      // Level 7
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_7_2160_2560, 8, logger),
      // Level 8
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_8_10800_12800, 9, logger),
      // Level 9
      mdtGridderTask
        .computeCell$(cellRawDataConn, cellPgConn, testCell_9_54000_64000, 9, logger)

    ],

    assertions: [

      (o: any) => {

        const results: number[] = [ 4, 25, 4, 4, 4, 25, 25, 0 ];

        o.map((x: any, i: number) => {
          expect(x.length).to.be.deep.equal(results[i]);
        })

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(25);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(4);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(25);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(25);

      },

      (o: any) => {

        expect(o.length).to.be.deep.equal(0);

      }


    ],

    verbose: false,

    active: true

  })

})
