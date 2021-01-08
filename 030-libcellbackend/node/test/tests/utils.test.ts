import "mocha";

import { expect } from "chai";

import { processTemplate, idw } from "../../src/index";

/**
 *
 * processTemplate.
 *
 */
describe("processTemplate", function() {

  it('processTemplate', function() {

    expect(processTemplate('This is {{{a}}} test.', { a: "the" }))
      .to.be.equal("This is the test.");

  });

})

/**
 *
 * idw.
 *
 */
describe("idw", function() {

  it('idw', function() {

    expect(idw([ 1, 2, 4 ], [ 1, 2, 4 ], 2, 2)).to.be.equal(1.33);

  });

})
