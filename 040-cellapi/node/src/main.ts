import { HttpServer, JwtUserPassAuthRouter } from "@malkab/appian";

import { EnvVarsStorage } from "@malkab/node-utils";

import { TsUtilsFormattedOutput } from "@malkab/ts-utils";

import { NodeLogger, ELOGLEVELS } from "@malkab/node-logger";

import { RxPg } from "@malkab/rxpg";

import { RxRedis } from "@malkab/rxredis";

import { cloneDeep } from "lodash";

/**
 *
 * Routers
 *
 */
// import { ServiceRouter } from "./routers/servicerouter";

/**
 *
 * An env vars storage.
 *
 */
export let envVarsStorage: EnvVarsStorage;

try {
  envVarsStorage = new EnvVarsStorage(
    "NODE_ENV",
    "MLKC_CELL_VERSION",
    "MLKC_CELL_INSTANCE_GENERATION",
    "NODE_MEMORY",
    "MLKC_CELL_DB_HOST",
    "MLKC_CELL_DB_INNER_PORT",
    "MLKC_CELL_DB_USER",
    "MLKC_CELL_DB_PASSWORD",
    "MLKC_CELL_DB_MAXPOOLSIZE",
    "MLKC_CELL_DB_MINPOOLSIZE",
    "MLKC_CELL_DB_IDLETIMEOUTMILLIS",
    "MLKC_CELL_REDIS_URL",
    "MLKC_CELL_REDIS_PASSWORD"
    );
  } catch(e) {

    console.log((`INITIALIZATION ERROR: ${e}`));

    process.exit(1);

  }

// For console reporting at initialization
const fo: TsUtilsFormattedOutput = new TsUtilsFormattedOutput({});

/**
 *
 * A logger.
 *
 */
const log: NodeLogger = new NodeLogger({
  appName: "sunnsaas_api",
  consoleOut: true,
  minLogLevel: ELOGLEVELS.DEBUG
});

/**
 *
 * Initialization message.
 *
 */
log.logInfo({
  message: "API initializing...",
  methodName: "main",
  moduleName: "main"
})

/**
 *
 * Persistence.
 *
 */
const pg: RxPg = new RxPg({
  maxPoolSize: envVarsStorage.e.MLKC_CELL_DB_MAXPOOLSIZE,
  db: envVarsStorage.e.MLKC_CELL_DB_DB,
  host: envVarsStorage.e.MLKC_CELL_DB_HOST,
  pass: envVarsStorage.e.MLKC_CELL_DB_PASSWORD,
  user: envVarsStorage.e.MLKC_CELL_DB_USER,
  port: envVarsStorage.e.MLKC_CELL_DB_INNER_PORT,
  applicationName: "sunnsaas_api",
  minPoolSize: envVarsStorage.e.MLKC_CELL_DB_MINPOOLSIZE,
  idleTimeoutMillis: envVarsStorage.e.MLKC_CELL_DB_IDLETIMEOUTMILLIS,
  onErrorEvent: (err: Error) => {

    log.logError({
      message: `error at the pool ${err.message}`,
      methodName: "main",
      moduleName: "main",
      payload: { error: err }
    })

  }
});

pg.executeParamQuery$("select 3").subscribe((o: any) => console.log("D: je", o));

console.log("D: J", envVarsStorage.e.MLKC_CELL_REDIS_URL, envVarsStorage.e.MLKC_CELL_REDIS_PASSWORD);

// // Redis non-blocking client for normal operations
// const redis: RxRedis = new RxRedis({
//   url: envVarsStorage.e.MLKC_CELL_REDIS_URL,
//   password: envVarsStorage.e.MLKC_CELL_REDIS_PASSWORD
// });

/**
 *
 * The HTTP server.
 *
 */
new HttpServer({

  // TODO: make this parametrizable.
  jsonMaxLength: "20mb",

  // TODO: make this parametrizable.
  urlLimit: "2mb",

  routes: [

    // // Service calls
    // new ServiceRouter({
    //   urlBaseRoot: "/sunnsaas/v1/services",
    //   log: log,
    //   pg: pg,
    //   redis: redis
    // })

  ]

})

/**
 *
 * Start-up message
 *
 */
// Clone the ENV config info and discard some sensitive data items
const consoleInfo: any = cloneDeep(envVarsStorage.e);
delete consoleInfo.MLKC_CELL_DB_PASSWORD;
delete consoleInfo.MLKC_CELL_DB_USER;
delete consoleInfo.MLKC_CELL_REDIS_PASSWORD;

console.log(fo.log(`
------------------------------
API STARTING
------------------------------
${new TsUtilsFormattedOutput({}).hashmapPrettyPrint({
  hashmap: consoleInfo,
  gap: 4
})}\n`));

log.logInfo({
  message: "env vars configuration",
  methodName: "main",
  moduleName: "main",
  payload: { config: envVarsStorage.e }
});
