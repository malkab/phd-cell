import {
  Grid, SourcePgConnection, GridderTask, GridderJob,
  gridderTaskFactory$
} from "@malkab/libcellbackend";

import { RxPg } from "@malkab/rxpg";

import { exit } from "process";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { NodeLogger, ELOGLEVELS } from "@malkab/node-logger";

/**
 *
 * Library for command line utility basegeomgridding.
 *
 */
export function process$(params: any): rx.Observable<any> {

  // Check for verbose parameter
  const verbose: boolean = params.verbose ? params.verbose : false;

  const logger: NodeLogger = new NodeLogger({
    appName: "coveringcells",
    consoleOut: verbose,
    minLogLevel: ELOGLEVELS.DEBUG,
    logFilePath: "."
  })

  logger.logInfo({
    message: `initilizing process`,
    methodName: "process$",
    moduleName: "coveringcells"
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
    applicationName: "coveringcells",
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

  // Test source PG connection
  cellRawDataConn.executeParamQuery$("select 0").subscribe(

    (o: any) => {

      logger.logInfo({
        message: `connected with source PG at ${cellRawData.host}`,
        methodName: "process$",
        moduleName: "coveringcells"
      })

    },

    (o: Error) => {

      logger.logError({
        message: `error connecting with source PG at ${cellRawData.host}`,
        methodName: "process$",
        moduleName: "coveringcells"
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
   * GridderJob.
   *
   */
  const gridderJob: any = new GridderJob(params.gridderJob);

  /**
   *
   * GridderTask.
   *
   */
  let gridderTask: GridderTask;

  // Factorize the right GridderTask
  return gridderTaskFactory$(params.gridderTask)
  .pipe(

    // Configure the GridderTask and the GridderJob
    rxo.map((o: GridderTask) => {
      gridderTask = o;
      gridderTask.grid = grid;
      gridderJob.gridderTask = gridderTask;
      return gridderTask;
    }),

    // Insert objects at the database
    rxo.concatMap((o: GridderTask) => rx.zip(

      // Source connection
      cellRawData.pgInsert$(cellPgConn)
      .pipe(rxo.catchError((e: Error) => {

        logger.logError({
          message: `error adding source connection: ${e.message}`,
          methodName: "process$",
          moduleName: "coveringcells"
        });

        return rx.of(`error adding source connection: ${e.message}`);

      })),

      // Grid
      grid.pgInsert$(cellPgConn)
      .pipe(rxo.catchError((e: Error) => {

        logger.logError({
          message: `error adding grid: ${e.message}`,
          methodName: "process$",
          moduleName: "coveringcells"
        });

        return rx.of(`error adding grid: ${e.message}`)

      })),

      // GridderTask
      gridderTask.pgInsert$(cellPgConn)
      .pipe(rxo.catchError((e: Error) => {

        logger.logError({
          message: `error adding gridder task: ${e.message}`,
          methodName: "process$",
          moduleName: "coveringcells"
        });

        return rx.of(`error adding gridder task: ${e.message}`);

      })),

      // GridderJob
      gridderJob.pgInsert$(cellPgConn)
      .pipe(rxo.catchError((e: Error) => {

        logger.logError({
          message: `error adding gridder job: ${e.message}`,
          methodName: "process$",
          moduleName: "coveringcells"
        });

        return rx.of(`error adding gridder job: ${e.message}`);

      }))

    )),

    // Get the area of the GridderJob
    rxo.concatMap((o: any) => {

      logger.logInfo({
        message: `added objects to the DB`,
        methodName: "process$",
        moduleName: "coveringcells"
      });

      return gridderJob.getArea$(cellRawDataConn, cellPgConn, grid);

    }),

    // Get covering cells for the GridderJob
    rxo.concatMap((o: any) => {

      logger.logInfo({
        message: `GridderJob area retrieved`,
        methodName: "process$",
        moduleName: "coveringcells"
      });

      return gridderJob.getCoveringCells$(cellPgConn, grid, params.zoom);

    }),

    // Return final
    rxo.map((o: any) => {

      logger.logInfo({
        message: `covering cells retrieved`,
        methodName: "process$",
        moduleName: "coveringcells"
      });

      return o;

    })

  )

}
