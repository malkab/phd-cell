import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe('libcellbackend', () => {
  require("./tests/catalog.test");
});
