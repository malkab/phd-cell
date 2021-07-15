import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe("libcellbackend", () => {

  describe("\n\n  --- sourcepgconnection.test ---\n",
    () => require("./tests/sourcepgconnection.test"));

  describe("\n\n  --- griddertask.test ---\n",
    () => require("./tests/griddertask.test"));

  // This one is atomic
  describe("\n\n  --- variable.test ---\n",
    () => require("./tests/variable/variable.test"));

  // This one is atomic
  describe("\n\n  --- variableSqlExport.test ---\n",
    () => require("./tests/variableSqlExport/variableSqlExport.test"));

  describe("\n\n  --- catalog.test ---\n",
    () => require("./tests/catalog.test"));

  describe("\n\n  --- grid.test ---\n",
    () => require("./tests/grid.test"));

  describe("\n\n  --- cell.test ---\n",
    () => require("./tests/cell.test"));

  // Atomic
  describe("\n\n  --- utils.test ---\n",
    () => require("./tests/utils/utils.test"));

  /**
   *
   * This is a set up test for the following ones. The GridderTask tests aren't
   * atomic so it can be tested that they don't interfere with the variables
   * and data vectors of one another.
   *
   */
  describe("\n\n  --- griddertasksetup.test ---\n",
    () => require("./tests/gridder_tasks/griddertasksetup.test"));

  describe("\n\n  --- discretepolytopareagridder.test ---\n",
    () => require("./tests/gridder_tasks/discretepolytopareagridder.test"));

  describe("\n\n  --- discretepolyareasummarygridder.test ---\n",
    () => require("./tests/gridder_tasks/discretepolyareasummarygridder.test"));

  describe("\n\n  --- pointaggregationsgridder.test ---\n",
    () => require("./tests/gridder_tasks/pointaggregationsgridder.test"));

  describe("\n\n  --- pointidwgridder.test ---\n",
    () => require("./tests/gridder_tasks/pointidwgridder.test"));

  describe("\n\n  --- hicareasummarygridder.test ---\n",
    () => require("./tests/gridder_tasks/hicareasummarygridder.test"));

  describe("\n\n  --- mdtprocessinggridder.test ---\n",
    () => require("./tests/gridder_tasks/mdtprocessinggridder.test"));

  /**
   *
   * This is a set up test for the following ones. They aren't atomic.
   *
   */
  describe("\n\n  --- griddertaskbatchsetup.test ---\n",
    () => require("./tests/batch_cells_gridder_tasks/griddertaskbatchsetup.test"));

  describe("\n\n  --- discretepolytopareabatch.test ---\n",
    () => require("./tests/batch_cells_gridder_tasks/discretepolytopareabatch.test"));

  describe("\n\n  --- discretepolyareasummarybatch.test ---\n",
    () => require("./tests/batch_cells_gridder_tasks/discretepolyareasummarybatch.test"));

  describe("\n\n  --- pointsaggregationsbatch.test ---\n",
    () => require("./tests/batch_cells_gridder_tasks/pointsaggregationsbatch.test"));

  describe("\n\n  --- pointidwbatch.test ---\n",
    () => require("./tests/batch_cells_gridder_tasks/pointidwbatch.test"));

  describe("\n\n  --- mdtprocessingbatch.test ---\n",
    () => require("./tests/batch_cells_gridder_tasks/mdtprocessingbatch.test"));

});
