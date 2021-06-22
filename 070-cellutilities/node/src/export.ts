import { process$ } from "./lib/export";

import { readJsonSync } from "@malkab/node-utils";

import { exit as processExit } from "process";

/**
 *
 * This script returns the SQL export for a serie of variables.
 *
 */
/**
 *
 * Read config.
 *
 */
const vars: any = readJsonSync([ "config.json" ]);

console.log("Export script version 1.1.1");

process$(vars)
.subscribe(

  (o: any) => console.log("Export next:", o),

  (e: Error) => {

    console.log("Export error:", e.message);

    processExit(-1);

  },

  () => processExit(0)

);
