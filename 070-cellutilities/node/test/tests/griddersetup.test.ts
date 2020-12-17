import "mocha";

import { expect } from "chai";

import { gridderSetUpConfig } from "./common";

import { process$ } from "../../src/lib/gridder";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(gridderSetUpConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "gridderTask",
      "gridderJob",
      "cell",
      "targetZoom"
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

    observables: [ process$(gridderSetUpConfig) ],

    assertions: [ (o: number) => expect(o).to.be.equal(12) ],

    verbose: true

  })

});
