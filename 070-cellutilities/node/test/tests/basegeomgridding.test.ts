import "mocha";

import { expect } from "chai";

import { basegeomgriddingConfig } from "./common";

import { process } from "../../src/lib/basegeomgridding";

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
      "gridderJob"
    ]);

  });

});

/**
 *
 * Run script.
 *
 */
describe("Run script", function() {

  it("Run script", function() {

    expect(process(basegeomgriddingConfig)).to.deep.equal([
      "cellPg",
      "sourcePg",
      "grid",
      "gridderJob"
    ]);

  });

});
