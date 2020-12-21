import "mocha";

import { expect } from "chai";

import { discretePolyTopAreaGridderConfig } from "./common";

import { process$ } from "../../src/lib/gridder";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(discretePolyTopAreaGridderConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "gridderTask",
      "gridderJob",
      "cells",
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

    observables: [ process$(discretePolyTopAreaGridderConfig) ],

    assertions: [ (o: number) => expect(o).to.be.undefined ],

    verbose: false

  })

});
