import {
  Cell, Grid, SourcePgConnection, GridderTask,
  gridderTaskGet$
} from "@malkab/libcellbackend";

import { RxPg } from "@malkab/rxpg";

import { exit } from "process";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { ELOGLEVELS, NodeLogger } from "@malkab/node-logger";

/**
 *
 * Library for command line utility gridder.
 *
 */
export function process$(params: any): rx.Observable<any> {

  // Check for verbose parameter
  const verbose: boolean = params.verbose ? params.verbose : false;

  const logger: NodeLogger = new NodeLogger({
    appName: "gridder",
    consoleOut: verbose,
    minLogLevel: ELOGLEVELS.DEBUG,
    logFilePath: "."
  })

  logger.logInfo({
    message: `initilizing process`,
    methodName: "process$",
    moduleName: "gridder"
  })

  /**
   *
   * PG connection to the cellPg.
   *
   */
  const cellPgConn: RxPg = new RxPg({
    applicationName: "cellutility_base_geom_gridding",
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

  /**
   *
   * PgConnection to source.
   *
   */
  const cellRawData: SourcePgConnection = new SourcePgConnection({
    sourcePgConnectionId: "cellRawData",
    applicationName: "cellutility_base_geom_gridding",
    db: params.sourcePg.db,
    host: params.sourcePg.host,
    maxPoolSize: 200,
    minPoolSize: 10,
    pass: params.sourcePg.pass,
    port: params.sourcePg.port,
    dbUser: params.sourcePg.user,
    description: "Connection to Cell Raw Data database to consume original data vectors.",
    name: "Cell Raw Data"
  });

  const cellRawDataConn: RxPg = cellRawData.open();

  // Add the connection to source to the parameters of the gridder task
  params.gridderTask.pgConnectionId = "cellRawData";

  // Test source PG connection
  cellRawDataConn.executeParamQuery$("select 0").subscribe(

    (o: any) => {

      logger.logInfo({
        message: `connected with source PG at ${cellRawData.host}`,
        methodName: "process$",
        moduleName: "gridder"
      })

    },

    (o: Error) => {

      logger.logError({
        message: `error connecting with source PG at ${cellRawData.host}`,
        methodName: "process$",
        moduleName: "gridder"
      })

      exit(-1);

    }

  )

  /**
   *
   * Grid.
   *
   */
  const grid: Grid = new Grid(params.grid);

  /**
   *
   * Cells.
   *
   */
  const cells: Cell[] = params.cells.map((o: any) => {

    const c = new Cell(o);
    c.grid = grid;
    return c;

  })

  // Get the GridderTask and compute
  return gridderTaskGet$(cellPgConn, params.gridderTask.gridderTaskId)
  .pipe(

    // Compute the cell
    rxo.concatMap((o: GridderTask) => {

      logger.logInfo({
        message: `added objects to the DB`,
        methodName: "process$",
        moduleName: "gridder"
      });

      return o
        .computeCellsBatch$(cellRawDataConn, cellPgConn, cells,
          params.targetZoom, logger);

    }),

    // Final signal
    rxo.finalize(() => {

      logger.logInfo({
        message: `gridding finished`,
        methodName: "process$",
        moduleName: "gridder"
      });

    })

  )

}
