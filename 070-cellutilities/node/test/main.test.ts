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

  describe("\n\n  --- discretepolyareasummarycoveringcells.test ---\n",
    () => require("./tests/discretepolyareasummarycoveringcells.test"));

  describe("\n\n  --- discretepolyareasummarygriddersetup.test ---\n",
    () => require("./tests/discretepolyareasummarygriddersetup.test"));

  describe("\n\n  --- discretepolyareasummarygridder.test ---\n",
    () => require("./tests/discretepolyareasummarygridder.test"));

  // PointAggregations

  // describe("\n\n  --- pointaggregationscoveringcells.test ---\n",
  //   () => require("./tests/pointaggregationscoveringcells.test"));

  // describe("\n\n  --- pointaggregationsgriddersetup.test ---\n",
  //   () => require("./tests/pointaggregationsgriddersetup.test"));

  // describe("\n\n  --- pointaggregationsgridder.test ---\n",
  //   () => require("./tests/pointaggregationsgridder.test"));

  // PointIdwInterpolation

  // describe("\n\n  --- pointidwinterpolationcoveringcells.test ---\n",
  //   () => require("./tests/pointidwinterpolationcoveringcells.test"));

  // describe("\n\n  --- pointidwinterpolationgriddersetup.test ---\n",
  //   () => require("./tests/pointidwinterpolationgriddersetup.test"));

  // describe("\n\n  --- pointidwinterpolationgridder.test ---\n",
  //   () => require("./tests/pointidwinterpolationgridder.test"));

});
