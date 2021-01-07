import {
  Cell, SourcePgConnection, Variable, Grid, GridderJob,
  DiscretePolyTopAreaGridderTask,
  DiscretePolyAreaSummaryGridderTask, MdtProcessingGridderTask,
  PointAggregationsGridderTask,
  PointIdwGridderTask
} from "../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { NodeLogger, ELOGLEVELS } from "@malkab/node-logger";

import { EnvVarsStorage } from "@malkab/node-utils";

/**
 *
 * Get env vars.
 *
 */
const env: EnvVarsStorage = new EnvVarsStorage(
  "MLKC_CELL_DB_HOST",
  "MLKC_CELL_DB_USER_CELL_MASTER",
  "MLKC_CELL_DB_PASS_CELL_MASTER",
  "MLKC_CELL_DB_PORT",

  "MLKC_CELL_RAW_DATA_HOST",
  "MLKC_CELL_RAW_DATA_USER_CELL_READONLY",
  "MLKC_CELL_RAW_DATA_PASS_CELL_READONLY",
  "MLKC_CELL_RAW_DATA_USER",
  "MLKC_CELL_RAW_DATA_PASS",
  "MLKC_CELL_RAW_DATA_PORT"
);

/**
 *
 * The logger, for the gridders.
 *
 */
export const logger: NodeLogger = new NodeLogger({
  appName: "libcellbackend",
  consoleOut: false,
  logFilePath: "/logs/",
  minLogLevel: ELOGLEVELS.DEBUG
})

/**
 *
 * Configure here the DB connections to the test server.
 *
 * DON'T USE THE PRODUCTION SERVER HERE.
 *
 */
const pgParamsCell: any = {
  host: env.e.MLKC_CELL_DB_HOST,
  user: env.e.MLKC_CELL_DB_USER_CELL_MASTER,
  pass: env.e.MLKC_CELL_DB_PASS_CELL_MASTER,
  port: env.e.MLKC_CELL_DB_PORT
}

/**
 *
 * Configure here the DB connections to the test server.
 *
 * Read only, can use production server here.
 *
 */
const pgParamsSource: any = {
  host: env.e.MLKC_CELL_RAW_DATA_HOST,
  user: env.e.MLKC_CELL_RAW_DATA_USER,
  pass: env.e.MLKC_CELL_RAW_DATA_PASS,
  port: env.e.MLKC_CELL_RAW_DATA_PORT
}

/**
 *
 * PG connection to the cellPg.
 *
 */
export const pgConnCell: RxPg = new RxPg({
  applicationName: "libcellbackend_quick_test",
  db: "cell",
  host: pgParamsCell.host,
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: pgParamsCell.pass,
  port: pgParamsCell.port
});

/**
 *
 * SourcePgConnection to kepler, external.
 *
 */
export const pgConnectionCellRawData: SourcePgConnection = new SourcePgConnection({
  sourcePgConnectionId: "cellRawDataConn",
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: pgParamsSource.host,
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: pgParamsSource.pass,
  port: pgParamsSource.port,
  dbUser: "postgres",
  description: "Connection to Cell Raw Data database to consume original data vectors.",
  name: "Cell Raw Data"
});

export const pgConnCellRawData: RxPg = pgConnectionCellRawData.open();

/**
 *
 * Clear the database.
 *
 */
export const clearDatabase$: rx.Observable<boolean> = pgConnCell.executeParamQuery$(`
  delete from cell_data.data;
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
 * Grid.
 *
 */
export const gridEu: Grid = new Grid({
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
 * Default GridderTask and GridderJob to test common features.
 *
 */
export const gridderTaskDefault: DiscretePolyAreaSummaryGridderTask =
new DiscretePolyAreaSummaryGridderTask({
  gridderTaskId: "gridderTaskDefault",
  gridId: "eu-grid",
  grid: gridEu,
  name: "Name Default",
  description: "Description Default",
  sourceTable: "hic.hic_view",
  geomField: "geom",
  discreteFields: [ "descripcion" ],
  variableNameTemplate: "Área HIC {{{descripcion}}}",
  variableDescriptionTemplate: "Área del Hábitat de Interés Comunitario {{{descripcion}}}"
})

export const gridderJobDefault: GridderJob = new GridderJob({
  gridderJobId: "defaultGridderJob",
  gridderTaskId: "gridderTaskDefault",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.andalucia"
})

/**
 *
 * Test cells.
 *
 */
export const testCell: Cell[] = [];

// Municipio polygon: full coverage single class
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 27,
  y: 32,
  grid: gridEu
}))

// Municipio polygon: partial coverage single class
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 26,
  y: 32,
  grid: gridEu
}))

// Municipio polygon: full coverage multi class
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 28,
  y: 32,
  grid: gridEu
}))

// Municipio polygon: no collision
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 25,
  y: 32,
  grid: gridEu
}))

// Municipio polygon: partial coverage multi class
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 25,
  y: 31,
  grid: gridEu
}))

// Zoom 7 for MDT
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 7,
  x: 2195,
  y: 2680,
  grid: gridEu
}))

// Zoom 8 for MDT
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 8,
  x: 10980,
  y: 13400,
  grid: gridEu
}))

// Zoom 9 for MDT
testCell.push(new Cell({
  gridId: "eu-grid",
  zoom: 9,
  x: 54905,
  y: 67000,
  grid: gridEu
}))

/**
 *
 * Municipio DiscretePolygonTopArea.
 *
 */
export const gridderTaskDiscretePolyTopAreaMunicipio: DiscretePolyTopAreaGridderTask =
new DiscretePolyTopAreaGridderTask({
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipio",
  gridId: "eu-grid",
  grid: gridEu,
  name : "Municipio máxima área",
  description: "Teselado de municipios con sus provincias por máxima área usando el algoritmo DiscretePolyTopAreaGridderTask",
  sourceTable: "context.municipio",
  geomField: "geom",
  discreteFields: [ "provincia", "municipio" ],
  variableName: "Municipio: máxima área",
  variableDescription: "Nombre del municipio y su provincia del municipio que ocupa la mayor área de la celda.",
  categoryTemplate: "{{{municipio}}} ({{{provincia}}})"
});

export const gridderJobDiscretePolyTopAreaMunicipio: GridderJob = new GridderJob({
  gridderJobId: "gridderJobDiscretePolyTopAreaMunicipio",
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipio",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * Municipio DiscretePolyAreaSummary.
 *
 */
export const gridderTaskDiscretePolyAreaSummaryMunicipio: DiscretePolyAreaSummaryGridderTask =
new DiscretePolyAreaSummaryGridderTask({
  gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipio",
  gridId: "eu-grid",
  grid: gridEu,
  name: "Desglose de área de municipios",
  description: "Área de cada municipio en la celda, incluyendo su provincia",
  sourceTable: "context.municipio",
  geomField: "geom",
  discreteFields: [ "provincia", "municipio" ],
  variableNameTemplate: "Área {{{municipio}}} ({{{provincia}}})",
  variableDescriptionTemplate: "Área del municipio {{{municipio}}}, provincia {{{provincia}}}",
})

export const gridderJobDiscretePolyAreaSummaryMunicipio: GridderJob = new GridderJob({
  gridderJobId: "gridderJobDiscretePolyAreaSummaryMunicipio",
  gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipio",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * Población PointAggregations.
 *
 */
export const gridderTaskPointAggregationsPoblacion: PointAggregationsGridderTask =
new PointAggregationsGridderTask({
  gridderTaskId: "gridderTaskPointAggregationsPoblacion",
  gridId: "eu-grid",
  grid: gridEu,
  name: "Estadísticas de población",
  description: "Estadísticas de población",
  sourceTable: "poblacion.poblacion",
  geomField: "geom",
  variables: [
    {
      name: "Población total 2002",
      description: "Población total del año 2002.",
      expression: "sum(ptot02)"
    },
    {
      name: "Población hombres 2020",
      description: "Población de hombres del año 2002.",
      expression: "sum(ph02)"
    },
    {
      name: "Población mujeres 2002",
      description: "Población de mujeres del año 2002.",
      expression: "sum(pm02)"
    },
    {
      name: "Índice de dependencia total 2002",
      description: "Índice de dependencia total de 2002. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      expression: "round(((sum(e001502)::float + sum(e6502)::float) / sum(e166402)::float)::numeric, 2)"
    }
  ]
})

export const gridderJobPointAggregationsPoblacion: GridderJob = new GridderJob({
  gridderJobId: "gridderJobPointAggregationsPoblacion",
  gridderTaskId: "gridderTaskPointAggregationsPoblacion",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * MDT PointIdw.
 *
 */
export const gridderTaskPointIdwMdt: PointIdwGridderTask =
new PointIdwGridderTask({
  gridderTaskId: "gridderTaskPointIdwMdt",
  gridId: "eu-grid",
  grid: gridEu,
  name: "Interpolación MDT con IDW",
  description: "Interpolación del Modelo Digital del Terreno (MDT) mediante el método Inverse Distance Weighting.",
  sourceTable: "mdt.mdt",
  geomField: "geom",
  maxDistance: 200,
  numberOfPoints: 16,
  heightField: "h",
  round: 1,
  power: 2,
  variableName: "MDT según IDW",
  variableDescription: "Interpolación del MDT de 100 metros mediante IDW"
})

export const gridderJobPointIdwMdt: GridderJob = new GridderJob({
  gridderJobId: "gridderJobPointIdwMdt",
  gridderTaskId: "gridderTaskPointIdwMdt",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * MDT processing.
 *
 */
export const gridderTaskMdtProcessing: MdtProcessingGridderTask =
new MdtProcessingGridderTask({
  gridderTaskId: "gridderTaskMdtProcessing",
  gridId: "eu-grid",
  grid: gridEu,
  name: "Interpolación MDT por media de alturas e IDW",
  description: "Interpolación del Modelo Digital del Terreno (MDT) mediante el método de media de alturas si la densidad de puntos de alturas es lo suficientemente alta en la celda o por interpolación Inverse Distance Weighting si no.",
  sourceTable: "mdt.mdt",
  geomField: "geom",
  maxDistance: 200,
  numberOfPoints: 16,
  heightField: "h",
  round: 1,
  power: 2,
  variableName: "Procesamiento MDT",
  variableDescription: "Procesamiento del MDT de 100 metros mediante media / interpolación IDW"
})

export const gridderJobMdtProcessing: GridderJob = new GridderJob({
  gridderJobId: "gridderJobMdtProcessing",
  gridderTaskId: "gridderTaskMdtProcessing",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * HIC DiscretePolyAreaSummary.
 *
 */
export const gridderTaskDiscretePolyAreaSummaryHic: DiscretePolyAreaSummaryGridderTask =
new DiscretePolyAreaSummaryGridderTask({
  gridderTaskId: "gridderTaskDiscretePolyAreaSummaryHic",
  gridId: "eu-grid",
  grid: gridEu,
  name: "Desglose de área de Hábitats de Interés Comunitario (HIC)",
  description: "Área de cada categoría de Hábitats de Interés Comunitario (HIC)",
  sourceTable: "hic.hic_view",
  geomField: "geom",
  discreteFields: [ "descripcion" ],
  variableNameTemplate: "Área HIC {{{descripcion}}}",
  variableDescriptionTemplate: "Área del Hábitat de Interés Comunitario {{{descripcion}}}"
})

export const gridderJobDiscretePolyAreaSummaryHic: GridderJob = new GridderJob({
  gridderJobId: "gridderJobDiscretePolyAreaSummaryHic",
  gridderTaskId: "gridderTaskDiscretePolyAreaSummaryHic",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.andalucia"
})

/**
 *
 * Variable default.
 *
 */
export const variableDefault: Variable = new Variable({
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipio",
  name: "Var default name",
  description: "Var default description",
  gridderTask: gridderTaskDiscretePolyTopAreaMunicipio
});
