import "mocha";

import { expect } from "chai";

import { pointAggregationsGridderSetUpConfig } from "./common";

import { process$ } from "../../src/lib/griddersetup";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(pointAggregationsGridderSetUpConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "gridderTask",
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

    observables: [ process$(pointAggregationsGridderSetUpConfig) ],

    assertions: [ (o: number) => expect(o).to.be.not.undefined ],

    verbose: false

  })

});
