import "mocha";

import { expect } from "chai";

import { pointAggregationsGridderConfig } from "./common";

import { process$ } from "../../src/lib/gridder";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(pointAggregationsGridderConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "gridderTask",
      "cells",
      "targetZoom",
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

    timeout: 3000000,

    testCaseName: "Run script",

    observables: [ process$(pointAggregationsGridderConfig) ],

    assertions: [ (o: number) => expect(o).to.be.undefined ],

    verbose: false

  })

});
