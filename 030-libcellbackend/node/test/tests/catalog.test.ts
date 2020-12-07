import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { Catalog, PgConnection, GridderTasks as gt, Variable } from "../../src/index";

import { cellRawData, cellPgConn, clearDatabase$, municipioDiscretePolyTopAreaGridderTask, variable, catalog } from "./common";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

/**
 *
 * Initial database clearance.
 *
 */
describe("Initial database clearance", function() {

  rxMochaTests({

    testCaseName: "Initial database clearance",

    observables: [ clearDatabase$ ],

    assertions: [

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true,

      (o: boolean) => expect(o).to.be.true

    ],

    verbose: false

  })

})

/**
 *
 * Insert PgConnection.
 *
 */
describe("PgConnection pgInsert$", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "PgConnection pgInsert$",

    observables: [ cellRawData.pgInsert$(cellPgConn) ],

    assertions: [
      (o: PgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false

  })

})

/**
 *
 * Insert DiscretePolyTopAreaGridderTaskBackend.
 *
 */
describe("Insert municipioDiscretePolyTopAreaGridderTask", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ municipioDiscretePolyTopAreaGridderTask.pgInsert$(cellPgConn) ],

    assertions: [

      (o: gt.DiscretePolyTopAreaGridderTask) => {

        expect(o.gridderTaskId, "GridderTask pgInsert$()").to.be.equal("municipioDiscretePolyTopArea")

      }

    ],

    verbose: false

  })

})

/**
 *
 * Create variable.
 *
 */
describe("Create variable", function() {

  rxMochaTests({

    testCaseName: "Create variable",

    observables: [ variable.pgInsert$(cellPgConn) ],

    assertions: [

      (o: Variable) => {

        expect(o.name).to.be.equal("Var name");

      }

    ],

    verbose: false

  })

})

/**
 *
 * Create Catalog and load catalog data.
 *
 */
describe("Create catalog and load catalog data", function() {

  rxMochaTests({

    testCaseName: "Create catalog and load catalog data",

    observables: [ catalog.dbLoadForwardBackward$(cellPgConn) ],

    assertions: [

      (o: Catalog) => {

        expect(o.variableId).to.be.equal("var");
        expect(o.forward.keys.length).to.be.equal(0);

      }

    ],

    verbose: false

  })

})

/**
 *
 * Create Catalog and add some entries.
 *
 */
describe("Insert one key on empty catalog", function() {

  rxMochaTests({

    testCaseName: "Insert one key on empty catalog",

    observables: [ catalog.dbLoadForwardBackward$(cellPgConn)
      .pipe(

        rxo.concatMap((o: Catalog) => {

          return o.dbAddEntries$(cellPgConn, [ "value" ]);

        })

      ) ],

    assertions: [

      (o: Catalog) => {

        expect(o.variableId).to.be.equal("var");
        expect(o.forward.size).to.be.equal(1);

      }

    ],

    verbose: false

  })

})

/**
 *
 * Load Catalog and add more entries.
 *
 */
describe("Load Catalog and add more entries", function() {

  rxMochaTests({

    testCaseName: "Load Catalog and add more entries",

    observables: [ rx.concat(

      catalog.dbLoadForwardBackward$(cellPgConn),

      catalog.dbLoadForwardBackward$(cellPgConn)
      .pipe(

        rxo.concatMap((o: Catalog) => {

          return o.dbAddEntries$(cellPgConn, [ "value0", "value1", "value2" ])

        })

      )

     ) ],

    assertions: [

      (o: Catalog) => {

        expect(o.forward.size, "Number of existing keys in catalog")
        .to.be.equal(1);

        expect(o.forward.get("c"), "Get existing key 'c'")
          .to.be.equal("value");

        expect(o.backward.get("value"), "Get existing value 'value'")
          .to.be.equal("c");

      },

      (o: Catalog) => {

        expect(o.forward.size, "Number of existing keys in catalog after addind 3 new")
          .to.be.equal(4);

        expect(o.variableId, "Variable ID")
          .to.be.equal("var");

        expect(o.forward.get("c"), "Get existing key 'c'")
          .to.be.equal("value");

        expect(o.backward.get("value"), "Get existing value 'value'")
          .to.be.equal("c");

        expect(o.forward.get("3"), "Get existing key '3'")
          .to.be.equal("value1");

        expect(o.backward.get("value1"), "Get existing value 'value1'")
          .to.be.equal("3");

      }

    ],

    verbose: false

  })

})

/**
 *
 * get$ Catalog and load data.
 *
 */
describe("get$ catalog and load data", function() {

  rxMochaTests({

    testCaseName: "get$ catalog and load data",

    observables: [ Catalog.get$(cellPgConn, "municipioDiscretePolyTopArea",
      "var") ],

    assertions: [

      (o: Catalog) => {

        expect(o.forward.size).to.be.equal(4);

        expect(o.variableId).to.be.equal("var");

        expect(o.forward.get("c"), "Get existing key 'c'")
          .to.be.equal("value");

        expect(o.backward.get("value"), "Get existing value 'value'")
          .to.be.equal("c");

        expect(o.forward.get("3"), "Get existing key '3'")
          .to.be.equal("value1");

        expect(o.backward.get("value1"), "Get existing value 'value1'")
          .to.be.equal("3");

      }

    ],

    verbose: false

  })

})
