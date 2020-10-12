import { CellWorker } from "./lib/cellworker";

/*

    Worker entry point

    TODO: get all process.env variables at the beginning and use the
    variables later, do not mix access as it is done now

*/

const version: string = process.env.VERSION;
const dockerHost: string = process.env.DOCKERHOST;
const hostName: string = process.env.HOSTNAME;
const workerId: string = `worker-${dockerHost}-${hostName}`;
const heartBeat: number = +process.env.WORKERSHEARTBEAT;
const loopInterval: number = +process.env.LOOPINTERVAL;

// Startup message

console.log(`

Starting Cell Worker ...

WORKER ID:          ${workerId}
VERSION:            ${version}
DOCKER HOST:        ${dockerHost} 
HOST NAME:          ${hostName}
CONNECTION POOL:    ${process.env.POOLSIZE}
MEMORY:             ${process.env.NODEMEMORY} mb
HEARTBEAT:          ${heartBeat} s
LOOPINTERVAL:       ${loopInterval} s
CELLDS HOST:        ${process.env.CELLDSHOST}
POOL SIZE:          ${process.env.POOLSIZE}
REDIS HOST:         ${process.env.REDISURL}
MEMORY LIMIT INDEX: ${process.env.MEMORYLIMITINDEX}

`);


// Instantiate workerd

const worker: CellWorker = new CellWorker(
    workerId,
    process.env.CELLDSHOST,                    // cellds connections
    +process.env.CELLDSPORT,
    process.env.CELLDSUSER,
    process.env.CELLDSPASS,
    process.env.CELLDSDB,
    +process.env.POOLSIZE,                     // cellds connection pool
    process.env.REDISURL,
    +process.env.REDISPORT,
    process.env.REDISPASS,
    process.env.REDISQUEUEAPIWORKER,
    process.env.REDISQUEUEWORKERAPI,
    process.env.REDISCHANNELWORKER,
    heartBeat,
    loopInterval,
    +process.env.NODEMEMORY,
    +process.env.MEMORYLIMITINDEX
);


// Starts worker's loops

worker.startLoops();

