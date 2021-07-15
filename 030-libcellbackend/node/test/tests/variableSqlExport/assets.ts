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
export const sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioA: string =
  "create materialized view a.a as select grid_id, epsg, zoom, x, y, b.value::float as var_variablegriddertaskdiscretepolytopareamunicipio_a, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '6' and data ->> '6' = b.key where data ? '6' and zoom between 1 and 5; create index idx_a on a.a using btree(grid_id, epsg, zoom, x, y);";

export const sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioA: string =
  "create materialized view a.a as select grid_id, epsg, zoom, x, y, (data ->> '8')::float as var_variablegriddertaskdiscretepolyareasummarymunicipio_a, geom from cell_data.data where data ? '8' and zoom between 1 and 5; create index idx_a on a.a using btree(grid_id, epsg, zoom, x, y);";

export const sqlExportVariableGridderTaskDiscretePolyTopAreaMunicipioB: string =
  "create materialized view a.a as select grid_id, epsg, zoom, x, y, b.value::float as var_variablegriddertaskdiscretepolytopareamunicipio_b, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'b' and data ->> 'b' = b.key where data ? 'b' and zoom between 1 and 5; create index idx_a on a.a using btree(grid_id, epsg, zoom, x, y);";

export const sqlExportVariableGridderTaskDiscretePolyAreaSummaryMunicipioB: string =
  "create materialized view a.a as select grid_id, epsg, zoom, x, y, (data ->> 'c')::float as var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data where data ? 'c' and zoom between 1 and 5; create index idx_a on a.a using btree(grid_id, epsg, zoom, x, y);";

export const sqlTotalExportWithZoom: string =
  "create materialized view s.mv__029f752d3442ef66cc7f1e9f4b7496bf4c8542e946af6ccabccef557200b9896 as select grid_id, epsg, zoom, x, y, b.value::a as var_variablegriddertaskdiscretepolytopareamunicipio_a, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '6' and data ->> '6' = b.key where data ? '6' and zoom between 0 and 4; create index idx_mv__029f752d3442ef66cc7f1e9f4b7496bf4c8542e946af6ccabccef557200b9896 on s.mv__029f752d3442ef66cc7f1e9f4b7496bf4c8542e946af6ccabccef557200b9896 using btree(grid_id, epsg, zoom, x, y); create materialized view s.mv__4db7b68c3aa2bc9d4edd8beca2003c41f8a113be72f0cf19ad5dee1ad918429a as select grid_id, epsg, zoom, x, y, (data ->> '8')::b as var_variablegriddertaskdiscretepolyareasummarymunicipio_a, geom from cell_data.data where data ? '8' and zoom between 0 and 4; create index idx_mv__4db7b68c3aa2bc9d4edd8beca2003c41f8a113be72f0cf19ad5dee1ad918429a on s.mv__4db7b68c3aa2bc9d4edd8beca2003c41f8a113be72f0cf19ad5dee1ad918429a using btree(grid_id, epsg, zoom, x, y); create materialized view s.mv__df51c11d5e5e77833c5a4736052fdced94641f0aa915c45173f50d20b4602f96 as select grid_id, epsg, zoom, x, y, b.value::c as var_variablegriddertaskdiscretepolytopareamunicipio_b, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'b' and data ->> 'b' = b.key where data ? 'b' and zoom between 0 and 4; create index idx_mv__df51c11d5e5e77833c5a4736052fdced94641f0aa915c45173f50d20b4602f96 on s.mv__df51c11d5e5e77833c5a4736052fdced94641f0aa915c45173f50d20b4602f96 using btree(grid_id, epsg, zoom, x, y); create materialized view s.mv__4877f5425d5be6ddd5ec693c323f1ccaac235ee77b2a3d25fa3da34c9d242609 as select grid_id, epsg, zoom, x, y, (data ->> 'c')::d as var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data where data ? 'c' and zoom between 0 and 4; create index idx_mv__4877f5425d5be6ddd5ec693c323f1ccaac235ee77b2a3d25fa3da34c9d242609 on s.mv__4877f5425d5be6ddd5ec693c323f1ccaac235ee77b2a3d25fa3da34c9d242609 using btree(grid_id, epsg, zoom, x, y); create materialized view s.a as select t0.grid_id as grid_id, t0.epsg as epsg, t0.zoom as zoom, t0.x as x, t0.y as y,var_variablegriddertaskdiscretepolytopareamunicipio_a,var_variablegriddertaskdiscretepolyareasummarymunicipio_a,var_variablegriddertaskdiscretepolytopareamunicipio_b,var_variablegriddertaskdiscretepolyareasummarymunicipio_b, t0.geom from cell_data.data t0 left join s.mv__029f752d3442ef66cc7f1e9f4b7496bf4c8542e946af6ccabccef557200b9896 t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y left join s.mv__4db7b68c3aa2bc9d4edd8beca2003c41f8a113be72f0cf19ad5dee1ad918429a t2 on t0.zoom=t2.zoom and t0.x=t2.x and t0.y=t2.y left join s.mv__df51c11d5e5e77833c5a4736052fdced94641f0aa915c45173f50d20b4602f96 t3 on t0.zoom=t3.zoom and t0.x=t3.x and t0.y=t3.y left join s.mv__4877f5425d5be6ddd5ec693c323f1ccaac235ee77b2a3d25fa3da34c9d242609 t4 on t0.zoom=t4.zoom and t0.x=t4.x and t0.y=t4.y where not(var_variablegriddertaskdiscretepolytopareamunicipio_a is null) and t0.zoom between 0 and 4 order by t0.zoom, t0.x, t0.y; create index a_idx on s.a using btree(grid_id, epsg, zoom, x, y);";

export const sqlTotalExportWithoutZoom: string =
  "create materialized view public.mv__37085adf840f3e0f6d16517960b19f9f938b3429d858a3dd1af07d016e4f77bd as select grid_id, epsg, zoom, x, y, b.value::varchar as var_variablegriddertaskdiscretepolytopareamunicipio_a, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = '6' and data ->> '6' = b.key where data ? '6'; create index idx_mv__37085adf840f3e0f6d16517960b19f9f938b3429d858a3dd1af07d016e4f77bd on public.mv__37085adf840f3e0f6d16517960b19f9f938b3429d858a3dd1af07d016e4f77bd using btree(grid_id, epsg, zoom, x, y); create materialized view public.mv__f2929e3e213ac67459ec7dce38be12cc1888dba712d1273f7525895d608b7d6a as select grid_id, epsg, zoom, x, y, (data ->> '8')::numeric as var_variablegriddertaskdiscretepolyareasummarymunicipio_a, geom from cell_data.data where data ? '8'; create index idx_mv__f2929e3e213ac67459ec7dce38be12cc1888dba712d1273f7525895d608b7d6a on public.mv__f2929e3e213ac67459ec7dce38be12cc1888dba712d1273f7525895d608b7d6a using btree(grid_id, epsg, zoom, x, y); create materialized view public.mv__a6c21fd57acc1c97868957171bad2e898271bf16900ad392b22a7867399a2567 as select grid_id, epsg, zoom, x, y, b.value::varchar as var_variablegriddertaskdiscretepolytopareamunicipio_b, geom from cell_data.data a inner join cell_meta.catalog b on b.variable_key = 'b' and data ->> 'b' = b.key where data ? 'b'; create index idx_mv__a6c21fd57acc1c97868957171bad2e898271bf16900ad392b22a7867399a2567 on public.mv__a6c21fd57acc1c97868957171bad2e898271bf16900ad392b22a7867399a2567 using btree(grid_id, epsg, zoom, x, y); create materialized view public.mv__db1a1e7ecfce840fb639b15a4a9e6e777e87fcb5effbc9dbcb652b1170d8fbac as select grid_id, epsg, zoom, x, y, (data ->> 'c')::numeric as var_variablegriddertaskdiscretepolyareasummarymunicipio_b, geom from cell_data.data where data ? 'c'; create index idx_mv__db1a1e7ecfce840fb639b15a4a9e6e777e87fcb5effbc9dbcb652b1170d8fbac on public.mv__db1a1e7ecfce840fb639b15a4a9e6e777e87fcb5effbc9dbcb652b1170d8fbac using btree(grid_id, epsg, zoom, x, y); create materialized view public.a as select t0.grid_id as grid_id, t0.epsg as epsg, t0.zoom as zoom, t0.x as x, t0.y as y,var_variablegriddertaskdiscretepolytopareamunicipio_a,var_variablegriddertaskdiscretepolyareasummarymunicipio_a,var_variablegriddertaskdiscretepolytopareamunicipio_b,var_variablegriddertaskdiscretepolyareasummarymunicipio_b, t0.geom from cell_data.data t0 left join public.mv__37085adf840f3e0f6d16517960b19f9f938b3429d858a3dd1af07d016e4f77bd t1 on t0.zoom=t1.zoom and t0.x=t1.x and t0.y=t1.y left join public.mv__f2929e3e213ac67459ec7dce38be12cc1888dba712d1273f7525895d608b7d6a t2 on t0.zoom=t2.zoom and t0.x=t2.x and t0.y=t2.y left join public.mv__a6c21fd57acc1c97868957171bad2e898271bf16900ad392b22a7867399a2567 t3 on t0.zoom=t3.zoom and t0.x=t3.x and t0.y=t3.y left join public.mv__db1a1e7ecfce840fb639b15a4a9e6e777e87fcb5effbc9dbcb652b1170d8fbac t4 on t0.zoom=t4.zoom and t0.x=t4.x and t0.y=t4.y where not(var_variablegriddertaskdiscretepolytopareamunicipio_a is null and var_variablegriddertaskdiscretepolyareasummarymunicipio_a is null and var_variablegriddertaskdiscretepolytopareamunicipio_b is null and var_variablegriddertaskdiscretepolyareasummarymunicipio_b is null) order by t0.zoom, t0.x, t0.y; create index a_idx on public.a using btree(grid_id, epsg, zoom, x, y);";
