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
  minPoolSize: 50,
  pass: "postgres",
  port: 5600,
  dbUser: "postgres",
  description: "Cell DB",
  name: "Cell DB"
});

export const cellPgConn: RxPg = cellPg.open();

/**
 *
 * PgConnections.
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
 * Clear the database.
 *
 */
export const clearDatabase$: rx.Observable<boolean> = cellPgConn.executeQuery$(`
delete from cell_meta.catalog;
delete from cell_meta.variable;
delete from cell_meta.gridder_task;
delete from cell_data.data;
delete from cell_meta.grid;
delete from cell_meta.pg_connection;
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

export const testCell022: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 2,
  grid: gridBackend
})

export const testCell032: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 2,
  grid: gridBackend
})

export const testCell021: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 2,
  y: 1,
  grid: gridBackend
})

export const testCell031: CellBackend = new CellBackend({
  epsg: "3035",
  gridId: "eu-grid",
  zoom: 0,
  x: 3,
  y: 1,
  grid: gridBackend
})
