import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { CatalogBackend, PgConnection, GridBackend, CellBackend } from "../../src/index";

import { cellRawDataConn, gridBackend, clearDatabase$, catScen, catProv, catMuni, catNucp, catNucPobNivel, cellPg, cellBackends } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

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

      gridBackend.pgInsert$(cellPg),

      rx.zip(...cellBackends.map((o: CellBackend) => o.pgInsert$(cellPg)))

    ),

    assertions: [

      (o: GridBackend) => expect(o.name).to.be.equal("eu-grid"),

      (o: CellBackend[]) => {

        expect(o.length).to.be.equal(225);

        expect(o[0].ewkt).to.be.equal("SRID=3035;POLYGON((2700000 1500000,2800000 1500000,2800000 1600000,2700000 1600000,2700000 1500000))");

      }

    ],

    verbose: false

  })

})
