import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe("cell-utilities", () => {

  describe("\n\n  --- init.test ---\n",
    () => require("./tests/init.test"));

  // DiscretePolyTopArea

  // describe("\n\n  --- discretepolytopareacoveringcells.test ---\n",
  //   () => require("./tests/discretepolytopareacoveringcells.test"));

  // describe("\n\n  --- discretepolytopareagriddersetup.test ---\n",
  //   () => require("./tests/discretepolytopareagriddersetup.test"));

  // describe("\n\n  --- discretepolytopareagridder.test ---\n",
  //   () => require("./tests/discretepolytopareagridder.test"));

  // DiscretePolyAreaSummary

  // describe("\n\n  --- discretepolyareasummarycoveringcells.test ---\n",
  //   () => require("./tests/discretepolyareasummarycoveringcells.test"));

  // describe("\n\n  --- discretepolyareasummarygriddersetup.test ---\n",
  //   () => require("./tests/discretepolyareasummarygriddersetup.test"));

  describe("\n\n  --- discretepolyareasummarygridder.test ---\n",
    () => require("./tests/discretepolyareasummarygridder.test"));

});
