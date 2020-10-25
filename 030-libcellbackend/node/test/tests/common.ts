import { CatalogBackend, PgConnection, VariableBackend, GridderTasks as gt } from "../../src/index";

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
  delete from cell_meta.gridder_task;
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
  sourceField: "sc_codigo",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catProv: CatalogBackend = new CatalogBackend({
  catalogId: "provincia",
  description: "Catálogo de provincias de Andalucía.",
  name: "Provincias",
  sourceField: "provincia",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catMuni: CatalogBackend = new CatalogBackend({
  catalogId: "municipio",
  description: "Catálogo de municipios de Andalucía.",
  name: "Municipios",
  sourceField: "municipio",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catNucp: CatalogBackend = new CatalogBackend({
  catalogId: "nuc_pobla",
  description: "Catálogo de núcleos de población de Andalucía.",
  name: "Núcleos población",
  sourceField: "nuc_pob",
  sourceTable: "poblacion.poblacion",
  pgConnectionId: "cellRawDataConn"
});

export const catNucPobNivel: CatalogBackend = new CatalogBackend({
  catalogId: "nuc_pob_nivel",
  description: "Catálogo de niveles de núcleos de población de Andalucía.",
  name: "Niveles de núcleos de población",
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
  description: "Población de edad en el rango de 0 a 15 años del año 2017."
});

/**
 *
 * DiscretePolygonTopAreaGridderTask.
 *
 */
export const provinceDiscretePolyTopAreaGridderTask: gt.DiscretePolyTopAreaGridderTaskBackend =
new gt.DiscretePolyTopAreaGridderTaskBackend({
  gridderTaskId: "provinceDiscretePolyTopArea",
  name: "Provincia: máxima área",
  description: "Asignada a la celda la variable discreta del nombre de la provincia en función de la que ocupa más área",
  nameTemplate: "Área provincia: {{{provincia}}}",
  descriptionTemplate: "Área de la provincia {{{provincia}}} en la celda",
  pgConnectionId: "cellRawDataConn",
  discreteFields: [ "provincia" ],
  geomField: "geom",
  sourceTable: "context.municipio"
});

export const provinceDiscretePolyAreaSummaryGridderTask: gt.DiscretePolyAreaSummaryGridderTaskBackend =
new gt.DiscretePolyAreaSummaryGridderTaskBackend({
  gridderTaskId: "provinceDiscreteAreaSummary",
  name: "Desglose de área de provincias",
  description: "Área de cada provincia en la celda",
  nameTemplate: "Área provincia: {{{provincia}}}",
  descriptionTemplate: "Área de la provincia {{{provincia}}} en la celda",
  pgConnectionId: "cellRawDataConn",
  discreteFields: [ "provincia" ],
  geomField: "geom",
  sourceTable: "context.municipio"
})
