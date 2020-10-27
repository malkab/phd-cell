import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { CatalogBackend, PgConnection, GridBackend } from "../../src/index";

import { cellRawDataConn, gridBackend, clearDatabase$, catScen, catProv, catMuni, catNucp, catNucPobNivel, cellPg } from "./common";

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
 * Insert GridBackend.
 *
 */
describe("GridBackend pgInsert$", function() {

  rxMochaTests({

    testCaseName: "GridBackend pgInsert$",

    observable: gridBackend.pgInsert$(cellPg),

    assertions: [
      (o: GridBackend) => expect(o.name).to.be.equal("eu-grid") ],

    verbose: false

  })

})

// /**
//  *
//  * Create provincia Catalog.
//  *
//  */
// describe("Create provincia Catalog", function() {

//   rxMochaTests({

//     testCaseName: "Create provincia Catalog",

//     observable: rx.concat(

//       catProv.pgInsert$(cellPg)
//       .pipe(

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catProv.catalogId)),

//         rxo.concatMap((o: CatalogBackend) =>
//           PgConnection.get$(cellPg, "cellRawDataConn")),

//         rxo.concatMap((o: PgConnection) => catProv.build(o)),

//         rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg)),

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catProv.catalogId))

//       )

//     ),

//     assertions: [

//       (o: CatalogBackend) => {

//         expect(o.name).to.be.equal("Provincias");
//         expect(o.forward["Jaén"]).to.be.equal("a");
//         expect(o.backward["a"]).to.be.equal("Jaén");

//       }

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * Create municipio Catalog.
//  *
//  */
// describe("Create municipio Catalog", function() {

//   rxMochaTests({

//     testCaseName: "Create municipio Catalog",

//     observable: rx.concat(

//       catMuni.pgInsert$(cellPg)
//       .pipe(

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catMuni.catalogId)),

//         rxo.concatMap((o: CatalogBackend) =>
//           PgConnection.get$(cellPg, "cellRawDataConn")),

//         rxo.concatMap((o: PgConnection) => catMuni.build(o)),

//         rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg)),

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catMuni.catalogId))

//       )

//     ),

//     assertions: [

//       (o: CatalogBackend) => {

//         expect(o.name).to.be.equal("Municipios");
//         expect(o.forward["Jaén"]).to.be.equal("ae3");
//         expect(o.backward["ae3"]).to.be.equal("Jaén");

//       }

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * Create nucleo poblacion Catalog.
//  *
//  */
// describe("Create núcleo población Catalog", function() {

//   rxMochaTests({

//     testCaseName: "Create núcleo población Catalog",

//     observable: rx.concat(

//       catNucp.pgInsert$(cellPg)
//       .pipe(

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catNucp.catalogId)),

//         rxo.concatMap((o: CatalogBackend) =>
//           PgConnection.get$(cellPg, "cellRawDataConn")),

//         rxo.concatMap((o: PgConnection) => catNucp.build(o)),

//         rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg)),

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catNucp.catalogId))

//       )

//     ),

//     assertions: [

//       (o: CatalogBackend) => {

//         expect(o.name).to.be.equal("Núcleos población");
//         expect(o.forward["Jaén"]).to.be.equal("ae35");
//         expect(o.backward["ae35"]).to.be.equal("Jaén");

//       }

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * Create nivel núcleo población Catalog.
//  *
//  */
// describe("Create nivel núcleo población Catalog", function() {

//   rxMochaTests({

//     testCaseName: "Create nivel núcleo población Catalog",

//     observable: rx.concat(

//       catNucPobNivel.pgInsert$(cellPg)
//       .pipe(

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catNucPobNivel.catalogId)),

//         rxo.concatMap((o: CatalogBackend) =>
//           PgConnection.get$(cellPg, "cellRawDataConn")),

//         rxo.concatMap((o: PgConnection) => catNucPobNivel.build(o)),

//         rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg)),

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catNucPobNivel.catalogId))

//       )

//     ),

//     assertions: [

//       (o: CatalogBackend) => {

//         expect(o.name).to.be.equal("Niveles de núcleos de población");
//         expect(o.forward["CAB"]).to.be.equal("3");
//         expect(o.backward["3"]).to.be.equal("CAB");

//       }

//     ],

//     verbose: false

//   })

// })

// /**
//  *
//  * Create sección censal Catalog.
//  *
//  */
// describe("Create sección censal Catalog", function() {

//   rxMochaTests({

//     testCaseName: "Create sección censal Catalog",

//     observable: rx.concat(

//       catScen.pgInsert$(cellPg)
//       .pipe(

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catScen.catalogId)),

//         rxo.concatMap((o: CatalogBackend) =>
//           PgConnection.get$(cellPg, "cellRawDataConn")),

//         rxo.concatMap((o: PgConnection) => catScen.build(o)),

//         rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg)),

//         rxo.concatMap((o: CatalogBackend) =>
//           CatalogBackend.get$(cellPg, catScen.catalogId))

//       )

//     ),

//     assertions: [

//       (o: CatalogBackend) => {

//         expect(o.name).to.be.equal("Secciones censales");
//         expect(o.forward["4109101042"]).to.be.equal("ea87");
//         expect(o.backward["ea87"]).to.be.equal("4109101042");

//       }

//     ],

//     verbose: false

//   })

// })
