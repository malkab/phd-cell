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
  describe("\n\n  --- discretepolytopareagriddersetup.test ---\n",
    () => require("./tests/discretepolytopareagriddersetup.test"));

  describe("\n\n  --- discretepolytopareagridder.test ---\n",
    () => require("./tests/discretepolytopareagridder.test"));

  // DiscretePolyAreaSummary
  describe("\n\n  --- discretepolyareasummarygriddersetup.test ---\n",
    () => require("./tests/discretepolyareasummarygriddersetup.test"));

  describe("\n\n  --- discretepolyareasummarygridder.test ---\n",
    () => require("./tests/discretepolyareasummarygridder.test"));

  // PointAggregations
  describe("\n\n  --- pointaggregationsgriddersetup.test ---\n",
    () => require("./tests/pointaggregationsgriddersetup.test"));

  describe("\n\n  --- pointaggregationsgridder.test ---\n",
    () => require("./tests/pointaggregationsgridder.test"));

  // PointIdwInterpolation
  describe("\n\n  --- pointidwinterpolationgriddersetup.test ---\n",
    () => require("./tests/pointidwinterpolationgriddersetup.test"));

  describe("\n\n  --- pointidwinterpolationgridder.test ---\n",
    () => require("./tests/pointidwinterpolationgridder.test"));

  // MdtProcessing
  describe("\n\n  --- mdtprocessinggriddersetup.test ---\n",
    () => require("./tests/mdtprocessinggriddersetup.test"));

  describe("\n\n  --- mdtprocessinggridder.test ---\n",
    () => require("./tests/mdtprocessinggridder.test"));

  // Export
  describe("\n\n  --- export.test ---\n",
    () => require("./tests/export.test"));

});
