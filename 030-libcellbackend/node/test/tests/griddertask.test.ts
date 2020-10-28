import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { CatalogBackend, PgConnection, GridderTasks as gt } from "../../src/index";

import { clearDatabase$, testCell, cellBackends, cellPg, provinceDiscretePolyTopAreaGridderTask, provinceDiscretePolyAreaSummaryGridderTask, cellRawDataConn } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";
import { DiscretePolyTopAreaGridderTaskBackend } from "../../src/griddertasks";

// /**
//  *
//  * Initial database clearance.
//  *
//  */
// describe("Initial database clearance", function() {

//   rxMochaTests({

//     testCaseName: "Initial database clearance",

//     observable: clearDatabase$,

//     assertions: [ (o: boolean) => expect(o).to.be.true ]

//   })

// })

/**
 *
 * GridderTask tests.
 *
 */
describe("GridderTask ORM", function() {

})

/**
 *
 * DiscretePolyTopAreaGridderTaskBackend tests.
 *
 */
describe("DiscretePolyTopAreaGridderTaskBackend ORM", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyTopAreaGridderTaskBackend ORM",

    observable: rx.concat(

      cellRawDataConn.pgInsert$(cellPg),

      provinceDiscretePolyTopAreaGridderTask.pgInsert$(cellPg),

      gt.get$(cellPg, "provinceDiscretePolyTopArea")
      .pipe(

        rxo.concatMap((o: DiscretePolyTopAreaGridderTaskBackend) => {

          return o.computeCell(testCell)

        })

      )

    ),

    assertions: [

      (o: PgConnection) => expect(o.pgConnectionId).to.be.equal("cellRawDataConn"),

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) =>
        expect(o.name).to.be.equal("Provincia: máxima área"),

      (o: any) => {

        console.log("D: mnnnn", o);

        expect(o.rowCount).to.deep.equal(0);

      }

    ],

    verbose: false

  })

})

/**
 *
 * DiscretePolyAreaSummaryGridderTaskBackend tests.
 *
 */
describe("DiscretePolyAreaSummaryGridderTaskBackend ORM", function() {

  rxMochaTests({

    testCaseName: "DiscretePolyAreaSummaryGridderTaskBackend ORM",

    observable: rx.concat(

      provinceDiscretePolyAreaSummaryGridderTask.pgInsert$(cellPg),

      gt.get$(cellPg, "provinceDiscreteAreaSummary")

    ),

    assertions: [

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.name).to.be.equal("Desglose de área de provincias"),

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.discreteFields).to.deep.equal([ "provincia" ])

    ],

    verbose: false

  })

})
