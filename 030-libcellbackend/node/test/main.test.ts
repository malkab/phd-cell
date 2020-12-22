import "mocha";

import "webpack";

console.log(`

--------------------------

Mocha testing

--------------------------

`);

// Add test suites here
describe("libcellbackend", () => {

  // describe("\n\n  --- sourcepgconnection.test ---\n",
  //   () => require("./tests/sourcepgconnection.test"));

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

  /**
   *
   * This is a set up test for the following ones. The GridderTask tests aren't
   * atomic so it can be tested that they don't interfere with the variables
   * and data vectors of one another.
   *
   */
  // describe("\n\n  --- griddertasksetup.test ---\n",
  //   () => require("./tests/gridder_tasks/griddertasksetup.test"));

  // // Not atomic!
  // describe("\n\n  --- discretepolytopareagridder.test ---\n",
  //   () => require("./tests/discretepolytopareagridder.test"));

  // // Not atomic!
  // describe("\n\n  --- discretepolyareasummarygridder.test ---\n",
  //   () => require("./tests/discretepolyareasummarygridder.test"));

  // // Not atomic!
  // describe("\n\n  --- pointaggregationsgridder.test ---\n",
  //   () => require("./tests/pointaggregationsgridder.test"));

  // Not atomic!
  // describe("\n\n  --- pointidwgridder.test ---\n",
  //   () => require("./tests/gridder_tasks/pointidwgridder.test"));

  /**
   *
   * This is a set up test for the following ones. The GridderJob tests aren't
   * atomic so it can be tested that they don't interfere with the variables
   * and data vectors of one another.
   *
   */
  describe("\n\n  --- gridderjobsetup.test ---\n",
    () => require("./tests/gridder_jobs/gridderjobsetup.test"));

  // describe("\n\n  --- discretepolytopareagridderjob.test ---\n",
  //   () => require("./tests/discretepolytopareagridderjob.test"));

  // describe("\n\n  --- discretepolyareasummarygridderjob.test ---\n",
  //   () => require("./tests/discretepolyareasummarygridderjob.test"));

  // describe("\n\n  --- pointaggregationsgridderjob.test ---\n",
  //   () => require("./tests/pointaggregationsgridderjob.test"));

  describe("\n\n  --- pointidwgridderjob.test ---\n",
    () => require("./tests/gridder_jobs/pointidwgridderjob.test"));

  // /**
  //  *
  //  * HIC test, that produced some trouble.
  //  *
  //  */
  // // Not atomic!
  // describe("\n\n  --- hicareasummarygridder.test ---\n",
  //   () => require("./tests/hicareasummarygridder.test"));

});
