import { SourcePgConnection, Variable, Grid, DiscretePolyTopAreaGridderTask,
  DiscretePolyAreaSummaryGridderTask } from "../../../src/index";

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
 * Municipio DiscretePolygonTopArea A.
 *
 */
export const gridderTaskDiscretePolyTopAreaMunicipioA: DiscretePolyTopAreaGridderTask =
new DiscretePolyTopAreaGridderTask({
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipioA",
  name : "Municipio máxima área A",
  description: "Teselado de municipios con sus provincias por máxima área usando el algoritmo DiscretePolyTopAreaGridderTask A",
  sourceTable: "context.municipio",
  geomField: "geom",
  discreteFields: [ "provincia", "municipio" ],
  variableName: "Municipio: máxima área A",
  variableDescription: "Nombre del municipio y su provincia del municipio que ocupa la mayor área de la celda A.",
  categoryTemplate: "{{{municipio}}} ({{{provincia}}})"
});

/**
 *
 * Municipio DiscretePolygonTopArea A.
 *
 */
export const gridderTaskDiscretePolyAreaSummaryMunicipioA: DiscretePolyAreaSummaryGridderTask =
  new DiscretePolyAreaSummaryGridderTask({
    gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipioA",
    name : "Municipio sumario área A",
    description: "Teselado del sumario de áreas de municipios con sus provincias usando el algoritmo  DiscretePolyAreaSummaryGridderTask A",
    sourceTable: "context.municipio",
    geomField: "geom",
    discreteFields: [ "provincia", "municipio" ],
    variableNameTemplate: "Área {{{municipio}}} ({{{provincia}}}) A",
    variableDescriptionTemplate: "Área del municipio {{{municipio}}}, provincia {{{provincia}}} A.",
    areaRound: 2
});

/**
 *
 * Municipio DiscretePolygonTopArea B.
 *
 */
 export const gridderTaskDiscretePolyTopAreaMunicipioB: DiscretePolyTopAreaGridderTask =
 new DiscretePolyTopAreaGridderTask({
   gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipioB",
   name : "Municipio máxima área B",
   description: "Teselado de municipios con sus provincias por máxima área usando el algoritmo DiscretePolyTopAreaGridderTask B",
   sourceTable: "context.municipio",
   geomField: "geom",
   discreteFields: [ "provincia", "municipio" ],
   variableName: "Municipio: máxima área B",
   variableDescription: "Nombre del municipio y su provincia del municipio que ocupa la mayor área de la celda B.",
   categoryTemplate: "{{{municipio}}} ({{{provincia}}})"
 });

 /**
  *
  * Municipio DiscretePolygonTopArea B.
  *
  */
 export const gridderTaskDiscretePolyAreaSummaryMunicipioB: DiscretePolyAreaSummaryGridderTask =
   new DiscretePolyAreaSummaryGridderTask({
     gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipioB",
     name : "Municipio sumario área B",
     description: "Teselado del sumario de áreas de municipios con sus provincias usando el algoritmo  DiscretePolyAreaSummaryGridderTask B",
     sourceTable: "context.municipio",
     geomField: "geom",
     discreteFields: [ "provincia", "municipio" ],
     variableNameTemplate: "Área {{{municipio}}} ({{{provincia}}}) B",
     variableDescriptionTemplate: "Área del municipio {{{municipio}}}, provincia {{{provincia}}} B.",
     areaRound: 2
 });

/**
 *
 * Variable variableGridderTaskDiscretePolyTopAreaMunicipio A.
 *
 */
export const variableGridderTaskDiscretePolyTopAreaMunicipioA: Variable =
new Variable({
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipioA",
  name: "Var variableGridderTaskDiscretePolyTopAreaMunicipio A",
  description: "Var variableGridderTaskDiscretePolyTopAreaMunicipio description A.",
  gridderTask: gridderTaskDiscretePolyTopAreaMunicipioA
});

/**
 *
 * Variable variableGridderTaskDiscretePolyTopAreaMunicipio A.
 *
 */
export const variableGridderTaskDiscretePolyAreaSummaryMunicipioA: Variable =
new Variable({
  gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipioA",
  name: "Var variableGridderTaskDiscretePolyAreaSummaryMunicipio A",
  description: "Var variableGridderTaskDiscretePolyAreaSummaryMunicipio description A.",
  gridderTask: gridderTaskDiscretePolyAreaSummaryMunicipioA
});

/**
 *
 * Variable variableGridderTaskDiscretePolyTopAreaMunicipio B.
 *
 */
 export const variableGridderTaskDiscretePolyTopAreaMunicipioB: Variable =
 new Variable({
   gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipioB",
   name: "Var variableGridderTaskDiscretePolyTopAreaMunicipio B",
   description: "Var variableGridderTaskDiscretePolyTopAreaMunicipio description B.",
   gridderTask: gridderTaskDiscretePolyTopAreaMunicipioB
 });

 /**
  *
  * Variable variableGridderTaskDiscretePolyTopAreaMunicipio B.
  *
  */
 export const variableGridderTaskDiscretePolyAreaSummaryMunicipioB: Variable =
 new Variable({
   gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipioB",
   name: "Var variableGridderTaskDiscretePolyAreaSummaryMunicipio B",
   description: "Var variableGridderTaskDiscretePolyAreaSummaryMunicipio description B.",
   gridderTask: gridderTaskDiscretePolyAreaSummaryMunicipioB
 });

/**
 *
 * SQL export results.
 *
 */
export const sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioA: string = "select grid_id, epsg, zoom, x, y, b.value as var_variablegriddertaskdiscretepolytopareamunicipio_a, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '6' and data ->> '6' = b.key where data ? '6'";

export const sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioA: string = "select grid_id, epsg, zoom, x, y, data ->> '8' as var_variablegriddertaskdiscretepolyareasummarymunicipio_a, geom from cell_data.data where data ? '8'";

export const sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioB: string = "select grid_id, epsg, zoom, x, y, b.value as var_variablegriddertaskdiscretepolytopareamunicipio_b, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'b' and data ->> 'b' = b.key where data ? 'b'";

export const sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioB: string = "select grid_id, epsg, zoom, x, y, data ->> 'c' as var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data where data ? 'c'";

export const sqlTotalExportWithZoom: string = "with var_variablegriddertaskdiscretepolytopareamunicipio_a as (select grid_id, epsg, zoom, x, y, b.value as var_variablegriddertaskdiscretepolytopareamunicipio_a, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '6' and data ->> '6' = b.key where data ? '6'), var_variablegriddertaskdiscretepolyareasummarymunicipio_a as (select grid_id, epsg, zoom, x, y, data ->> '8' as var_variablegriddertaskdiscretepolyareasummarymunicipio_a, geom from cell_data.data where data ? '8'), var_variablegriddertaskdiscretepolytopareamunicipio_b as (select grid_id, epsg, zoom, x, y, b.value as var_variablegriddertaskdiscretepolytopareamunicipio_b, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'b' and data ->> 'b' = b.key where data ? 'b'), var_variablegriddertaskdiscretepolyareasummarymunicipio_b as (select grid_id, epsg, zoom, x, y, data ->> 'c' as var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data where data ? 'c') select a.grid_id, a.epsg, a.zoom, a.x, a.y, var_variablegriddertaskdiscretepolytopareamunicipio_a, var_variablegriddertaskdiscretepolyareasummarymunicipio_a, var_variablegriddertaskdiscretepolytopareamunicipio_b, var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data t0 left join var_variablegriddertaskdiscretepolytopareamunicipio_a t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y left join var_variablegriddertaskdiscretepolyareasummarymunicipio_a t2 on t0.zoom=t2.zoom and t0.x=t2.x and t0.y=t2.y left join var_variablegriddertaskdiscretepolytopareamunicipio_b t3 on t0.zoom=t3.zoom and t0.x=t3.x and t0.y=t3.y left join var_variablegriddertaskdiscretepolyareasummarymunicipio_b t4 on t0.zoom=t4.zoom and t0.x=t4.x and t0.y=t4.y where var_variablegriddertaskdiscretepolytopareamunicipio_a is not null and var_variablegriddertaskdiscretepolyareasummarymunicipio_a is not null and var_variablegriddertaskdiscretepolytopareamunicipio_b is not null and var_variablegriddertaskdiscretepolyareasummarymunicipio_b is not null and t0.zoom between 0 and 4 order by t0.zoom, t0.x, t0.y;";

export const sqlTotalExportWithoutZoom: string = "with var_variablegriddertaskdiscretepolytopareamunicipio_a as (select grid_id, epsg, zoom, x, y, b.value as var_variablegriddertaskdiscretepolytopareamunicipio_a, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '6' and data ->> '6' = b.key where data ? '6'), var_variablegriddertaskdiscretepolyareasummarymunicipio_a as (select grid_id, epsg, zoom, x, y, data ->> '8' as var_variablegriddertaskdiscretepolyareasummarymunicipio_a, geom from cell_data.data where data ? '8'), var_variablegriddertaskdiscretepolytopareamunicipio_b as (select grid_id, epsg, zoom, x, y, b.value as var_variablegriddertaskdiscretepolytopareamunicipio_b, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'b' and data ->> 'b' = b.key where data ? 'b'), var_variablegriddertaskdiscretepolyareasummarymunicipio_b as (select grid_id, epsg, zoom, x, y, data ->> 'c' as var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data where data ? 'c') select a.grid_id, a.epsg, a.zoom, a.x, a.y, var_variablegriddertaskdiscretepolytopareamunicipio_a, var_variablegriddertaskdiscretepolyareasummarymunicipio_a, var_variablegriddertaskdiscretepolytopareamunicipio_b, var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data t0 left join var_variablegriddertaskdiscretepolytopareamunicipio_a t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y left join var_variablegriddertaskdiscretepolyareasummarymunicipio_a t2 on t0.zoom=t2.zoom and t0.x=t2.x and t0.y=t2.y left join var_variablegriddertaskdiscretepolytopareamunicipio_b t3 on t0.zoom=t3.zoom and t0.x=t3.x and t0.y=t3.y left join var_variablegriddertaskdiscretepolyareasummarymunicipio_b t4 on t0.zoom=t4.zoom and t0.x=t4.x and t0.y=t4.y where var_variablegriddertaskdiscretepolytopareamunicipio_a is not null and var_variablegriddertaskdiscretepolyareasummarymunicipio_a is not null and var_variablegriddertaskdiscretepolytopareamunicipio_b is not null and var_variablegriddertaskdiscretepolyareasummarymunicipio_b is not null order by t0.zoom, t0.x, t0.y;";
