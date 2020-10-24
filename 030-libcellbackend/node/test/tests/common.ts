import { CatalogBackend, PgConnection, VariableBackend, VectorBackend } from "../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { uniq, isEqual } from "lodash";

/**
 *
 * PG connection to the cellPg.
 *
 */
export const cellPg: RxPg = new RxPg({
  applicationName: "libcellbackend_quick_test",
  db: "cell",
  host: "localhost",
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: "postgres",
  port: 5600,
  user: "postgres"
});

/**
 *
 * PgConnections.
 *
 */
export const cellRawDataConn: PgConnection = new PgConnection({
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
  name: "Cell Raw Data",
  title: "Cell Raw Data Connection"
});

/**
 *
 * Clear the database.
 *
 */
export const clearDatabase$: rx.Observable<boolean> = cellPg.executeQuery$(`
  delete from cell_meta.catalog;
  delete from cell_meta.pg_connection;
  delete from cell_meta.variable;
  delete from cell_meta.vector;
`)
.pipe(

  rxo.map((o: QueryResult): boolean => {

    const commands = uniq(o.map((o: any) => o.command)).sort();
    return isEqual(commands, [ "DELETE" ]) ? true : false;

  })

)

/**
 *
 * Catalogs.
 *
 */
export const catScen: CatalogBackend = new CatalogBackend({
  catalogId: "sc_codigo",
  description: "Catálogo de secciones censales de Andalucía.",
  name: "Secciones censales",
  title: "Catálogo de secciones censales",
  sourceField: "sc_codigo",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catProv: CatalogBackend = new CatalogBackend({
  catalogId: "provincia",
  description: "Catálogo de provincias de Andalucía.",
  name: "Provincias",
  title: "Catálogo de provincias",
  sourceField: "provincia",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catMuni: CatalogBackend = new CatalogBackend({
  catalogId: "municipio",
  description: "Catálogo de municipios de Andalucía.",
  name: "Municipios",
  title: "Catálogo de municipios",
  sourceField: "municipio",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catNucp: CatalogBackend = new CatalogBackend({
  catalogId: "nuc_pobla",
  description: "Catálogo de núcleos de población de Andalucía.",
  name: "Núcleos población",
  title: "Catálogo de municipios",
  sourceField: "nuc_pob",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catNucPobNivel: CatalogBackend = new CatalogBackend({
  catalogId: "nuc_pob_nivel",
  description: "Catálogo de niveles de núcleos de población de Andalucía.",
  name: "Niveles de núcleos de población",
  title: "Catálogo de niveles de población",
  sourceField: "nuc_pob_nivel",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

/**
 *
 * Variables.
 *
 */
export const varE001517: VariableBackend = new VariableBackend({
  variableId: "e001517",
  name: "Edad 00-15 2017",
  title: "Población de edad entre 00-15 2017",
  description: "Población de edad en el rango de 0 a 15 años del año 2017.",
  pgConnectionId: "cellRawDataConn",
  sourceField: "e001517",
  sourceTable: "poblacion.poblacion"
});

export const varE001518: VariableBackend = new VariableBackend({
  variableId: "e001518",
  name: "Edad 00-15 2018",
  title: "Población de edad entre 00-15 2018",
  description: "Población de edad en el rango de 0 a 15 años del año 2018.",
  pgConnectionId: "cellRawDataConn",
  sourceField: "e001518",
  sourceTable: "poblacion.poblacion"
});

export const varE166417: VariableBackend = new VariableBackend({
  variableId: "e166417",
  name: "Edad 16-64 2017",
  title: "Población de edad entre 16-64 2017",
  description: "Población de edad en el rango de 16 a 64 años del año 2017.",
  pgConnectionId: "cellRawDataConn",
  sourceField: "e166417",
  sourceTable: "poblacion.poblacion"
});

export const varE166418: VariableBackend = new VariableBackend({
  variableId: "e166418",
  name: "Edad 16-64 2018",
  title: "Población de edad entre 16-64 2018",
  description: "Población de edad en el rango de 16 a 64 años del año 2018.",
  pgConnectionId: "cellRawDataConn",
  sourceField: "e166418",
  sourceTable: "poblacion.poblacion"
});

/**
 *
 * Vector.
 *
 */
export const vectorPob: VectorBackend = new VectorBackend({
  vectorId: "poblacion",
  name: "Población",
  title: "Vector de población",
  description: "Un vector de ejemplo para población.",
  pgConnectionId: "cellRawDataConn",
  sourceTable: "poblacion.poblacion",
  catalogNames: [ "provincia", "municipio" ],
  variableNames: [ "e001517", "e001518", "e166417", "e166418" ],
  catalogFieldNames: [ "provincia", "municipio" ]
});
