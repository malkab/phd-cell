import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  GridderJob, Cell,
  gridderTaskGet$, GridderTask, PointIdwGridderTask
} from "../../../src/index";

import {
  cellPgConn, cellRawDataConn, eugrid,
  logger, mdtGridderTask, gridderJobPointIdw
} from "../common";

import * as rxo from "rxjs/operators";

/**
 *
 * mdtGridderTask pgInsert$.
 *
 */
describe("mdtGridderTask pgInsert$", function() {

  rxMochaTests({

    testCaseName: "mdtGridderTask pgInsert$",

    observables: [ mdtGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: PointIdwGridderTask) =>
        expect(o.name).to.be.equal("Interpolación MDT con IDW")

    ],

    verbose: false

  })

})

/**
 *
 * gridderJobTopArea pgInsert$.
 *
 */
describe("gridderJobTopArea pgInsert$", function() {

  rxMochaTests({

    testCaseName: "gridderJobTopArea pgInsert$",

    observables: [ gridderJobPointIdw.pgInsert$(cellPgConn) ],

    assertions: [

      (o: GridderJob) =>
        expect(o.gridderJobId).to.be.equal("mdtPointIdw")

    ],

    verbose: false

  })

})

// /**
//  *
//  * gridderJobTopArea get and area retrieval.
//  *
//  */
// describe("gridderJobTopArea get and area retrieval", function() {

//   rxMochaTests({

//     testCaseName: "gridderJobTopArea get and area retrieval",

//     observables: [

//       GridderJob.get$(cellPgConn, "gridderJobTopArea")
//       .pipe(

//         rxo.concatMap((o: GridderJob) =>
//           o.getArea$(cellRawDataConn, cellPgConn, eugrid))

//       )

//     ],

//     assertions: [

//       (o: GridderJob) =>
//         expect(o.gridderJobId).to.be.equal("gridderJobTopArea")

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * Get coverage of target area at zoom 0.
//  *
//  */
// describe("Get coverage of target area at zoom 0", function() {

//   rxMochaTests({

//     testCaseName: "Get coverage of target area at zoom 0",

//     observables: [

//       GridderJob.get$(cellPgConn, "gridderJobTopArea")
//       .pipe(

//         rxo.concatMap((o: GridderJob) =>
//           o.getCoveringCells$(cellPgConn, eugrid, 0))

//       )

//     ],

//     assertions: [

//       (o: GridderJob) =>
//         expect(o).to.be.equal(7)

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * Get coverage of target area at zoom 1.
//  *
//  */
// describe("Get coverage of target area at zoom 1", function() {

//   rxMochaTests({

//     testCaseName: "Get coverage of target area at zoom 1",

//     observables: [

//       GridderJob.get$(cellPgConn, "gridderJobTopArea")
//       .pipe(

//         rxo.concatMap((o: GridderJob) =>
//           o.getCoveringCells$(cellPgConn, eugrid, 1))

//       )

//     ],

//     assertions: [

//       (o: GridderJob) =>
//         expect(o).to.be.equal(12)

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * setup$.
//  *
//  */
// describe("setup$", function() {

//   rxMochaTests({

//     testCaseName: "setup$",

//     observables: [

//       gridderTaskGet$(cellPgConn, "municipioDiscretePolyTopArea")
//       .pipe(

//         rxo.concatMap((o: GridderTask) =>
//           o.setup$(cellRawDataConn, cellPgConn, logger)),

//       )

//     ],

//     assertions: [

//       (o: GridderTask) => expect(o.name).to.be.equal("Municipio máxima área")

//     ],

//     verbose: false,

//     active: true

//   })

// })

// /**
//  *
//  * computeCell$.
//  *
//  */
// describe("computeCell$", function() {

//   rxMochaTests({

//     testCaseName: "computeCell$",

//     observables: [

//       GridderJob.get$(cellPgConn, "gridderJobTopArea")
//       .pipe(

//         rxo.concatMap((o: GridderJob) => o.getGridderTask$(cellPgConn)),

//         rxo.concatMap((o: GridderJob) => o.computeCells$(
//           cellPgConn,
//           cellRawDataConn,
//           [
//             new Cell({
//               gridId: "eu-grid",
//               zoom: 1,
//               x: 1,
//               y: 6,
//             }),
//             new Cell({
//               gridId: "eu-grid",
//               zoom: 1,
//               x: 2,
//               y: 6,
//             }),
//             new Cell({
//               gridId: "eu-grid",
//               zoom: 1,
//               x: 2,
//               y: 5,
//             })
//           ], 3, logger)
//         )

//       )

//     ],

//     // This test must not return any stream
//     assertions: [],

//     verbose: false,

//     active: true

//   })

// })
