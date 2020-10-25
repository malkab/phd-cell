import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { CatalogBackend, PgConnection, GridderTasks as gt } from "../../src/index";

import { catScen, catProv, catMuni, catNucp, catNucPobNivel, cellPg, provinceDiscretePolyTopAreaGridderTask, provinceDiscretePolyAreaSummaryGridderTask } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

/**
 *
 * GridderTask tests.
 *
 */
describe("GridderTask ORM", function() {

})

/**
 *
 * DiscretePolygonTopAreaGridderTask tests.
 *
 */
describe("DiscretePolygonTopAreaGridderTaskBackend ORM", function() {

  rxMochaTests({

    testCaseName: "DiscretePolygonTopAreaGridderTaskBackend ORM",

    observable: rx.concat(

      provinceDiscretePolyTopAreaGridderTask.pgInsert$(cellPg),

      provinceDiscretePolyAreaSummaryGridderTask.pgInsert$(cellPg),

      gt.get$(cellPg, "provinceDiscreteAreaSummary"),

      gt.get$(cellPg, "provinceDiscretePolyTopArea")

    ),

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTaskBackend) =>
        expect(o.name).to.be.equal("Provincia: máxima área"),

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.name).to.be.equal("Desglose de área de provincias"),

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.discreteFields).to.deep.equal([ "provincia" ]),

      (o: gt.DiscretePolyAreaSummaryGridderTaskBackend) =>
        expect(o.discreteFields).to.deep.equal([ "provincia" ])

    ],

    verbose: false

  })

})
