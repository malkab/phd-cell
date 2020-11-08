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

  // describe("\n\n  --- variablebackend.test ---\n",
  //   () => require("./tests/variablebackend.test"));

  // describe("\n\n  --- catalogbackend.test ---\n",
  //   () => require("./tests/catalogbackend.test"));

  // describe("\n\n  --- gridbackend.test ---\n",
  //   () => require("./tests/gridbackend.test"));

  // describe("\n\n  --- cellbackend.test ---\n",
  //   () => require("./tests/cellbackend.test"));

  // describe("\n\n  --- discretepolytopareagridder.test ---\n",
  //   () => require("./tests/discretepolytopareagridder.test"));

  describe("\n\n  --- gridderjob.test ---\n",
    () => require("./tests/gridderjob.test"));

});
