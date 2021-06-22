import { process$ } from "./lib/gridder";

import { readJsonSync } from "@malkab/node-utils";

import { exit as processExit } from "process";

/**
 *
 * This script grids a cell.
 *
 */
/**
 *
 * Read config.
 *
 */
const vars: any = readJsonSync([ "config.json" ]);

console.log("Gridder script version 1.1.1");

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

  (o: any) => console.log("Gridder next:", o),

  (e: Error) => {

    console.log("Gridder error:", e.message);

    exitWait(-1);

  },

  () => exitWait(0)

);