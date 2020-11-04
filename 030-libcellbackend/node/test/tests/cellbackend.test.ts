import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { GridBackend, CellBackend } from "../../src/index";

import { gridBackend, clearDatabase$, cellPgConn, cellBackends, testCell_0_2_3 } from "./common";

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

    observable: clearDatabase$,

    assertions: [ (o: boolean) => expect(o).to.be.true ]

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

    observable: rx.concat(

      gridBackend.pgInsert$(cellPgConn),

      rx.zip(...cellBackends.map((o: CellBackend) => o.pgInsert$(cellPgConn)))

    ),

    assertions: [

      (o: GridBackend) => expect(o.name).to.be.equal("eu-grid"),

      (o: CellBackend[]) => {

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

    observable: rx.of(testCell_0_2_3.getSubCellBackends(2))
      .pipe(

        rxo.concatMap((o: CellBackend[]) => {

          return rx.zip(...o.map((i: CellBackend) => i.pgInsert$(cellPgConn)))

        })

      ),

    assertions: [

      (o: CellBackend[]) => {

        expect(o.length).to.be.equal(400)

      }

    ],

    verbose: false

  })

})
