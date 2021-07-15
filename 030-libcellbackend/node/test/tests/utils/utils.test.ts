import "mocha";

import { expect } from "chai";

import * as rx from "rxjs";

import { processTemplate, idw, SourcePgConnection, Grid,
  DiscretePolyTopAreaGridderTask, Variable, exportSql$
  } from "../../../src/index";

import { rxMochaTests } from "@malkab/ts-utils";

import { clearDatabase$, pgConnectionCellRawData, pgConnCell, gridEu,
  gridderTaskDiscretePolyTopAreaMunicipio,
  gridderTaskDiscretePolyAreaSummaryMunicipio, variableTopArea,
  variableAreaSummary, sqlExport } from "./assets";

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
 * processTemplate.
 *
 */
describe("processTemplate", function() {

  it('processTemplate', function() {

    expect(processTemplate('This is {{{a}}} test.', { a: "the" }))
      .to.be.equal("This is the test.");

  });

})

/**
 *
 * idw.
 *
 */
describe("idw", function() {

  it('idw', function() {

    expect(idw([ 1, 2, 4 ], [ 1, 2, 4 ], 2, 2)).to.be.equal(1.33);

  });

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
 * Insert gridderTaskDiscretePolyTopAreaMunicipio.
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
 * Insert gridderTaskPolyAreaSummaryMunicipio.
 *
 */
 describe("Insert gridderTaskPolyAreaSummaryMunicipio", function() {

  rxMochaTests({

    testCaseName: "Insert gridderTaskPolyAreaSummaryMunicipio",

    observables: [ gridderTaskDiscretePolyAreaSummaryMunicipio.pgInsert$(pgConnCell) ],

    assertions: [

      (o: DiscretePolyTopAreaGridderTask) => {

        expect(o.gridderTaskId)
          .to.be.equal("gridderTaskDiscretePolyAreaSummaryMunicipio")

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

      variableTopArea.pgInsert$(pgConnCell),
      variableAreaSummary.pgInsert$(pgConnCell)

    ) ],

    assertions: [

      (o: Variable) => expect(o.name).to.be.equal("Var top area"),
      (o: Variable) => expect(o.name).to.be.equal("Var area summary")

    ],

    verbose: false,

    active: true

  })

})

/**
 *
 * SQL export of variables.
 *
 */
describe("SQL export of variables", function() {

  rxMochaTests({

    testCaseName: "exportSql$ of variables",

    observables: [ exportSql$(pgConnCell, "mv__mv", [ "e", "2" ],
      { schema: "export", pgSqlDataTypes: [ "t0", "t1" ],
      minZoom: 1, maxZoom: 3 }) ],

    assertions: [

      (o: string) => expect(o.length).to.be.equal(sqlExport.length)

    ],

    verbose: false,

    active: true

  })

})
