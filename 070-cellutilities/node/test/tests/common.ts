import { readJsonSync } from "@malkab/node-utils";

/**
 *
 * Put here all common assets for tests. Tests should use as many common assets
 * as possible for common objects.
 *
 */

/**
 *
 * Read config for scripts, mounted at /config/basegeomgridding-config.json.
 *
 */
export const coveringCellsConfig: any = readJsonSync([ "/config/coveringcells-config.json" ]);

export const gridderConfig: any = readJsonSync([ "/config/gridder-config.json" ]);
