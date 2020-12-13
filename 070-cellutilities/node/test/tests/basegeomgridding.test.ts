import "mocha";

import { expect } from "chai";

import { basegeomgriddingConfig } from "./common";

import { process$ } from "../../src/lib/basegeomgridding";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(basegeomgriddingConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "gridderJob",
      "zoom"
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

    observables: [ process$(basegeomgriddingConfig) ],

    assertions: [ (o: number) => expect(o).to.be.equal(12) ],

    verbose: false

  })

});
