import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridderTasks as gt, PgConnection, Grid } from "../../src/index";

import { cellPgConn, cellRawData, cellRawDataConn, eugrid, testCell_4_270_329, testCell_3_54_65, testCell_2_25_32, testCell_2_27_32, testCell_2_24_31, testCell_2_28_30, testCell_0_2_1, testCell_0_3_1, testCell_0_2_2, testCell_0_3_2, municipioDiscretePolyTopAreaGridderTask, clearDatabase$, cellRawDataExternalConn } from "./common";

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

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true

    ],

    verbose: true

  })

})

/**
 *
 * Insert Grid.
 *
 */
describe("GridBackend pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridBackend pgInsert$",

    observables: [ eugrid.pgInsert$(cellPgConn) ],

    assertions: [ (o: Grid) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Create PgConnection.
 *
 */
describe("Create PgConnection", function() {

  /**
   *
   * Create PgConnection.
   *
   */
  rxMochaTests({

    testCaseName: "Create PgConnection",

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})

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

      (o: gt.DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

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

      (o: gt.DiscretePolyTopAreaGridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

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
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_27_32, 4),
      // Partial coverage, several municipios
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_24_31, 3),
      // Full coverage, several municipios
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_28_30, 3),
      // Void cell
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_2_25_32, 3),
      // Full coverage, single municipio
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_3_54_65, 6),
      // Full coverage, single municipio
      municipioDiscretePolyTopAreaGridderTask.computeCell$(cellRawDataConn, cellPgConn, testCell_4_270_329, 7)

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
