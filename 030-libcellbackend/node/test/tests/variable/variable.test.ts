import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { Variable, SourcePgConnection, DiscretePolyTopAreaGridderTask, Grid }
  from "../../../src/index";

import { clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu,
  gridderTaskDiscretePolyTopAreaMunicipio, variableDefault, sqlExport }
  from "./assets";

import * as rx from "rxjs";

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
describe("Insert SourcePgConnection", function() {

  /**
   *
   * Connection DB insert.
   *
   */
  rxMochaTests({

    testCaseName: "pgInsert$",

    observables: [ pgConnectionCellRawData.pgInsert$(pgConnCell) ],

    assertions: [
      (o: SourcePgConnection) =>
        expect(o.name, "pgInsert$").to.be.equal("Cell Raw Data") ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Grid gridEu pgInsert$.
 *
 */
describe("Grid gridEu pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Grid gridEu pgInsert$",

    observables: [ gridEu.pgInsert$(pgConnCell) ],

    assertions: [

      (o: Grid) => expect(o.gridId).to.be.equal("eu-grid")

    ]

  })

})

/**
 *
 * Insert DiscretePolyTopAreaGridderTaskBackend.
 *
 */
describe("Insert gridderTaskDiscretePolyTopAreaMunicipio", function() {

  rxMochaTests({

    testCaseName: "Insert gridderTaskDiscretePolyTopAreaMunicipio",

    observables: [ gridderTaskDiscretePolyTopAreaMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.gridderTaskId)
          .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipio")

      }

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Variable pgInsert$.
 *
 */
describe("Variable pgInsert$", function() {

  rxMochaTests({

    testCaseName: "Variable pgInsert$",

    observables: [ rx.concat(

      variableDefault.pgInsert$(pgConnCell),
      variableDefault.pgInsert$(pgConnCell)

    ) ],

    assertions: [

      (o: Variable) => expect(o.name).to.be.equal("Var default name (ñáéíóú./-¿?¡!*+)"),
      (o: Error) =>
        expect(o.message).to.be.equal('duplicate key value violates unique constraint "unique_gridder_task_id_name"')

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * Variable getByGridderTaskId$.
 *
 */
describe("Variable getByGridderTaskId$", function() {

  rxMochaTests({

    testCaseName: "Variable getByGridderTaskId$",

    observables: [

      Variable.getByGridderTaskIdAndName$(pgConnCell,
        "gridderTaskDiscretePolyTopAreaMunicipio", "Var default name (ñáéíóú./-¿?¡!*+)")

    ],

    assertions: [

      (x: Variable) => {

        expect(x.gridderTaskId, "gridderTaskId equality").to.be
          .equal("gridderTaskDiscretePolyTopAreaMunicipio");

        expect(x.variableKey, "variableKey not null").to.be.not.null;

        expect(x.name, "name equality").to.be.equal('Var default name (ñáéíóú./-¿?¡!*+)');

        expect(x.description, "description equality")
          .to.be.equal("Var default description");

        expect(x.columnName, "columnName undefined")
          .to.be.equal("var_default_name_nyaeiou__");

      }

    ]

  })

})

/**
 *
 * Get SQL.
 *
 */
 describe("Get SQL", function() {

  rxMochaTests({

    testCaseName: "Get SQL",

    observables: [

      Variable.getByGridderTaskIdAndName$(pgConnCell,
        "gridderTaskDiscretePolyTopAreaMunicipio", "Var default name (ñáéíóú./-¿?¡!*+)")
        .pipe(rxo.map((o: Variable) => o.getSql("a", {
            schema: "a",
            pgSqlDataType: "float",
            minZoom: 1,
            maxZoom: 5
          }))),

      Variable.getByGridderTaskIdAndName$(pgConnCell,
        "gridderTaskDiscretePolyTopAreaMunicipio", "Var default name (ñáéíóú./-¿?¡!*+)")
        .pipe(

          rxo.concatMap((o: Variable) => o.getGridderTask$(pgConnCell)),

          rxo.map((o: Variable) => o.getSql("a", {
              schema: "a",
              pgSqlDataType: "float",
              minZoom: 1,
              maxZoom: 5
            }))

        )

    ],

    assertions: [

      (o: Error) => {

        expect(o.message, "No parent GridderTask retrieved").to.be
          .equal("The parent GridderTask is undefined and no SQL string can be returned");

      },

      (o: string) => expect(o, "SQL export").to.be.deep.equal(sqlExport)

    ]

  })

})
