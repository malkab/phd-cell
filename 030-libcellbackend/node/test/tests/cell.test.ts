import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { Grid, Cell } from "../../src/index";

import { eugrid, clearDatabase$, cellPgConn, cells, testCell_0_2_3 } from "./common";

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
 * Insert CellBackend.
 *
 */
describe("CellBackend pgInsert$", function() {

  rxMochaTests({

    testCaseName: "CellBackend pgInsert$",

    observables: [ rx.concat(

      eugrid.pgInsert$(cellPgConn),

      rx.zip(...cells.map((o: Cell) => o.pgInsert$(cellPgConn)))

    ) ],

    assertions: [

      (o: Grid) => expect(o.name).to.be.equal("eu-grid"),

      (o: Cell[]) => {

        expect(o.length, "Number of cells generated").to.be.equal(24);

        expect(o[0].ewkt).to.be.equal("SRID=3035;POLYGON((2700000 1500000,2800000 1500000,2800000 1600000,2700000 1600000,2700000 1500000))");

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

    observables: [ rx.of(testCell_0_2_3.getSubCells(2))
      .pipe(

        rxo.concatMap((o: Cell[]) => {

          return rx.zip(...o.map((i: Cell) => i.pgInsert$(cellPgConn)))

        })

      ) ],

    assertions: [

      (o: Cell[]) => {

        expect(o.length).to.be.equal(100)

      }

    ],

    verbose: false

  })

})
