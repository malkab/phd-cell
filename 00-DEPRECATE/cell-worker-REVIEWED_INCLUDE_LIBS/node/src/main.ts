import { CellWorker } from "./lib/cellworker";

/*

    Worker entry point

*/

const version: string = process.env.VERSION;
const dockerHost: string = process.env.DOCKER_HOST;
const hostName: string = process.env.HOSTNAME;
const workerId: string = `worker-${dockerHost}-${hostName}`;
const heartBeat: number = +process.env.WORKERS_HEARTBEAT_MINUTES * 60 * 1000;

// Startup message

console.log(`

Starting Cell Worker...

VERSION:            ${version}
DOCKER HOST:        ${dockerHost} 
HOST NAME:          ${hostName}
CONNECTION POOL:    ${process.env.POOL_SIZE}
WORKER ID:          ${workerId}
HEARTBEAT:          ${heartBeat}

`);


// Instantiate workerd

const worker: CellWorker = new CellWorker(
    workerId,
    process.env.CELLDS_HOST,
    +process.env.CELLDS_PORT,
    process.env.CELLDS_USER,
    process.env.CELLDS_PASS,
    process.env.CELLDS_DB,
    +process.env.POOL_SIZE,
    process.env.REDISURL,
    +process.env.REDISPORT,
    process.env.REDISPASS,
    process.env.REDIS_QUEUE_API_WORKER,
    process.env.REDIS_QUEUE_WORKER_API,
    process.env.REDIS_CHANNEL_WORKER,
    heartBeat
);

worker.heartbeatLoop();
worker.apiWorkerLoop();
