import { Grid, GridderTasks as gt, PgConnection } from "@malkab/libcellbackend";

import { RxPg } from "@malkab/rxpg";

import { readJsonSync } from "@malkab/node-utils";

/**
 *
 * This script returns the base gridding based on an input area for a given zoom
 * level.
 *
 */
console.log("D: jejee", process.argv);

/**
 *
 * Read config.
 *
 */
// const vars: any = readJsonSync(pro)

// /**
//  *
//  * PG connection to the cellPg.
//  *
//  */
// const cellPg: PgConnection = new PgConnection({
//   pgConnectionId: "cellPg",
//   applicationName: "libcellbackend_base_geom_gridding",
//   db: "cell",
//   host: vars.e.MLKC_CELL_DB_HOST,
//   maxPoolSize: 200,
//   minPoolSize: 10,
//   pass: vars.e.MLKC_CELL_DB_PASS,
//   port: vars.e.MLKC_CELL_DB_PORT,
//   dbUser: vars.e.MLKC_CELL_DB_USER,
//   description: "Cell DB",
//   name: "Cell DB"
// });

// const cellPgConn: RxPg = cellPg.open();

// /**
//  *
//  * PgConnection to kepler, internal.
//  *
//  */
// const cellRawData: PgConnection = new PgConnection({
//   pgConnectionId: "cellRawData",
//   applicationName: "libcellbackend_base_geom_gridding",
//   db: "cell_raw_data",
//   host: vars.e.MLKC_CELL_DB_HOST,
//   maxPoolSize: 200,
//   minPoolSize: 10,
//   pass: vars.e.MLKC_CELL_DB_PASS,
//   port: vars.e.MLKC_CELL_DB_PORT,
//   dbUser: vars.e.MLKC_CELL_DB_USER,
//   description: "Connection to Cell Raw Data database to consume original data vectors.",
//   name: "Cell Raw Data"
// });

// const cellRawDataConn: RxPg = cellRawData.open();

// console.log("D: 333", cellRawData, cellPg);

// /**
//  *
//  * Grid.
//  *
//  */
// const eugrid: Grid = new Grid({
//   description: "A grid based on the official EU one",
//   gridId: "eu-grid",
//   name: "eu-grid",
//   originEpsg: "3035",
//   originX: 2700000,
//   originY: 1500000,
//   zoomLevels: [
//     {"name": "100 km", "size": 100000}, // 0
//     {"name": "50 km", "size": 50000},   // 1
//     {"name": "10 km", "size": 10000},   // 2
//     {"name": "5 km", "size": 5000},     // 3
//     {"name": "1 km", "size": 1000},     // 4
//     {"name": "500 m", "size": 500},     // 5
//     {"name": "250 m", "size": 250},     // 6
//     {"name": "125 m", "size": 125},     // 7
//     {"name": "25 m", "size": 25},       // 8
//     {"name": "5 m", "size": 5}          // 9
//   ]
// })

// /**
//  *
//  * Create the GridderJob. Here the target area is selected.
//  *
//  */
// const gridderJob: gt.GridderJob = new gt.GridderJob({
//   gridderJobId: "gridderJob",
//   gridderTaskId: "municipioDiscretePolyTopArea",
//   maxZoomLevel: 0,
//   minZoomLevel: 2,
//   sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
// })
