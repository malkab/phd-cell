import { exportSql$ } from "@malkab/libcellbackend";

import { RxPg } from "@malkab/rxpg";

import { exit } from "process";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { ELOGLEVELS, NodeLogger } from "@malkab/node-logger";

/**
 *
 * Library for command line utility export.
 *
 */
export function process$(params: any): rx.Observable<any> {

  // Check for verbose parameter
  const verbose: boolean = params.verbose ? params.verbose : false;

  const logger: NodeLogger = new NodeLogger({
    appName: "export",
    consoleOut: false,
    minLogLevel: ELOGLEVELS.DEBUG,
    logFilePath: "."
  })

  logger.logInfo({
    message: `initilizing process`,
    methodName: "process$",
    moduleName: "export"
  })

  /**
   *
   * PG connection to the cellPg.
   *
   */
  const cellPgConn: RxPg = new RxPg({
    applicationName: "cellutility_export",
    db: "cell",
    host: params.cellPg.host,
    maxPoolSize: 200,
    minPoolSize: 10,
    pass: params.cellPg.pass,
    port: params.cellPg.port,
    user: params.cellPg.user
  })

  // Test cellPg connection
  cellPgConn.executeParamQuery$("select 0").subscribe(

    (o: any) => {

      logger.logInfo({
        message: `connected with Cell PG at ${params.cellPg.host}`,
        methodName: "process$",
        moduleName: "export"
      })

    },

    (o: Error) => {

      logger.logError({
        message: `error connecting with Cell PG at ${params.cellPg.host}`,
        methodName: "process$",
        moduleName: "export"
      })

      exit(-1);

    }

  )

  // Get the SQL
  return exportSql$(
    cellPgConn,
    params.mvName,
    params.variableKeys,
    {
      minZoom: params.minZoom,
      maxZoom: params.maxZoom,
      schema: params.schema,
      pgSqlDataTypes: params.pgSqlDataTypes,
      addNullityFields: params.addNullityFields,
      excludeNullityFields: params.excludeNullityFields
    }
  ).pipe(

    // Compute the cell
    rxo.map((o: string) => {

      logger.logInfo({
        message: `SQL generated`,
        methodName: "process$",
        moduleName: "export"
      });

      return o;

    }),

    // Final signal
    rxo.finalize(() => {

      logger.logInfo({
        message: `export finished`,
        methodName: "process$",
        moduleName: "export"
      });

    })

  )

}
