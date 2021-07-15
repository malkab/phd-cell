import "mocha";

import { expect } from "chai";

import { exportConfig } from "./common";

import { process$ } from "../../src/lib/export";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(exportConfig)).to.deep.equal([
      "cellPg",
      "mvName",
      "variableKeys",
      "minZoom",
      "maxZoom",
      "schema",
      "pgSqlDataTypes",
      "addNullityFields",
      "excludeNullityFields",
      "verbose"
    ]);

  });

});

/**
 *
 * Run script.
 *
 */
 describe("Run script", function() {

  rxMochaTests({

    testCaseName: "Run script",

    observables: [ process$(exportConfig) ],

    assertions: [ (o: number) => expect(o).to.be.not.undefined ],

    verbose: false

  })

});
