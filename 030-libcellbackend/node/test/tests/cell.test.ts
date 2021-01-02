import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { Grid, Cell, Coordinate } from "../../src/index";

import {
  gridEu, clearDatabase$, pgConnCell, testCell
} from "./common";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

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
 * Insert Cell.
 *
 */
describe("Cell pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Cell pgInsert$",

    observables: [ rx.concat(

      gridEu.pgInsert$(pgConnCell),

      rx.zip(...testCell.map((o: Cell) => o.pgInsert$(pgConnCell)))

    ) ],

    assertions: [

      (o: Grid) => expect(o.name).to.be.equal("eu-grid"),

      (o: Cell[]) => {

        expect(o.length, "Number of cells generated").to.be.equal(8);

        expect(o[0].ewkt)
          .to.be.equal("SRID=3035;POLYGON((2970000 1820000,2980000 1820000,2980000 1830000,2970000 1830000,2970000 1820000))");

      }

    ],

    verbose: false

  })

})

/**
 *
 * Get child cells and pgInsert$ them.
 *
 */
describe("Get child cells and pgInsert$ them", function() {

  rxMochaTests({

    testCaseName: "Get child cells and pgInsert$ them",

    observables: [
      rx.of(testCell[0].getSubCells(4))
      .pipe(

        rxo.concatMap((o: Cell[]) => {

          return rx.zip(...o.map((i: Cell) => i.pgInsert$(pgConnCell)))

        })

      )
    ],

    assertions: [

      (o: Cell[]) => {

        expect(o.length).to.be.equal(100)

      }

    ],

    verbose: false

  })

})

/**
 *
 * drillDownClone$.
 *
 */
describe("drillDownClone$", function() {

  // Dummy data
  testCell.map((x: Cell) => x.data = { a: 10, b: 0 })

  rxMochaTests({

    testCaseName: "drillDownClone$",

    observables: [ testCell[1].drillDownClone$(pgConnCell, 4) ],

    assertions: [

      // Check only the first cell
      (o: Cell) => {
        expect(o.zoom).to.be.equal(4);
        expect(o.x).to.be.equal(260);
        expect(o.y).to.be.equal(320);
        expect(o.data).to.be.deep.equal({ a: 10, b: 0 })
      }

    ]

  })

})

/**
 *
 * drillDownClone$ again to add more data.
 *
 */
describe("drillDownClone$ again to add more data", function() {

  // Dummy data
  testCell.map((x: Cell) => x.data = { c: -10 })

  rxMochaTests({

    testCaseName: "drillDownClone$ again to add more data",

    observables: [ testCell[1].drillDownClone$(pgConnCell, 3) ],

    assertions: [

      // Check only the first cell
      (o: Cell) => {
        expect(o.zoom).to.be.equal(3);
        expect(o.x).to.be.equal(52);
        expect(o.y).to.be.equal(64);
        expect(o.data).to.be.deep.equal({ c: -10 })
      }

    ]

  })

})

/**
 *
 * center.
 *
 */
describe("center", function() {

  rxMochaTests({

    testCaseName: "center",

    observables: [ rx.of(testCell[1].center) ],

    assertions: [

      // Check only the first cell
      (o: Coordinate) => {

        expect(o.epsg).to.be.equal("3035");
        expect(o.x).to.be.equal(2965000);
        expect(o.y).to.be.equal(1825000);

      }

    ]

  })

})
