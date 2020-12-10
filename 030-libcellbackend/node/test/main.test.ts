import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe("libcellbackend", () => {

  // describe("\n\n  --- pgconnection.test ---\n",
  //   () => require("./tests/pgconnection.test"));

  // describe("\n\n  --- griddertask.test ---\n",
  //   () => require("./tests/griddertask.test"));

  // describe("\n\n  --- variable.test ---\n",
  //   () => require("./tests/variable.test"));

  // describe("\n\n  --- catalog.test ---\n",
  //   () => require("./tests/catalog.test"));

  // describe("\n\n  --- grid.test ---\n",
  //   () => require("./tests/grid.test"));

  // describe("\n\n  --- cell.test ---\n",
  //   () => require("./tests/cell.test"));

  // describe("\n\n  --- discretepolytopareagridder.test ---\n",
  //   () => require("./tests/discretepolytopareagridder.test"));

  describe("\n\n  --- gridderjob.test ---\n",
    () => require("./tests/gridderjob.test"));

});
