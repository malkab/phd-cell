import "mocha";

import { expect } from "chai";

import { coveringCellsConfig } from "./common";

import { process$ } from "../../src/lib/coveringcells";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(coveringCellsConfig)).to.deep.equal([
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

    observables: [ process$(coveringCellsConfig) ],

    assertions: [ (o: number) => expect(o).to.be.equal(20) ],

    verbose: false

  })

});
