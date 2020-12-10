import { Cell, Catalog, PgConnection, Variable, GridderTasks as gt, Grid } from "../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * Configure here the DB connections to the test server.
 *
 */
const pgParams: any = {
  host: "37north.io",
  pass: "3j329fjvkd2345-:k342ju",
  port: 5632
}

/**
 *
 * PG connection to the cellPg.
 *
 */
export const cellPg: PgConnection = new PgConnection({
  pgConnectionId: "cellPg",
  applicationName: "libcellbackend_quick_test",
  db: "cell",
  host: pgParams.host,
  maxPoolSize: 200,
  minPoolSize: 200,
  pass: pgParams.pass,
  port: pgParams.port,
  dbUser: "postgres",
  description: "Cell DB",
  name: "Cell DB"
});

export const cellPgConn: RxPg = cellPg.open();

/**
 *
 * PgConnection to kepler, external.
 *
 */
export const cellRawData: PgConnection = new PgConnection({
  pgConnectionId: "cellRawDataConn",
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: pgParams.host,
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: pgParams.pass,
  port: pgParams.port,
  dbUser: "postgres",
  description: "Connection to Cell Raw Data database to consume original data vectors.",
  name: "Cell Raw Data"
});

export const cellRawDataConn: RxPg = cellRawData.open();

/**
 *
 * Clear the database.
 *
 */
export const clearDatabase$: rx.Observable<boolean> = cellPgConn.executeParamQuery$(`
  delete from cell_data.data;
  delete from cell_meta.gridder_cell;
  delete from cell_meta.gridder_job;
  delete from cell_meta.catalog;
  delete from cell_meta.variable;
  delete from cell_meta.gridder_task;
  delete from cell_meta.grid;
  delete from cell_meta.pg_connection;
  delete from cell_meta.cell_version;
`)
.pipe(

  rxo.map((o: QueryResult): boolean => o.command === "DELETE" ? true : false)

)

/**
 *
 * DiscretePolygonTopAreaGridderTask.
 *
 */
export const municipioDiscretePolyTopAreaGridderTask: gt.DiscretePolyTopAreaGridderTask =
new gt.DiscretePolyTopAreaGridderTask({
  gridderTaskId: "municipioDiscretePolyTopArea",
  name: "Municipio máxima área",
  description: "Teselado de municipios con sus provincias por máxima área usando el algoritmo DiscretePolyTopAreaGridderTask",
  sourceTable: "context.municipio",
  geomField: "geom",
  discreteFields: [ "provincia", "municipio" ],
  variableName: "Municipio: máxima área",
  variableDescription: "Nombre del municipio y su provincia del municipio que ocupa la mayor área de la celda.",
  categoryTemplate: "{{{municipio}}} ({{{provincia}}})"
});

export const municipioDiscretePolyAreaSummaryGridderTask: gt.DiscretePolyAreaSummaryGridderTask =
new gt.DiscretePolyAreaSummaryGridderTask({
  gridderTaskId: "municipioDiscreteAreaSummary",
  name: "Desglose de área de municipios",
  description: "Área de cada municipio en la celda, incluyendo su provincia",
  sourceTable: "context.municipio",
  geomField: "geom",
  discreteFields: [ "provincia", "municipio" ],
  variableNameTemplate: "{{{municipio}}} ({{{provincia}}})",
  variableDescriptionTemplate: "Área del municipio {{{municipio}}}, provincia {{{provincia}}}"
})

/**
 *
 * Variable.
 *
 */
export const variable: Variable = new Variable({
  gridderTaskId: "municipioDiscretePolyTopArea",
  variableId: "var",
  name: "Var name",
  description: "Var description",
  gridderTask: municipioDiscretePolyTopAreaGridderTask
});

/**
 *
 * Catalog.
 *
 */
export const catalog: Catalog = new Catalog({
  gridderTaskId: "municipioDiscretePolyTopArea",
  variableId: "var",
  variable: variable
})

/**
 *
 * Grid.
 *
 */
export const eugrid: Grid = new Grid({
  description: "A grid based on the official EU one",
  gridId: "eu-grid",
  name: "eu-grid",
  originEpsg: "3035",
  originX: 2700000,
  originY: 1500000,
  zoomLevels: [
    {"name": "100 km", "size": 100000}, // 0
    {"name": "50 km", "size": 50000},   // 1
    {"name": "10 km", "size": 10000},   // 2
    {"name": "5 km", "size": 5000},     // 3
    {"name": "1 km", "size": 1000},     // 4
    {"name": "500 m", "size": 500},     // 5
    {"name": "250 m", "size": 250},     // 6
    {"name": "125 m", "size": 125},     // 7
    {"name": "25 m", "size": 25},       // 8
    {"name": "5 m", "size": 5}          // 9
  ]
})

/**
 *
 * Cells.
 *
 */
export const cells: Cell[] = [];

for (let z = 0; z<1; z++) {

  for (let x = 0; x<6; x++) {

    for (let y = 0; y<4; y++) {

      cells.push(new Cell({
        epsg: "3035",
        gridId: "eu-grid",
        x: x,
        y: y,
        zoom: z,
        grid: eugrid
      }))

    }

  }

}

export const testCell_0_2_2: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 2,
  grid: eugrid
})

export const testCell_0_2_3: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 3,
  grid: eugrid
})

export const testCell_0_3_2: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 2,
  grid: eugrid
})

export const testCell_0_2_1: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 1,
  grid: eugrid
})

export const testCell_0_3_1: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 1,
  grid: eugrid
})

// This is a full coverage for municipios with a single municipio
export const testCell_2_27_32: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 27,
  y: 32,
  grid: eugrid
})

// This is a partial coverage for municipios
export const testCell_2_24_31: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 24,
  y: 31,
  grid: eugrid
})

// This is a full coverage with several municipios
export const testCell_2_28_30: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 28,
  y: 30,
  grid: eugrid
})

// No coverage of municipios at all
export const testCell_2_25_32: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 25,
  y: 32,
  grid: eugrid
})

// Full coverage of a municipio, level 3
export const testCell_3_54_65: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 3,
  x: 54,
  y: 65,
  grid: eugrid
})

// Full coverage of a municipio, level 4 (1000 m)
export const testCell_4_270_329: Cell = new Cell({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 4,
  x: 270,
  y: 329,
  grid: eugrid
})

/**
 *
 * Gridder Job for top area for Huelva.
 *
 */
export const gridderJobHuelva: gt.GridderJob = new gt.GridderJob({
  gridderJobId: "gridderJobHuelva",
  gridderTaskId: "municipioDiscretePolyTopArea",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})
