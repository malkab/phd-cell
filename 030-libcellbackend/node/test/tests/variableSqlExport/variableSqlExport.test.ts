import "mocha";

import { expect } from "chai";

import { rxMochaTests } from "@malkab/ts-utils";

import { Variable, SourcePgConnection, DiscretePolyTopAreaGridderTask, Grid, exportSql$ }
  from "../../../src/index";

import { clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu,
  gridderTaskDiscretePolyTopAreaMunicipioA,
  gridderTaskDiscretePolyAreaSummaryMunicipioA,
  gridderTaskDiscretePolyTopAreaMunicipioB,
  gridderTaskDiscretePolyAreaSummaryMunicipioB,
  variableGridderTaskDiscretePolyTopAreaMunicipioA,
  variableGridderTaskDiscretePolyAreaSummaryMunicipioA,
  variableGridderTaskDiscretePolyTopAreaMunicipioB,
  variableGridderTaskDiscretePolyAreaSummaryMunicipioB,
  sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioA,
  sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioA,
  sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioB,
  sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioB,
  sqlTotalExportWithZoom, sqlTotalExportWithoutZoom } from "./assets";

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

    observables: [

      gridderTaskDiscretePolyTopAreaMunicipioA.pgInsert$(pgConnCell),
      gridderTaskDiscretePolyAreaSummaryMunicipioA.pgInsert$(pgConnCell),
      gridderTaskDiscretePolyTopAreaMunicipioB.pgInsert$(pgConnCell),
      gridderTaskDiscretePolyAreaSummaryMunicipioB.pgInsert$(pgConnCell)

    ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => expect(o.gridderTaskId)
        .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipioA"),

      (o: DiscretePolyTopAreaGridderTask) => expect(o.gridderTaskId)
        .to.be.equal("gridderTaskDiscretePolyAreaSummaryMunicipioA"),

      (o: DiscretePolyTopAreaGridderTask) => expect(o.gridderTaskId)
        .to.be.equal("gridderTaskDiscretePolyTopAreaMunicipioB"),

      (o: DiscretePolyTopAreaGridderTask) => expect(o.gridderTaskId)
        .to.be.equal("gridderTaskDiscretePolyAreaSummaryMunicipioB")

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

    observables: [

      variableGridderTaskDiscretePolyTopAreaMunicipioA.pgInsert$(pgConnCell),
      variableGridderTaskDiscretePolyAreaSummaryMunicipioA.pgInsert$(pgConnCell),
      variableGridderTaskDiscretePolyTopAreaMunicipioB.pgInsert$(pgConnCell),
      variableGridderTaskDiscretePolyAreaSummaryMunicipioB.pgInsert$(pgConnCell)

    ],

    assertions: [

      (o: Variable) => expect(o.name).to.be
        .equal("Var variableGridderTaskDiscretePolyTopAreaMunicipio A"),

      (o: Variable) => expect(o.name).to.be
        .equal("Var variableGridderTaskDiscretePolyAreaSummaryMunicipio A"),

      (o: Variable) => expect(o.name).to.be
        .equal("Var variableGridderTaskDiscretePolyTopAreaMunicipio B"),

      (o: Variable) => expect(o.name).to.be
        .equal("Var variableGridderTaskDiscretePolyAreaSummaryMunicipio B")

    ],

    verbose: false,

    active: true

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
        "gridderTaskDiscretePolyTopAreaMunicipioA",
        "Var variableGridderTaskDiscretePolyTopAreaMunicipio A")
      .pipe(

        rxo.concatMap((o: Variable) => o.getGridderTask$(pgConnCell)),

        rxo.map((o: Variable) => o.getSql("a",
          { schema: "a", pgSqlDataType: "float", minZoom: 1, maxZoom: 5 }))

      ),

      Variable.getByGridderTaskIdAndName$(pgConnCell,
        "gridderTaskDiscretePolyAreaSummaryMunicipioA",
        "Var variableGridderTaskDiscretePolyAreaSummaryMunicipio A")
      .pipe(

        rxo.concatMap((o: Variable) => o.getGridderTask$(pgConnCell)),

        rxo.map((o: Variable) => o.getSql("a",
          { schema: "a", pgSqlDataType: "float", minZoom: 1, maxZoom: 5 }))

      ),

      Variable.getByGridderTaskIdAndName$(pgConnCell,
        "gridderTaskDiscretePolyTopAreaMunicipioB",
        "Var variableGridderTaskDiscretePolyTopAreaMunicipio B")
      .pipe(

        rxo.concatMap((o: Variable) => o.getGridderTask$(pgConnCell)),

        rxo.map((o: Variable) => o.getSql("a",
          { schema: "a", pgSqlDataType: "float", minZoom: 1, maxZoom: 5 }))

      ),

      Variable.getByGridderTaskIdAndName$(pgConnCell,
        "gridderTaskDiscretePolyAreaSummaryMunicipioB",
        "Var variableGridderTaskDiscretePolyAreaSummaryMunicipio B")
      .pipe(

        rxo.concatMap((o: Variable) => o.getGridderTask$(pgConnCell)),

        rxo.map((o: Variable) => o.getSql("a",
          { schema: "a", pgSqlDataType: "float", minZoom: 1, maxZoom: 5 }))

      ),

      exportSql$(pgConnCell, "a", [ "6", "8", "b", "c" ],
        {
          schema: "s", minZoom: 0, maxZoom: 4,
          pgSqlDataTypes: [ "a", "b", "c", "d" ],
          addNullityFields: [ "6", "c" ],
          excludeNullityFields: [ "c" ]
        }),

      exportSql$(pgConnCell, "a", [ "6", "8", "b", "c" ])

    ],

    assertions: [

      (o: string) => expect(o, "SQL export").to.be
        .equal(sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioA),

      (o: string) => expect(o, "SQL export").to.be
        .equal(sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioA),

      (o: string) => expect(o, "SQL export").to.be
        .equal(sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioB),

      (o: string) => expect(o, "SQL export").to.be
        .equal(sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioB),

      (o: string) => expect(o.length, "SQL export").to.be
        .equal(sqlTotalExportWithZoom.length),

      (o: string) => expect(o.length, "SQL export").to.be
        .equal(sqlTotalExportWithoutZoom.length)

    ],

    verbose: false

  })

})
