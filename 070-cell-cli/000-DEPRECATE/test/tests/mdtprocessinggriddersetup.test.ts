import "mocha";

import { expect } from "chai";

import { mdtProcessingGridderSetUpConfig } from "./common";

import { process$ } from "../../src/lib/griddersetup";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(mdtProcessingGridderSetUpConfig)).to.deep.equal([
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

    timeout: 300000,

    testCaseName: "Run script",

    observables: [ process$(mdtProcessingGridderSetUpConfig) ],

    assertions: [ (o: number) => expect(o).to.be.not.undefined ],

    verbose: false

  })

});
