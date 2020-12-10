import { readJsonSync } from "@malkab/node-utils";

/**
 *
 * Put here all common assets for tests. Tests should use as many common assets
 * as possible for common objects.
 *
 */

/**
 *
 * Read config for basegeomgridding, mounted at
 * /config/basegeomgridding-config.json.
 *
 */
export const basegeomgriddingConfig: any = readJsonSync([ "/config/basegeomgridding-config.json" ]);
