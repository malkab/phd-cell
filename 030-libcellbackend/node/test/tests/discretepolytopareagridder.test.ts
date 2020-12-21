import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  DiscretePolyTopAreaGridderTask, gridderTaskGet$
} from "../../src/index";

import {
  cellPgConn, cellRawDataConn, testCell_4_270_329,
  testCell_3_54_65, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31,
  testCell_2_28_30,
  municipioDiscretePolyTopAreaGridderTask, logger
} from "./common";

/**
 *
 * DiscretePolyTopAreaGridderTask pgInsert$.
 *
 */
describe("DiscretePolyTopAreaGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask pgInsert$",

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * DiscretePolyTopAreaGridderTask get$.
 *
 */
describe("DiscretePolyTopAreaGridderTask get$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTask get$",

    observables: [ gridderTaskGet$(cellPgConn, "municipioDiscretePolyTopArea") ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.name).to.be.equal("Municipio máxima área");

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
describe("DiscretePolyTopAreaGridderTaskBackend setup$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTaskBackend setup$",

    observables: [ municipioDiscretePolyTopAreaGridderTask.setup$(cellRawDataConn, cellPgConn) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

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
describe("DiscretePolyTopAreaGridderTaskBackend computeCell$", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTaskBackend computeCell$",

    timeout: 300000,

    observables: [

      // Full coverage, single municipio
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_27_32, 4, logger),
      // Partial coverage, several municipios
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_24_31, 3, logger),
      // Full coverage, several municipios
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_28_30, 3, logger),
      // Void cell
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_25_32, 3, logger),
      // Full coverage, single municipio
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_3_54_65, 6, logger),
      // Full coverage, single municipio
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_4_270_329, 7, logger)

    ],

    assertions: [

      (o: any) => {

        expect(o.length, "Child cells for 2,27,32").to.be.equal(0);

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

        expect(o.length, "Child cells for 3,54,65").to.be.equal(0);

      },

      (o: any) => {

        expect(o.length, "Child cells for 4,270,329").to.be.equal(0);

      }

    ],

    verbose: false,

    active: true

  })

})
