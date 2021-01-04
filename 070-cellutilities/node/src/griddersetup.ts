import { process$ } from "./lib/griddersetup";

import { readJsonSync } from "@malkab/node-utils";

import { exit as processExit } from "process";

/**
 *
 * This script sets up a GridderTask.
 *
 */
/**
 *
 * Read config.
 *
 */
const vars: any = readJsonSync([ "config.json" ]);

console.log("GridderSetup script version 1.0.0");

/**
 *
 * Delay before exit to allow for all DB queries to be written (hopefully).
 *
 */
function exitWait(exitCode: number): void {

  console.log(`Awaiting 15 secs for DB to exit with code ${exitCode}`);

  setTimeout(

    () => processExit(exitCode),

    15000

  )

}

process$(vars)
.subscribe(

  (o: any) => console.log("GridderSetUp next:", o),

  (e: Error) => {

    console.log("GridderSetUp error:", e.message);

    exitWait(-1);

  },

  () => exitWait(0)

);
