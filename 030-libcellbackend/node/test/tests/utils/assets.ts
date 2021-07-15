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
 * Municipio Polygon Area Summary.
 *
 */
export const gridderTaskDiscretePolyAreaSummaryMunicipio: DiscretePolyAreaSummaryGridderTask =
new DiscretePolyAreaSummaryGridderTask({
   gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipio",
   name : "Sumario de áreas de municipios",
   description: "Sumario de áreas de municipios con sus provincias.",
   sourceTable: "context.municipio",
   geomField: "geom",
   discreteFields: [ "provincia", "municipio" ],
   variableNameTemplate: "Área {{{municipio}}} ({{{provincia}}})",
   variableDescriptionTemplate: "Área del municipio {{{municipio}}}, provincia {{{provincia}}}."
 });

/**
 *
 * Variable top area.
 *
 */
export const variableTopArea: Variable = new Variable({
  gridderTaskId: "gridderTaskDiscretePolyTopAreaMunicipio",
  name: "Var top area",
  description: "Var top area description",
  gridderTask: gridderTaskDiscretePolyTopAreaMunicipio
});

/**
 *
 * Variable area summary.
 *
 */
 export const variableAreaSummary: Variable = new Variable({
  gridderTaskId: "gridderTaskDiscretePolyAreaSummaryMunicipio",
  name: "Var area summary",
  description: "Var area summary description",
  gridderTask: gridderTaskDiscretePolyAreaSummaryMunicipio
});

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
 * SQL export result.
 *
 */
export const sqlExport: string =
  "create materialized view export.mv__02c56b0f888fcb70f3099dc1b2d925fb87c282a6e32962749d63672718bb383c as select grid_id, epsg, zoom, x, y, b.value::t0 as var_top_area, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'e' and data ->> 'e' = b.key where data ? 'e' and zoom between 1 and 3; create index idx_mv__02c56b0f888fcb70f3099dc1b2d925fb87c282a6e32962749d63672718bb383c on export.mv__02c56b0f888fcb70f3099dc1b2d925fb87c282a6e32962749d63672718bb383c using btree(grid_id, epsg, zoom, x, y); create materialized view export.mv__951a919faa1c46d26cc1f520bfdd72bfc2245c24c67bd2b9cbb73e346adfe6bd as select grid_id, epsg, zoom, x, y, (data ->> '2')::t1 as var_area_summary, geom from cell_data.data where data ? '2' and zoom between 1 and 3; create index idx_mv__951a919faa1c46d26cc1f520bfdd72bfc2245c24c67bd2b9cbb73e346adfe6bd on export.mv__951a919faa1c46d26cc1f520bfdd72bfc2245c24c67bd2b9cbb73e346adfe6bd using btree(grid_id, epsg, zoom, x, y); create materialized view export.mv__mv as select t0.grid_id as grid_id, t0.epsg as epsg, t0.zoom as zoom, t0.x as x, t0.y as y,var_top_area,var_area_summary, t0.geom from cell_data.data t0 left join export.mv__02c56b0f888fcb70f3099dc1b2d925fb87c282a6e32962749d63672718bb383c t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y left join export.mv__951a919faa1c46d26cc1f520bfdd72bfc2245c24c67bd2b9cbb73e346adfe6bd t2 on t0.zoom=t2.zoom and t0.x=t2.x and t0.y=t2.y where not(var_top_area is null and var_area_summary is null) and t0.zoom between 1 and 3 order by t0.zoom, t0.x, t0.y; create index mv__mv_idx on export.mv__mv using btree(grid_id, epsg, zoom, x, y);";
