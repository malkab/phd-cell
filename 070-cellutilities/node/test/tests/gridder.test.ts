import "mocha";

import { expect } from "chai";

import { gridderConfig } from "./common";

import { process$ } from "../../src/lib/gridder";

import { rxMochaTests } from "@malkab/ts-utils";

/**
 *
 * Read parameters from config file.
 *
 */
describe("Read parameters from config file", function() {

  it("Read parameters from config file", function() {

    expect(Object.keys(gridderConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "cell",
      "maxZoom",
      "drillDown",
      "gridderTask"
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

    observables: [ process$(gridderConfig) ],

    assertions: [ (o: number) => expect(o).to.be.equal(12) ],

    verbose: false

  })

});
