import { readJsonSync } from "@malkab/node-utils";

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * Put here all common assets for tests. Tests should use as many common assets
 * as possible for common objects.
 *
 */

const cellPg: RxPg = new RxPg({
  host: "cell-db-postgis-dev",
  pass: "postgres",
  port: 5432,
  db: "cell"
})

/**
 *
 * Clear the database.
 *
 */
export const clearDatabase$: rx.Observable<boolean> = cellPg.executeParamQuery$(`
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
 * Read config for scripts, mounted at /config/basegeomgridding-config.json.
 *
 */

// DISCRETEPOLYTOPAREA
export const discretePolyTopAreaGridderConfig: any =
  readJsonSync([ "/config/gridder/gridder-config-discretepolytoparea.json" ]);

export const discretePolyTopAreaGridderSetUpConfig: any =
  readJsonSync([ "/config/griddersetup/griddersetup-config-discretepolytoparea.json" ]);

// DISCRETEPOLYAREASUMMARY
export const discretePolyAreaSummaryGridderConfig: any =
  readJsonSync([ "/config/gridder/gridder-config-discretepolyareasummary.json" ]);

export const discretePolyAreaSummaryGridderSetUpConfig: any =
  readJsonSync([ "/config/griddersetup/griddersetup-config-discretepolyareasummary.json" ]);

// POINTAGGREGATIONS
export const pointAggregationsGridderConfig: any =
  readJsonSync([ "/config/gridder/gridder-config-pointaggregations.json" ]);

export const pointAggregationsGridderSetUpConfig: any =
  readJsonSync([ "/config/griddersetup/griddersetup-config-pointaggregations.json" ]);

// POINTIDWINTERPOLATION
export const pointIdwInterpolationGridderConfig: any =
  readJsonSync([ "/config/gridder/gridder-config-pointidwinterpolation.json" ]);

export const pointIdwInterpolationGridderSetUpConfig: any =
  readJsonSync([ "/config/griddersetup/griddersetup-config-pointidwinterpolation.json" ]);

// MDTPROCESSING
export const mdtProcessingGridderConfig: any =
  readJsonSync([ "/config/gridder/gridder-config-mdtprocessing.json" ]);

export const mdtProcessingGridderSetUpConfig: any =
  readJsonSync([ "/config/griddersetup/griddersetup-config-mdtprocessing.json" ]);

// Export
export const exportConfig: any =
  readJsonSync([ "/config/export/export-config.json" ]);