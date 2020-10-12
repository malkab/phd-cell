// This are the tests

// Mocha and Chai imports
import { expect } from "chai";
import "mocha";

console.log("Running Mocha tests...");

// Debugger stops here
debugger;

describe("sum", () => {

    it("Return type", () => {
        expect(2 + 2).to.deep.equal(4);
    });

});