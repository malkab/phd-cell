import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import {
  Catalog, SourcePgConnection, Variable, DiscretePolyTopAreaGridderTask, Grid
} from "../../src/index";

import {
  clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu,
  gridderTaskDiscretePolyTopAreaMunicipio, variableDefault
} from "./common";

import * as rxo from "rxjs/operators";

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

      (o: boolean) => expect(o).to.be.true

    ],

    verbose: false

  })

})

/**
 *
 * Insert SourcePgConnection.
 *
 */
describe("SourcePgConnection pgInsert$", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "SourcePgConnection pgInsert$",

    observables: [ pgConnectionCellRawData.pgInsert$(pgConnCell) ],

    assertions: [
      (o: SourcePgConnection) => expect(o.name).to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Grid eugrid pgInsert$.
 *
 */
describe("Grid eugrid pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid eugrid pgInsert$",

    observables: [ gridEu.pgInsert$(pgConnCell) ],

    assertions: [

      (o: Grid) => expect(o.gridId).to.be.equal("eu-grid")

    ]

  })

})

/**
 *
 * Insert gridderTaskDiscretePolyTopAreaMunicipio.
 *
 */
describe("Insert gridderTaskDiscretePolyTopAreaMunicipio", function() {

  rxMochaTests({

    testCaseName: "pgInsert$()",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.gridderTaskId, "GridderTask pgInsert$()")
          .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipio")

      }

    ],

    verbose: false,

    active: true

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

    observables: [ variableDefault.pgInsert$(pgConnCell) ],

    assertions: [

      (o: Variable) => {

        expect(o.name).to.be.equal("Var default name");

      }

    ],

    verbose: false,

    active: true

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

    observables: [

      Variable.getByGridderTaskId$(pgConnCell, variableDefault.gridderTaskId)
      .pipe(

        rxo.map((o: Variable[]) => o[0]),

        rxo.map((o: Variable) => o.getCatalog$()),

        rxo.concatMap((o: Catalog) => o.dbLoadForwardBackward$(pgConnCell))

      )

    ],

    assertions: [

      (o: Catalog) => {

        expect(o.variableKey).to.be.not.undefined;
        expect(o.forward.keys.length).to.be.equal(0);

      }

    ],

    verbose: false,

    active: true

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

    observables: [

      Variable.getByGridderTaskId$(pgConnCell, variableDefault.gridderTaskId)
      .pipe(

        rxo.map((o: Variable[]) => o[0]),

        rxo.map((o: Variable) => o.getCatalog$()),

        rxo.concatMap((o: Catalog) => o.dbAddEntries$(pgConnCell, [ "value" ])),

        rxo.concatMap((o: Catalog) => o.dbLoadForwardBackward$(pgConnCell))

      )

    ],

    assertions: [

      (o: Catalog) => {

        expect(o.variableKey).to.be.not.undefined;
        expect(o.forward.size).to.be.equal(1);

      }

    ],

    verbose: false,

    active: true

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

    observables: [

      Variable.getByGridderTaskId$(pgConnCell, variableDefault.gridderTaskId)
      .pipe(

        rxo.map((o: Variable[]) => o[0]),

        rxo.map((o: Variable) => o.getCatalog$()),

        rxo.concatMap((o: Catalog) => o.dbAddEntries$(pgConnCell,
          [ "value0", "value1", "value2" ])),

        rxo.concatMap((o: Catalog) => o.dbLoadForwardBackward$(pgConnCell))

      )

    ],

    assertions: [

      (o: Catalog) => {

        expect(o.forward.size, "Number of existing keys in catalog")
        .to.be.equal(4);

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

    verbose: false,

    active: true

  })

})
