import {
  Cell, SourcePgConnection, Variable, Grid, GridderJob,
  DiscretePolyTopAreaGridderTask,
  DiscretePolyAreaSummaryGridderTask,
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
const pgCellParams: any = {
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
const pgSourceParams: any = {
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
export const cellPgConn: RxPg = new RxPg({
  applicationName: "libcellbackend_quick_test",
  db: "cell",
  host: pgCellParams.host,
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: pgCellParams.pass,
  port: pgCellParams.port
});

/**
 *
 * SourcePgConnection to kepler, external.
 *
 */
export const cellRawData: SourcePgConnection = new SourcePgConnection({
  sourcePgConnectionId: "cellRawDataConn",
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: pgSourceParams.host,
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: pgSourceParams.pass,
  port: pgSourceParams.port,
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
 * DiscretePolygonTopAreaGridderTask.
 *
 */
export const municipioDiscretePolyTopAreaGridderTask: DiscretePolyTopAreaGridderTask =
new DiscretePolyTopAreaGridderTask({
  gridderTaskId: "municipioDiscretePolyTopArea",
  gridId: "eu-grid",
  grid: eugrid,
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
 * DiscretePolyAreaSummaryGridderTask.
 *
 */
export const municipioDiscretePolyAreaSummaryGridderTask: DiscretePolyAreaSummaryGridderTask =
new DiscretePolyAreaSummaryGridderTask({
  gridderTaskId: "municipioDiscretePolyAreaSummary",
  gridId: "eu-grid",
  grid: eugrid,
  name: "Desglose de área de municipios",
  description: "Área de cada municipio en la celda, incluyendo su provincia",
  sourceTable: "context.municipio",
  geomField: "geom",
  discreteFields: [ "provincia", "municipio" ],
  variableNameTemplate: "Área {{{municipio}}} ({{{provincia}}})",
  variableDescriptionTemplate: "Área del municipio {{{municipio}}}, provincia {{{provincia}}}",
})

/**
 *
 * PointAggregationsGridderTask.
 *
 */
export const poblacionPointAggregationsGridderTask: PointAggregationsGridderTask =
new PointAggregationsGridderTask({
  gridderTaskId: "poblacionPointAggregations",
  gridId: "eu-grid",
  grid: eugrid,
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

/**
 *
 * PointIdwGridderTask.
 *
 */
export const mdtGridderTask: PointIdwGridderTask =
new PointIdwGridderTask({
  gridderTaskId: "mdtIdw",
  gridId: "eu-grid",
  grid: eugrid,
  name: "Interpolación MDT con IDW",
  description: "Interpolación del Modelo Digital del Terreno (MDT) mediante el método Inverse Distance Weighting.",
  sourceTable: "mdt.mdt",
  geomField: "geom",
  maxDistance: 200,
  numberOfPoints: 2,
  heightField: "h",
  round: 1,
  power: 2,
  variableName: "MDT según IDW",
  variableDescription: "Interpolación del MDT de 100 metros mediante IDW"
})

/**
 *
 * Variable.
 *
 */
export const variable: Variable = new Variable({
  gridderTaskId: "municipioDiscretePolyTopArea",
  name: "Var name",
  description: "Var description",
  gridderTask: municipioDiscretePolyTopAreaGridderTask
});

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
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 2,
  grid: eugrid
})

export const testCell_0_2_3: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 3,
  grid: eugrid
})

export const testCell_0_3_2: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 2,
  grid: eugrid
})

export const testCell_0_2_1: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 1,
  grid: eugrid
})

export const testCell_0_3_1: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 1,
  grid: eugrid
})

// This is a partial coverage for municipios
export const testCell_2_24_31: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 24,
  y: 31,
  grid: eugrid
})

// This is a full coverage with several municipios
export const testCell_2_28_30: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 28,
  y: 30,
  grid: eugrid
})

// No coverage of municipios at all
export const testCell_2_25_32: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 2,
  x: 25,
  y: 32,
  grid: eugrid
})

// Full coverage of a municipio, level 3
export const testCell_3_54_65: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 3,
  x: 54,
  y: 65,
  grid: eugrid
})

// Full coverage of a municipio, level 4 (1000 m)
export const testCell_4_270_329: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 4,
  x: 270,
  y: 329,
  grid: eugrid
})

// Level 5 (500 m)
export const testCell_5_108_130: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 5,
  x: 108,
  y: 130,
  grid: eugrid
})

// Level 6 (250 m)
export const testCell_6_216_260: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 5,
  x: 108,
  y: 130,
  grid: eugrid
})

// Level 7 (125 m)
export const testCell_7_2160_2560: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 7,
  x: 2160,
  y: 2560,
  grid: eugrid
})

// Level 8 (25 m)
export const testCell_8_10800_12800: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 8,
  x: 10800,
  y: 12800,
  grid: eugrid
})

// Level 9 (5 m)
export const testCell_9_54000_64000: Cell = new Cell({
  gridId: "eu-grid",
  zoom: 9,
  x: 54000,
  y: 64000,
  grid: eugrid
})

/**
 *
 * Cell family of (2,27,32): full coverage for municipios with a single
 * municipio
 *
 */
export const cellFamily_2_27_32: Cell[] = [
  new Cell({
    gridId: "eu-grid",
    zoom: 2,
    x: 27,
    y: 32,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 3,
    x: 54,
    y: 64,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 4,
    x: 270,
    y: 320,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 5,
    x: 540,
    y: 640,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 6,
    x: 1080,
    y: 1280,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 7,
    x: 2160,
    y: 2560,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 8,
    x: 10800,
    y: 12800,
    grid: eugrid
  }),
  new Cell({
    gridId: "eu-grid",
    zoom: 9,
    x: 54000,
    y: 64000,
    grid: eugrid
  })
]

/**
 *
 * Gridder Job for top area for Huelva.
 *
 */
export const gridderJobTopArea: GridderJob = new GridderJob({
  gridderJobId: "gridderJobTopArea",
  gridderTaskId: "municipioDiscretePolyTopArea",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * Gridder Job for area summary for Huelva.
 *
 */
export const gridderJobAreaSummary: GridderJob = new GridderJob({
  gridderJobId: "gridderJobAreaSummary",
  gridderTaskId: "municipioDiscretePolyAreaSummary",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * Gridder Job for point IDW for Huelva.
 *
 */
export const gridderJobPointIdw: GridderJob = new GridderJob({
  gridderJobId: "mdtPointIdw",
  gridderTaskId: "mdtIdw",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.provincia where provincia = 'Huelva'"
})

/**
 *
 * HIC Area Summary tests.
 *
 */

/**
 *
 * DiscretePolyAreaSummaryGridderTask, HIC.
 *
 */
export const hicAreaSummaryGridderTask: DiscretePolyAreaSummaryGridderTask =
new DiscretePolyAreaSummaryGridderTask({
  gridderTaskId: "hicAreaSummary",
  gridId: "eu-grid",
  grid: eugrid,
  name: "Desglose de área de Hábitats de Interés Comunitario (HIC)",
  description: "Área de cada categoría de Hábitats de Interés Comunitario (HIC)",
  sourceTable: "hic.hic_view",
  geomField: "geom",
  discreteFields: [ "descripcion" ],
  variableNameTemplate: "Área HIC {{{descripcion}}}",
  variableDescriptionTemplate: "Área del Hábitat de Interés Comunitario {{{descripcion}}}"
})

export const hicAreaSummaryGridderJob: GridderJob = new GridderJob({
  gridderJobId: "gridderJobHicAreaSummary",
  gridderTaskId: "hicAreaSummary",
  maxZoomLevel: 0,
  minZoomLevel: 2,
  sqlAreaRetrieval: "select geom from context.andalucia"
})
