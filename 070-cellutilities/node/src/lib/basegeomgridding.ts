import { Grid, GridderTasks as gt, PgConnection } from "@malkab/libcellbackend";

import { RxPg } from "@malkab/rxpg";

import { exit } from "process";

/**
 *
 * Library for command line utility basegeomgridding.
 *
 */
export function process(params: any): void {

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

  /**
   *
   * Create the GridderJob. Here the target area is selected.
   *
   */
  const gridderJob: gt.GridderJob = new gt.GridderJob(params.gridderJob);

  console.log("D: jej3", gridderJob);

}
