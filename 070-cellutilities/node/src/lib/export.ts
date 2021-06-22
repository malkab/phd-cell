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
    consoleOut: verbose,
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
        moduleName: "gridder"
      })

    },

    (o: Error) => {

      logger.logError({
        message: `error connecting with Cell PG at ${params.cellPg.host}`,
        methodName: "process$",
        moduleName: "gridder"
      })

      exit(-1);

    }

  )

  // Get the SQL
  return exportSql$(cellPgConn, params.variableKeys, params.minZoom,
  params.maxZoom).pipe(

    // Compute the cell
    rxo.map((o: string) => {

      logger.logInfo({
        message: `added objects to the DB`,
        methodName: "process$",
        moduleName: "export"
      });

      console.log(o);

    }),

    // Final signal
    rxo.finalize(() => {

      logger.logInfo({
        message: `gridding finished`,
        methodName: "process$",
        moduleName: "export"
      });

    })

  )

}
