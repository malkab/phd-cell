import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { VariableBackend } from "../../src/index";

import { varE001517, cellPg } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

/**
 *
 * Create variable varE001517.
 *
 */
describe("Create variable varE001517", function() {

  rxMochaTests({

    testCaseName: "Create variable varE001517",

    observable: rx.concat(

      varE001517.pgInsert$(cellPg)
      .pipe(

        rxo.concatMap((o: VariableBackend) =>
          VariableBackend.get$(cellPg, varE001517.variableId)),

      )

    ),

    assertions: [

      (o: VariableBackend) => {

        expect(o.name).to.be.equal("Edad 00-15 2017");

      }

    ],

    verbose: false

  })

})
