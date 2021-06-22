import { SourcePgConnection, Variable, Grid, DiscretePolyTopAreaGridderTask}
  from "../../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

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

/**
 *
 * Variable default.
 *
 */
export const variableDefault: Variable = new Variable({
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipio",
  name: "Var default name (ñáéíóú./-¿?¡!*+)",
  description: "Var default description",
  gridderTask: gridderTaskDiscretePolyTopAreaMunicipio
});

/**
 *
 * SQL export result.
 *
 */
export const sqlExport: string = "select grid_id, epsg, zoom, x, y, b.value as var_default_name_nyaeiou__, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'c' and data ->> 'c' = b.key where data ? 'c'";
