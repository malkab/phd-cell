import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe("libcellbackend", () => {

  describe("\n\n  --- cleardatabase.test ---\n",
    () => require("./tests/cleardatabase.test"));

  describe("\n\n  --- pgconnection.test ---\n",
    () => require("./tests/pgconnection.test"));

  describe("\n\n  --- catalogbackend.test ---\n",
    () => require("./tests/catalogbackend.test"));

  describe("\n\n  --- variablebackend.test ---\n",
    () => require("./tests/variablebackend.test"));

  describe("\n\n  --- vectorbackend.test ---\n",
    () => require("./tests/vectorbackend.test"));

});
