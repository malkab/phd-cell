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

// Sevilla, many data, don't add this to the normal tests
// testCell.push(new Cell({
//   gridId: "eu-grid",
//   zoom: 0,
//   x: 1,
//   y: 2,
//   grid: gridEu
// }))

// testCell.push(new Cell({
//   gridId: "eu-grid",
//   zoom: 0,
//   x: 2,
//   y: 2,
//   grid: gridEu
// }))

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
  name: "Estadísticas de población",
  description: "Estadísticas de población",
  sourceTable: "poblacion.poblacion",
  geomField: "geom",
  variables: [
    {
      "name": "Población total 2002",
      "description": "Población total del año 2002.",
      "expression": "sum(ptot02)"
    },
    {
      "name": "Población hombres 2002",
      "description": "Población de hombres del año 2002.",
      "expression": "sum(ph02)"
    },
    {
      "name": "Población mujeres 2002",
      "description": "Población de mujeres del año 2002.",
      "expression": "sum(pm02)"
    },
    {
      "name": "Población edad 0-15 2002",
      "description": "Población de edades entre 0 y 15 años del año 2002.",
      "expression": "sum(e001502)"
    },
    {
      "name": "Población edad 16-64 2002",
      "description": "Población de edades entre 16 y 64 años del año 2002.",
      "expression": "sum(e166402)"
    },
    {
      "name": "Población edad mayor 64 2002",
      "description": "Población de edad mayor de 64 años del año 2002.",
      "expression": "sum(e6502)"
    },
    {
      "name": "Población española 2002",
      "description": "Población española del año 2002.",
      "expression": "sum(esp02)"
    },
    {
      "name": "Población UE Schengen 2002",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2002.",
      "expression": "sum(ue1502)"
    },
    {
      "name": "Población magrebí 2002",
      "description": "Población de origen magrebí del año 2002.",
      "expression": "sum(mag02)"
    },
    {
      "name": "Población americana 2002",
      "description": "Población de origen americano del año 2002.",
      "expression": "sum(ams02)"
    },
    {
      "name": "Población otros 2002",
      "description": "Población de otros origenes del año 2002.",
      "expression": "sum(otr02)"
    },
    {
      "name": "Índice de dependencia total 2002",
      "description": "Índice de dependencia total de 2002. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001502)::float + sum(e6502)::float) / sum(e166402)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2002",
      "description": "Índice de dependencia infantil de 2002. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001502)::float) / sum(e166402)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2002",
      "description": "Índice de dependencia anciana de 2002. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6502)::float) / sum(e166402)::float)::numeric, 2)"
    },
    {
      "name": "Población total 2013",
      "description": "Población total del año 2013.",
      "expression": "sum(ptot13)"
    },
    {
      "name": "Población hombres 2013",
      "description": "Población de hombres del año 2013.",
      "expression": "sum(ph13)"
    },
    {
      "name": "Población mujeres 2013",
      "description": "Población de mujeres del año 2013.",
      "expression": "sum(pm13)"
    },
    {
      "name": "Población edad 0-15 2013",
      "description": "Población de edades entre 0 y 15 años del año 2013.",
      "expression": "sum(e001513)"
    },
    {
      "name": "Población edad 16-64 2013",
      "description": "Población de edades entre 16 y 64 años del año 2013.",
      "expression": "sum(e166413)"
    },
    {
      "name": "Población edad mayor 64 2013",
      "description": "Población de edad mayor de 64 años del año 2013.",
      "expression": "sum(e6513)"
    },
    {
      "name": "Población española 2013",
      "description": "Población española del año 2013.",
      "expression": "sum(esp13)"
    },
    {
      "name": "Población UE Schengen 2013",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2013.",
      "expression": "sum(ue1513)"
    },
    {
      "name": "Población magrebí 2013",
      "description": "Población de origen magrebí del año 2013.",
      "expression": "sum(mag13)"
    },
    {
      "name": "Población americana 2013",
      "description": "Población de origen americano del año 2013.",
      "expression": "sum(ams13)"
    },
    {
      "name": "Población otros 2013",
      "description": "Población de otros origenes del año 2013.",
      "expression": "sum(otr13)"
    },
    {
      "name": "Índice de dependencia total 2013",
      "description": "Índice de dependencia total de 2013. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001513)::float + sum(e6513)::float) / sum(e166413)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2013",
      "description": "Índice de dependencia infantil de 2013. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001513)::float) / sum(e166413)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2013",
      "description": "Índice de dependencia anciana de 2013. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6513)::float) / sum(e166413)::float)::numeric, 2)"
    },
    {
      "name": "Población total 2014",
      "description": "Población total del año 2014.",
      "expression": "sum(ptot14)"
    },
    {
      "name": "Población hombres 2014",
      "description": "Población de hombres del año 2014.",
      "expression": "sum(ph14)"
    },
    {
      "name": "Población mujeres 2014",
      "description": "Población de mujeres del año 2014.",
      "expression": "sum(pm14)"
    },
    {
      "name": "Población edad 0-15 2014",
      "description": "Población de edades entre 0 y 15 años del año 2014.",
      "expression": "sum(e001514)"
    },
    {
      "name": "Población edad 16-64 2014",
      "description": "Población de edades entre 16 y 64 años del año 2014.",
      "expression": "sum(e166414)"
    },
    {
      "name": "Población edad mayor 64 2014",
      "description": "Población de edad mayor de 64 años del año 2014.",
      "expression": "sum(e6514)"
    },
    {
      "name": "Población española 2014",
      "description": "Población española del año 2014.",
      "expression": "sum(esp14)"
    },
    {
      "name": "Población UE Schengen 2014",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2014.",
      "expression": "sum(ue1514)"
    },
    {
      "name": "Población magrebí 2014",
      "description": "Población de origen magrebí del año 2014.",
      "expression": "sum(mag14)"
    },
    {
      "name": "Población americana 2014",
      "description": "Población de origen americano del año 2014.",
      "expression": "sum(ams14)"
    },
    {
      "name": "Población otros 2014",
      "description": "Población de otros origenes del año 2014.",
      "expression": "sum(otr14)"
    },
    {
      "name": "Índice de dependencia total 2014",
      "description": "Índice de dependencia total de 2014. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001514)::float + sum(e6514)::float) / sum(e166414)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2014",
      "description": "Índice de dependencia infantil de 2014. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001514)::float) / sum(e166414)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2014",
      "description": "Índice de dependencia anciana de 2014. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6514)::float) / sum(e166414)::float)::numeric, 2)"
    },
    {
      "name": "Población total 2015",
      "description": "Población total del año 2015.",
      "expression": "sum(ptot15)"
    },
    {
      "name": "Población hombres 2015",
      "description": "Población de hombres del año 2015.",
      "expression": "sum(ph15)"
    },
    {
      "name": "Población mujeres 2015",
      "description": "Población de mujeres del año 2015.",
      "expression": "sum(pm15)"
    },
    {
      "name": "Población edad 0-15 2015",
      "description": "Población de edades entre 0 y 15 años del año 2015.",
      "expression": "sum(e001515)"
    },
    {
      "name": "Población edad 16-64 2015",
      "description": "Población de edades entre 16 y 64 años del año 2015.",
      "expression": "sum(e166415)"
    },
    {
      "name": "Población edad mayor 64 2015",
      "description": "Población de edad mayor de 64 años del año 2015.",
      "expression": "sum(e6515)"
    },
    {
      "name": "Población española 2015",
      "description": "Población española del año 2015.",
      "expression": "sum(esp15)"
    },
    {
      "name": "Población UE Schengen 2015",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2015.",
      "expression": "sum(ue1515)"
    },
    {
      "name": "Población magrebí 2015",
      "description": "Población de origen magrebí del año 2015.",
      "expression": "sum(mag15)"
    },
    {
      "name": "Población americana 2015",
      "description": "Población de origen americano del año 2015.",
      "expression": "sum(ams15)"
    },
    {
      "name": "Población otros 2015",
      "description": "Población de otros origenes del año 2015.",
      "expression": "sum(otr15)"
    },
    {
      "name": "Índice de dependencia total 2015",
      "description": "Índice de dependencia total de 2015. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001515)::float + sum(e6515)::float) / sum(e166415)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2015",
      "description": "Índice de dependencia infantil de 2015. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001515)::float) / sum(e166415)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2015",
      "description": "Índice de dependencia anciana de 2015. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6515)::float) / sum(e166415)::float)::numeric, 2)"
    },
    {
      "name": "Población total 2016",
      "description": "Población total del año 2016.",
      "expression": "sum(ptot16)"
    },
    {
      "name": "Población hombres 2016",
      "description": "Población de hombres del año 2016.",
      "expression": "sum(ph16)"
    },
    {
      "name": "Población mujeres 2016",
      "description": "Población de mujeres del año 2016.",
      "expression": "sum(pm16)"
    },
    {
      "name": "Población edad 0-16 2016",
      "description": "Población de edades entre 0 y 16 años del año 2016.",
      "expression": "sum(e001516)"
    },
    {
      "name": "Población edad 16-64 2016",
      "description": "Población de edades entre 16 y 64 años del año 2016.",
      "expression": "sum(e166416)"
    },
    {
      "name": "Población edad mayor 64 2016",
      "description": "Población de edad mayor de 64 años del año 2016.",
      "expression": "sum(e6516)"
    },
    {
      "name": "Población española 2016",
      "description": "Población española del año 2016.",
      "expression": "sum(esp16)"
    },
    {
      "name": "Población UE Schengen 2016",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2016.",
      "expression": "sum(ue1516)"
    },
    {
      "name": "Población magrebí 2016",
      "description": "Población de origen magrebí del año 2016.",
      "expression": "sum(mag16)"
    },
    {
      "name": "Población americana 2016",
      "description": "Población de origen americano del año 2016.",
      "expression": "sum(ams16)"
    },
    {
      "name": "Población otros 2016",
      "description": "Población de otros origenes del año 2016.",
      "expression": "sum(otr16)"
    },
    {
      "name": "Índice de dependencia total 2016",
      "description": "Índice de dependencia total de 2016. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001516)::float + sum(e6516)::float) / sum(e166416)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2016",
      "description": "Índice de dependencia infantil de 2016. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001516)::float) / sum(e166416)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2016",
      "description": "Índice de dependencia anciana de 2016. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6516)::float) / sum(e166416)::float)::numeric, 2)"
    },
    {
      "name": "Población total 2017",
      "description": "Población total del año 2017.",
      "expression": "sum(ptot17)"
    },
    {
      "name": "Población hombres 2017",
      "description": "Población de hombres del año 2017.",
      "expression": "sum(ph17)"
    },
    {
      "name": "Población mujeres 2017",
      "description": "Población de mujeres del año 2017.",
      "expression": "sum(pm17)"
    },
    {
      "name": "Población edad 0-17 2017",
      "description": "Población de edades entre 0 y 17 años del año 2017.",
      "expression": "sum(e001517)"
    },
    {
      "name": "Población edad 17-64 2017",
      "description": "Población de edades entre 17 y 64 años del año 2017.",
      "expression": "sum(e166417)"
    },
    {
      "name": "Población edad mayor 64 2017",
      "description": "Población de edad mayor de 64 años del año 2017.",
      "expression": "sum(e6517)"
    },
    {
      "name": "Población española 2017",
      "description": "Población española del año 2017.",
      "expression": "sum(esp17)"
    },
    {
      "name": "Población UE Schengen 2017",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2017.",
      "expression": "sum(ue1517)"
    },
    {
      "name": "Población magrebí 2017",
      "description": "Población de origen magrebí del año 2017.",
      "expression": "sum(mag17)"
    },
    {
      "name": "Población americana 2017",
      "description": "Población de origen americano del año 2017.",
      "expression": "sum(ams17)"
    },
    {
      "name": "Población otros 2017",
      "description": "Población de otros origenes del año 2017.",
      "expression": "sum(otr17)"
    },
    {
      "name": "Índice de dependencia total 2017",
      "description": "Índice de dependencia total de 2017. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001517)::float + sum(e6517)::float) / sum(e166417)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2017",
      "description": "Índice de dependencia infantil de 2017. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001517)::float) / sum(e166417)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2017",
      "description": "Índice de dependencia anciana de 2017. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6517)::float) / sum(e166417)::float)::numeric, 2)"
    },
    {
      "name": "Población total 2018",
      "description": "Población total del año 2018.",
      "expression": "sum(ptot18)"
    },
    {
      "name": "Población hombres 2018",
      "description": "Población de hombres del año 2018.",
      "expression": "sum(ph18)"
    },
    {
      "name": "Población mujeres 2018",
      "description": "Población de mujeres del año 2018.",
      "expression": "sum(pm18)"
    },
    {
      "name": "Población edad 0-18 2018",
      "description": "Población de edades entre 0 y 18 años del año 2018.",
      "expression": "sum(e001518)"
    },
    {
      "name": "Población edad 18-64 2018",
      "description": "Población de edades entre 18 y 64 años del año 2018.",
      "expression": "sum(e166418)"
    },
    {
      "name": "Población edad mayor 64 2018",
      "description": "Población de edad mayor de 64 años del año 2018.",
      "expression": "sum(e6518)"
    },
    {
      "name": "Población española 2018",
      "description": "Población española del año 2018.",
      "expression": "sum(esp18)"
    },
    {
      "name": "Población UE Schengen 2018",
      "description": "Población de origen Unión Europea (espacio Schengen) del año 2018.",
      "expression": "sum(ue1518)"
    },
    {
      "name": "Población magrebí 2018",
      "description": "Población de origen magrebí del año 2018.",
      "expression": "sum(mag18)"
    },
    {
      "name": "Población americana 2018",
      "description": "Población de origen americano del año 2018.",
      "expression": "sum(ams18)"
    },
    {
      "name": "Población otros 2018",
      "description": "Población de otros origenes del año 2018.",
      "expression": "sum(otr18)"
    },
    {
      "name": "Índice de dependencia total 2018",
      "description": "Índice de dependencia total de 2018. El índice de dependencia total es el cociente de la suma de población joven y anciana entre el total de adultos.",
      "expression": "round(((sum(e001518)::float + sum(e6518)::float) / sum(e166418)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia infantil 2018",
      "description": "Índice de dependencia infantil de 2018. El índice de dependencia infantil es el cociente de la suma de población joven entre el total de adultos.",
      "expression": "round(((sum(e001518)::float) / sum(e166418)::float)::numeric, 2)"
    },
    {
      "name": "Índice de dependencia anciana 2018",
      "description": "Índice de dependencia anciana de 2018. El índice de dependencia anciana es el cociente de la suma de población anciana entre el total de adultos.",
      "expression": "round(((sum(e6518)::float) / sum(e166418)::float)::numeric, 2)"
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
