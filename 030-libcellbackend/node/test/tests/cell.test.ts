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
describe("Center", function() {

  rxMochaTests({

    testCaseName: "Center",

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

/**
 *
 * Clone.
 *
 */
describe("Clone", function() {

  it("Cell clone", function() {

    const c: Cell = testCell[0].clone();

    expect(c.asString).to.be.equal(testCell[0].asString);
    expect(c.offset).to.be.equal(testCell[0].offset);

  })

})

/**
 *
 * Offset.
 *
 */
describe("Offset", function() {

  const c: Cell = testCell[1];

  it("Positive offset", function() {

    const center: Coordinate = testCell[1].center;

    // Without offset

    expect(center.epsg, "Center EPSG").to.be.equal("3035");
    expect(center.x, "Center x").to.be.equal(2965000);
    expect(center.y, "Center y").to.be.equal(1825000);

    let corners: any = c.corners;

    expect(corners.lowerLeft.epsg, "lowerLeft EPSG").to.be.equal("3035");
    expect(corners.lowerLeft.x, "lowerLeft x").to.be.equal(2960000);
    expect(corners.lowerLeft.y, "lowerLeft y").to.be.equal(1820000);

    expect(corners.upperLeft.epsg, "upperLeft EPSG").to.be.equal("3035");
    expect(corners.upperLeft.x, "upperLeft x").to.be.equal(2960000);
    expect(corners.upperLeft.y, "upperLeft y").to.be.equal(1830000);

    expect(corners.upperRight.epsg, "upperRight EPSG").to.be.equal("3035");
    expect(corners.upperRight.x, "upperRight x").to.be.equal(2970000);
    expect(corners.upperRight.y, "upperRight y").to.be.equal(1830000);

    expect(corners.lowerRight.epsg, "lowerRight EPSG").to.be.equal("3035");
    expect(corners.lowerRight.x, "lowerRight x").to.be.equal(2970000);
    expect(corners.lowerRight.y, "lowerRight y").to.be.equal(1820000);

    c.offset = 10;

    corners = c.corners;

    expect(center.epsg, "Positive center EPSG").to.be.equal("3035");
    expect(center.x, "Positive center x").to.be.equal(2965000);
    expect(center.y, "Positive center y").to.be.equal(1825000);

    expect(corners.lowerLeft.epsg, "Positive lowerLeft EPSG").to.be.equal("3035");
    expect(corners.lowerLeft.x, "Positive lowerLeft x").to.be.equal(2960000-10);
    expect(corners.lowerLeft.y, "Positive lowerLeft y").to.be.equal(1820000-10);

    expect(corners.upperLeft.epsg, "Positive upperLeft EPSG").to.be.equal("3035");
    expect(corners.upperLeft.x, "Positive upperLeft x").to.be.equal(2960000-10);
    expect(corners.upperLeft.y, "Positive upperLeft y").to.be.equal(1830000+10);

    expect(corners.upperRight.epsg, "Positive upperRight EPSG").to.be.equal("3035");
    expect(corners.upperRight.x, "Positive upperRight x").to.be.equal(2970000+10);
    expect(corners.upperRight.y, "Positive upperRight y").to.be.equal(1830000+10);

    expect(corners.lowerRight.epsg, "Positive lowerRight EPSG").to.be.equal("3035");
    expect(corners.lowerRight.x, "Positive lowerRight x").to.be.equal(2970000+10);
    expect(corners.lowerRight.y, "Positive lowerRight y").to.be.equal(1820000-10);

  })

  it("Negative offset", function() {

    c.offset = 0;
    const center: Coordinate = testCell[1].center;

    // Without offset

    expect(center.epsg, "center EPSG").to.be.equal("3035");
    expect(center.x, "center x").to.be.equal(2965000);
    expect(center.y, "center y").to.be.equal(1825000);

    let corners: any = c.corners;

    expect(corners.lowerLeft.epsg, "lowerLeft EPSG").to.be.equal("3035");
    expect(corners.lowerLeft.x, "lowerLeft x").to.be.equal(2960000);
    expect(corners.lowerLeft.y, "lowerLeft y").to.be.equal(1820000);

    expect(corners.upperLeft.epsg, "upperLeft EPSG").to.be.equal("3035");
    expect(corners.upperLeft.x, "upperLeft x").to.be.equal(2960000);
    expect(corners.upperLeft.y, "upperLeft y").to.be.equal(1830000);

    expect(corners.upperRight.epsg, "upperRight EPSG").to.be.equal("3035");
    expect(corners.upperRight.x, "upperRight x").to.be.equal(2970000);
    expect(corners.upperRight.y, "upperRight y").to.be.equal(1830000);

    expect(corners.lowerRight.epsg, "lowerRight EPSG").to.be.equal("3035");
    expect(corners.lowerRight.x, "lowerRight x").to.be.equal(2970000);
    expect(corners.lowerRight.y, "lowerRight y").to.be.equal(1820000);

    c.offset = -10;

    corners = c.corners;

    expect(center.epsg, "Negative center EPSG").to.be.equal("3035");
    expect(center.x, "Negative center x").to.be.equal(2965000);
    expect(center.y, "Negative center y").to.be.equal(1825000);

    expect(corners.lowerLeft.epsg, "Negative lowerLeft EPSG").to.be.equal("3035");
    expect(corners.lowerLeft.x, "Negative lowerLeft x").to.be.equal(2960000+10);
    expect(corners.lowerLeft.y, "Negative lowerLeft y").to.be.equal(1820000+10);

    expect(corners.upperLeft.epsg, "Negative upperLeft EPSG").to.be.equal("3035");
    expect(corners.upperLeft.x, "Negative upperLeft x").to.be.equal(2960000+10);
    expect(corners.upperLeft.y, "Negative upperLeft y").to.be.equal(1830000-10);

    expect(corners.upperRight.epsg, "Negative upperRight EPSG").to.be.equal("3035");
    expect(corners.upperRight.x, "Negative upperRight x").to.be.equal(2970000-10);
    expect(corners.upperRight.y, "Negative upperRight y").to.be.equal(1830000-10);

    expect(corners.lowerRight.epsg, "Negative lowerRight EPSG").to.be.equal("3035");
    expect(corners.lowerRight.x, "Negative lowerRight x").to.be.equal(2970000-10);
    expect(corners.lowerRight.y, "Negative lowerRight y").to.be.equal(1820000+10);

  })

})
