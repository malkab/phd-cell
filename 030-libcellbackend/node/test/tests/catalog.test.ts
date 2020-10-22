import "mocha";

import { expect } from "chai";

import { rxMochaTests, OrmError } from "@malkab/ts-utils";

import { CatalogBackend } from "../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import { cellPg, cellRawDataPg } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

/**
 *
 * Create Poblacion catalogs.
 *
 */
describe("Create Poblacion catalogs", function() {

  const scen: CatalogBackend = new CatalogBackend({ id: "sc_codigo" });
  const prov: CatalogBackend = new CatalogBackend({ id: "provincia" });
  const muni: CatalogBackend = new CatalogBackend({ id: "municipio" });
  const nucp: CatalogBackend = new CatalogBackend({ id: "nuc_pobla" });
  const nuc_pob_nivel: CatalogBackend = new CatalogBackend({ id: "nuc_pob_nivel" });

  rxMochaTests({

    testCaseName: "Create Poblacion catalogs",

    observable: rx.concat(

      // 005: Clear the database
      cellPg.executeQuery$("delete from cell_meta.catalog;"),

      // 010: Insert catalogs
      rx.zip(
        scen.pgInsert$(cellPg),
        prov.pgInsert$(cellPg),
        muni.pgInsert$(cellPg),
        nucp.pgInsert$(cellPg),
        nuc_pob_nivel.pgInsert$(cellPg)
      ),

      // 020: Build sección censal catalog
      CatalogBackend.get$(cellPg, "sc_codigo")
      .pipe(

        rxo.concatMap((o: CatalogBackend) => o.build(cellRawDataPg,
          "select sc_codigo as item from poblacion.poblacion")),

        rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg))

      ),

      // 030: Build provincia catalog
      CatalogBackend.get$(cellPg, "provincia")
      .pipe(

        rxo.concatMap((o: CatalogBackend) => o.build(cellRawDataPg,
          "select provincia as item from poblacion.poblacion")),

        rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg))

      ),

      // 040: Build municipio catalog
      CatalogBackend.get$(cellPg, "municipio")
      .pipe(

        rxo.concatMap((o: CatalogBackend) => o.build(cellRawDataPg,
          "select municipio as item from poblacion.poblacion")),

        rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg))

      ),

      // 050: Build nucleo poblacion catalog
      CatalogBackend.get$(cellPg, "nuc_pobla")
      .pipe(

        rxo.concatMap((o: CatalogBackend) => o.build(cellRawDataPg,
          "select nuc_pob as item from poblacion.poblacion")),

        rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg))

      ),

      // 060: Build nucleo poblacion nivel catalog
      CatalogBackend.get$(cellPg, "nuc_pob_nivel")
      .pipe(

        rxo.concatMap((o: CatalogBackend) => o.build(cellRawDataPg,
          "select nuc_pob_nivel as item from poblacion.poblacion")),

        rxo.concatMap((o: CatalogBackend) => o.pgUpdate$(cellPg))

      )

    ),

    assertions: [

      // 005: Clear the database
      (o: QueryResult) => {

        expect(o.command).to.be.equal("DELETE");
        // expect(o.rowCount).to.be.equal(5);

      },

      // 010: Insert catalogs
      (o: CatalogBackend) => {

        expect(o[0].id).to.be.equal("sc_codigo")

      },

      // 020: Build sección censal catalog
      (o: CatalogBackend) => {

        expect(o.forward["4109101042"]).to.be.equal("ea87");
        expect(o.backward["ea87"]).to.be.equal("4109101042");

      },

      // 030: Build provincia catalog
      (o: CatalogBackend) => {

        expect(o.forward["Jaén"]).to.be.equal("a");
        expect(o.backward["a"]).to.be.equal("Jaén");

      },

      // 040: Build municipio catalog
      (o: CatalogBackend) => {

        expect(o.forward["Jaén"]).to.be.equal("ae3");
        expect(o.backward["ae3"]).to.be.equal("Jaén");

      },

      // 050: Build nucleo poblacion catalog
      (o: CatalogBackend) => {

        expect(o.forward["Jaén"]).to.be.equal("ae35");
        expect(o.backward["ae35"]).to.be.equal("Jaén");

      },

      // 060: Build nucleo poblacion nivel catalog
      (o: CatalogBackend) => {

        expect(o.forward["CAB"]).to.be.equal("3");
        expect(o.backward["3"]).to.be.equal("CAB");

      }

    ],

    verbose: false

  })

})
