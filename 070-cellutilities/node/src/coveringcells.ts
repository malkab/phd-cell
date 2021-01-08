import { process$ } from "./lib/coveringcells";

import { readJsonSync } from "@malkab/node-utils";

import { exit as processExit } from "process";

/**
 *
 * This script returns the base gridding based on an input area for a given zoom
 * level.
 *
 */
/**
 *
 * Read config.
 *
 */
const vars: any = readJsonSync([ "config.json" ]);

console.log("CoveringCells script version 1.0.0");

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

  (o: any) => console.log("CoveringCells next:", o),

  (e: Error) => {

    console.log("CoveringCells error:", e.message);

    exitWait(-1);

  },

  () => exitWait(0)

);