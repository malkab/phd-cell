import {
  Cell, Grid, PgConnection, GridderTask, GridderJob,
  gridderTaskFactory$
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

  const logger: NodeLogger = new NodeLogger({
    appName: "gridder",
    consoleOut: true,
    minLogLevel: ELOGLEVELS.DEBUG
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
  const cellPg: PgConnection = new PgConnection({
    pgConnectionId: "cellPg",
    applicationName: "cellutility_base_geom_gridding",
    db: "cell",
    host: params.cellPg.host,
    maxPoolSize: 200,
    minPoolSize: 10,
    pass: params.cellPg.pass,
    port: params.cellPg.port,
    dbUser: params.cellPg.user,
    description: "Cell DB",
    name: "Cell DB"
  });

  const cellPgConn: RxPg = cellPg.open();

  // Test cellPg connection
  cellPgConn.executeParamQuery$("select 0").subscribe(

    (o: any) => {

      logger.logInfo({
        message: `connected with Cell PG at ${cellPg.host}`,
        methodName: "process$",
        moduleName: "gridder"
      })

    },

    (o: Error) => {

      logger.logError({
        message: `error connecting with Cell PG at ${cellPg.host}`,
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
  const cellRawData: PgConnection = new PgConnection({
    pgConnectionId: "cellRawData",
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
   * Cell.
   *
   */
  const cell: Cell = new Cell(params.cell);
  cell.grid = grid;

  /**
   *
   * GridderJob.
   *
   */
  const gridderJob: any = new GridderJob(params.gridderJob);

  /**
   *
   * Create the GridderTask and execute computeCell$.
   *
   */
  let gridderTask: GridderTask;

  // Insert objects into the Cell DB
  return gridderTaskFactory$(params.gridderTask)
  .pipe(

    rxo.map((o: GridderTask) => {
      gridderTask = o;
      gridderTask.grid = grid;
      gridderJob.gridderTask = gridderTask;
      return gridderTask;
    }),

    // rxo.concatMap((o: GridderTask) => rx.zip(
    //   cellRawData.pgInsert$(cellPgConn)
    //     .pipe(rxo.catchError((e: Error) => rx.of("duplicated source connection"))),
    //   cellPg.pgInsert$(cellPgConn)
    //     .pipe(rxo.catchError((e: Error) => rx.of("duplicated cell connection"))),
    //   grid.pgInsert$(cellPgConn)
    //     .pipe(rxo.catchError((e: Error) => rx.of("duplicated grid"))),
    //   gridderTask.pgInsert$(cellPgConn)
    //     .pipe(rxo.catchError((e: Error) => rx.of("duplicated gridder task"))),
    //   gridderJob.pgInsert$(cellPgConn)
    //     .pipe(rxo.catchError((e: Error) => rx.of("duplicated gridder job")))
    // )),

    // Compute the cell
    rxo.concatMap((o: any) =>
      gridderJob.startOnCellLocalMode(cellPgConn, cellRawDataConn,
        [ cell ], params.targetZoom, logger))

  )

}
