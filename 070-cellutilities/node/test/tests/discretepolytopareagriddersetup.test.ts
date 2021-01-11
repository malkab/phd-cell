import "mocha";

import { expect } from "chai";

import { discretePolyTopAreaGridderSetUpConfig } from "./common";

import { process$ } from "../../src/lib/griddersetup";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(discretePolyTopAreaGridderSetUpConfig)).to.deep.equal([
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

    observables: [ process$(discretePolyTopAreaGridderSetUpConfig) ],

    assertions: [ (o: number) => expect(o).to.be.not.undefined ],

    verbose: false

  })

});
