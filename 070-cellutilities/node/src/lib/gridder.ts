import { Cell, Grid, GridderTasks as gt, PgConnection } from "@malkab/libcellbackend";

import { RxPg } from "@malkab/rxpg";

import { exit } from "process";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

/**
 *
 * Library for command line utility gridder.
 *
 */
export function process$(params: any): rx.Observable<any> {

  console.log("D: 3j322", params);

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

    (o: any) => console.log(`connected with Cell PG at ${cellPg.host}`),

    (o: Error) => {

      console.error(`error connecting with Cell PG at ${cellPg.host}`);

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
  cellPgConn.executeParamQuery$("select 0").subscribe(

    (o: any) => console.log(`connected with source PG at ${cellPg.host}`),

    (o: Error) => {

      console.error(`error connecting with source PG at ${cellPg.host}`);

      exit(-1);

    }

  )

  /**
   *
   * Grid.
   *
   */
  const grid: Grid = new Grid(params.grid);

  console.log("D: 3232", grid);

  /**
   *
   * Cell.
   *
   */
  const cell: Cell = new Cell(params.cell);
  cell.grid = grid;

  /**
   *
   * Create the GridderTask and execute computeCell$.
   *
   */
  let gridderTask: gt.GridderTask;

  return gt.gridderTaskFactory$(cellPgConn, params.gridderTask)
  .pipe(

    rxo.map((o: any) => gridderTask = o),

    // Insert objects into the Cell DB
    rxo.concatMap((o: any) => rx.zip(
      cellRawData.pgInsert$(cellPgConn)
        .pipe(rxo.catchError((e: Error) => rx.of("duplicated connection"))),
      grid.pgInsert$(cellPgConn)
        .pipe(rxo.catchError((e: Error) => rx.of("duplicated grid"))),
      gridderTask.pgInsert$(cellPgConn)
        .pipe(rxo.catchError((e: Error) => rx.of("duplicated gridder task")))
    )),

    // Setup the gridder task
    rxo.concatMap((o: any) => gridderTask.setup$(cellRawDataConn, cellPgConn)),

    // Compute the cell
    rxo.concatMap((o: any) => gridderTask.computeCell$(cellRawDataConn, cellPgConn, cell, 6)

  )




  // .pipe(

  //   rxo.concatMap((o: any) => {

  //     return gridderJob.getArea$(cellRawData, cellPg, grid);

  //   }),

  //   rxo.concatMap((o: any) => {

  //     return gridderJob.getCoveringCells$(cellPgConn, grid, params.zoom);

  //   })

  // )

}
