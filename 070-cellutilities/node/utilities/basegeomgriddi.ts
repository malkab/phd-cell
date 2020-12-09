import { Grid, GridderTasks as gt, PgConnection } from "../src/index";

import { RxPg } from "@malkab/rxpg";

/**
 *
 * This script returns the base gridding based on an input area for a given zoom
 * level.
 *
 */

console.log("D: jej3j3j3j3j");

/**
 *
 * PG connection to the cellPg.
 *
 */
const cellPg: PgConnection = new PgConnection({
  pgConnectionId: "cellPg",
  applicationName: "libcellbackend_quick_test",
  db: "cell",
  host: "localhost",
  maxPoolSize: 200,
  minPoolSize: 200,
  pass: "postgres",
  port: 5600,
  dbUser: "postgres",
  description: "Cell DB",
  name: "Cell DB"
});

const cellPgConn: RxPg = cellPg.open();

/**
 *
 * PgConnection to kepler, internal.
 *
 */
const cellRawData: PgConnection = new PgConnection({
  pgConnectionId: "cellRawDataConn",
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: "localhost",
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: "postgres",
  port: 5432,
  dbUser: "postgres",
  description: "Connection to Cell Raw Data database to consume original data vectors.",
  name: "Cell Raw Data"
});

const cellRawDataConn: RxPg = cellRawData.open();

/**
 *
 * Grid.
 *
 */
const eugrid: Grid = new Grid({
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
 * The GridderTask.
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

/**
 *
 * Create the GridderJob. Here the target area is selected.
 *
 */
const gridderJob: gt.GridderJob = new gt.GridderJob({
  gridderJobId: "gridderJob",
  gridderTaskId: "municipioDiscretePolyTopArea",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})
