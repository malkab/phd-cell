import { rxMochaTests, OrmError } from "@malkab/ts-utils";

import { CatalogBackend } from "../../src/index";

import { RxPg, QueryResult } from "@malkab/rxpg";

/**
 *
 * Databases.
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

export const cellRawDataPg: RxPg = new RxPg({
  applicationName: "libcellbackend_quick_test",
  db: "cell_raw_data",
  host: "localhost",
  maxPoolSize: 200,
  minPoolSize: 50,
  pass: "postgres",
  port: 5432,
  user: "postgres"
});
