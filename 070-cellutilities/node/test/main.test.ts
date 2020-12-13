import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe("cell-utilities", () => {
  // describe("\n\n  --- basegeogridding.test ---\n", () => require("./tests/basegeomgridding.test"));
  describe("\n\n  --- gridder.test ---\n", () => require("./tests/gridder.test"));
});
