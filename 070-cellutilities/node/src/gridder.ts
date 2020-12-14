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

process$(vars)
.subscribe(

  (o: any) => console.log("Inserting objects:", o),

  (e: Error) => console.log("D: error", e),

  () => processExit(0)

);
