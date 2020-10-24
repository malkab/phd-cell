import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { VectorBackend } from "../../src/index";

import { vectorPob, cellPg } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

/**
 *
 * Create población vector.
 *
 */
describe("Create población vector", function() {

  rxMochaTests({

    testCaseName: "Create población vector",

    observable: rx.concat(

      vectorPob.pgInsert$(cellPg)
      .pipe(

        rxo.concatMap((o: VectorBackend) =>
          VectorBackend.get$(cellPg, vectorPob.vectorId)),

      )

    ),

    assertions: [

      (o: VectorBackend) => {

        expect(o.name).to.be.equal("Población");

      }

    ],

    verbose: false

  })

})
