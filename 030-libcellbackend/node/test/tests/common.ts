import { CellBackend, CatalogBackend, PgConnection, VariableBackend, GridderTasks as gt, GridBackend } from "../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { uniq, isEqual } from "lodash";

/**
 *
 * PG connection to the cellPg.
 *
 */
export const cellPg: PgConnection = new PgConnection({
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

export const cellPgConn: RxPg = cellPg.open();

/**
 *
 * PgConnection to kepler, internal.
 *
 */
export const cellRawData: PgConnection = new PgConnection({
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

export const cellRawDataConn: RxPg = cellRawData.open();

/**
 *
 * PgConnection to kepler, external.
 *
 */
export const cellRawDataExternal: PgConnection = new PgConnection({
  pgConnectionId: "cellRawDataConn",
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: "XXX",
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: "XXX",
  port: 5432,
  dbUser: "postgres",
  description: "Connection to Cell Raw Data database to consume original data vectors.",
  name: "Cell Raw Data"
});

export const cellRawDataExternalConn: RxPg = cellRawDataExternal.open();

/**
 *
 * Clear the database.
 *
 */
export const clearDatabase$: rx.Observable<boolean> = cellPgConn.executeQuery$(`
delete from cell_data.data;
delete from cell_meta.gridder_cell;
delete from cell_meta.gridder_job;
delete from cell_meta.gridder_task;
delete from cell_meta.variable;
delete from cell_meta.catalog;
delete from cell_meta.grid;
delete from cell_meta.pg_connection;
delete from cell_meta.cell_version;
`)
.pipe(

  rxo.map((o: QueryResult): boolean => {

    const commands = uniq(o.map((o: any) => o.command)).sort();
    return isEqual(commands, [ "DELETE" ]) ? true : false;

  })

)

/**
 *
 * DiscretePolygonTopAreaGridderTask.
 *
 */
export const municipioDiscretePolyTopAreaGridderTask: gt.DiscretePolyTopAreaGridderTaskBackend =
new gt.DiscretePolyTopAreaGridderTaskBackend({
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

export const municipioDiscretePolyAreaSummaryGridderTask: gt.DiscretePolyAreaSummaryGridderTaskBackend =
new gt.DiscretePolyAreaSummaryGridderTaskBackend({
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
export const variable: VariableBackend = new VariableBackend({
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
export const catalog: CatalogBackend = new CatalogBackend({
  gridderTaskId: "municipioDiscretePolyTopArea",
  variableId: "var",
  variable: variable
})

/**
 *
 * Grid.
 *
 */
export const gridBackend: GridBackend = new GridBackend({
  description: "A grid based on the official EU one",
  gridId: "eu-grid",
  name: "eu-grid",
  originEpsg: "3035",
  originX: 2700000,
  originY: 1500000,
  zoomLevels: [
    {"name": "100 km", "size": 100000},
    {"name": "50 km", "size": 50000},
    {"name": "10 km", "size": 10000},
    {"name": "5 km", "size": 5000},
    {"name": "1 km", "size": 1000},
    {"name": "500 m", "size": 500},
    {"name": "250 m", "size": 250},
    {"name": "125 m", "size": 125},
    {"name": "25 m", "size": 25},
    {"name": "5 m", "size": 5}
  ]
})

/**
 *
 * Cells.
 *
 */
export const cellBackends: CellBackend[] = [];

for (let z = 0; z<1; z++) {

  for (let x = 0; x<6; x++) {

    for (let y = 0; y<4; y++) {

      cellBackends.push(new CellBackend({
        epsg: "3035",
        gridId: "eu-grid",
        x: x,
        y: y,
        zoom: z,
        grid: gridBackend
      }))

    }

  }

}

export const testCell_0_2_2: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 2,
  grid: gridBackend
})

export const testCell_0_2_3: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 3,
  grid: gridBackend
})

export const testCell_0_3_2: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 2,
  grid: gridBackend
})

export const testCell_0_2_1: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 1,
  grid: gridBackend
})

export const testCell_0_3_1: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 1,
  grid: gridBackend
})

// This is a full coverage for municipios with a single municipio
export const testCell_2_27_32: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 27,
  y: 32,
  grid: gridBackend
})

// This is a partial coverage for municipios
export const testCell_2_24_31: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 24,
  y: 31,
  grid: gridBackend
})

// This is a full coverage with several municipios
export const testCell_2_28_30: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 28,
  y: 30,
  grid: gridBackend
})

// No coverage of municipios at all
export const testCell_2_25_32: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 2,
  x: 25,
  y: 32,
  grid: gridBackend
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

/**
 *
 * GridderCell.
 *
 */
export const gridderCellA: gt.GridderCell = new gt.GridderCell({
  gridderCellId: "gridderCellA",
  gridderJobId: "gridderJobHuelva",
  epsg: "3035",
  gridId: "eu-grid",
  x: 0,
  y: 0,
  zoom: 0
})
