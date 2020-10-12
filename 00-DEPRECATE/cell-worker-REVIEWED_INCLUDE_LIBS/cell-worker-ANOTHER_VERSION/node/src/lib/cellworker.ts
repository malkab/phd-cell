/*

    The worker class

*/

/*

    External imports

*/

import * as math from "mathjs";

import { Persistence } from "./libpersistence/persistence";

import { EMessageType, IMessage } from "./libcellbackend/message";

import { LibCellFactory } from "./libcellbackend/libcellfactory";

import { CellError, ECellErrorCode } from "./libcellbackend/libcell/cellerror";

import { GridderJob, EGridderJobStatus } from "./libcellbackend/libcell/gridderjob";

import { GridderJobsUtils } from "./libcellbackend/gridderjobsutils";

import { QueryResult } from "pg";

import { GridderSubJob, EGridderSubJobProcessingType } from "./libcellbackend/libcell/griddersubjob";

import { CellEditor } from "./libcellbackend/celleditor";

import { RedisLogger, ILoggerMessage } from "./libcellbackend/redislogger";

import { EGridderLogStatus } from "./libcellbackend/egridderlogstatus";

import * as _ from "lodash";


// --------------
// Aggregation methods 
// --------------

import { AggOperator } 
    from "./libaggregationmethods/aggoperator";

import { IPointsAvgValueOperator }
    from "./libaggregationmethods/ipointsavgvalueoperator";

import { IPointsAvgInvDistInterpolationOperator }
    from "./libaggregationmethods/ipointsavginvdistinterpolationoperator";



/**
 * 
 * Worker status descriptions.
 * 
 */

export enum EWorkerStatus {

    /**
     * 
     * Worker listening to messages
     * 
     */

    LISTENING = 100,

    /**
     *  
     * Worker processing message
     *
     */

    PROCESSINGMESSAGE = 200,

    /** 
     *
     * Worker is stressed in terms of CPU and memory usage and is not
     * listening to more messages
     *
     */

    STRESSED = 300

}




/*

    Class

*/

export class CellWorker {

    /*

        Private members

    */

    // worker id
    private _id: string;

    // Queues persistences, only for listening to queues (blocking)
    private _persistenceApiWorker: Persistence;
    private _persistenceWorkerApi: Persistence;

    // General persistence, for posting messages
    private _persistence: Persistence;

    // Worker channel persistence, to listen to worker-wide messages
    private _persistenceChannel: Persistence;

    // Queues
    private _apiWorkerQueue: string;
    private _workerApiQueue: string;

    // Channels
    private _workerChannel: string;

    // Times
    private _activationTime: number;

    /**
     * 
     * Stores the latest CPU time stats to compare deltas
     * 
     */

    private _lastCpuTimeStats: any;

    /**
     *
     * Stores the latest CPU measurement. CPU usage measurement are only
     * performed by the heartbeat loop because they are very obstrusive
     * and sensitive to deltas, so every computed value is stored here
     * so the worker info uses this to report on long term usage. 
     *
     */

    public lastCpuUsageIndex: number;

    /**
     * 
     * Last memory measurement so to not to compute it constantly.
     * 
     */

    public lastMemoryUsageIndex: number;

    /**
     * 
     * Node dedicated memory for this worker process
     * 
     */

    private _workerMemory: number;

    /** 
     * 
     * Current status
     * 
     */

    private _status: EWorkerStatus;

    // /**
    //  *
    //  * This is the timestamp of the last time the worker went into a
    //  * BUSY status, to unlock it so it can again check new work from
    //  * worker's queues
    //  * 
    //  * It is null when not set.
    //  * 
    //  */

    // private _busyTimestamp: number = null;

    // Heartbeat interval
    private _heartBeat: number;

    // The LibCellFactory
    private _libCellFactory: LibCellFactory;

    // GridderJobsUtil, helpers for gridder jobs
    // private _gridderJobsUtils: GridderJobsUtils;

    // Cell editor
    private _cellEditor: CellEditor;

    // Initial queues
    private _queues: string[];

    // The logger
    public logger: RedisLogger;

    /**
     *
     * This is the number of interval seconds the main worker's loop is
     * fired.
     * 
     */

    private _loopInterval: number;

    /**
     *
     * This is the limit index, as given by the _memoryUsage function,
     * above which the worker stops accepting new jobs.
     *
     */

    private _memoryLimitIndex: number;




    /*

        ----------------------------

        Getters & Setters

        ----------------------------

    */

    get id(): string {

        return this._id;

    }

    get libCellFactory(): LibCellFactory {

        return this._libCellFactory;

    }

    // Cell editor

    get cellEditor(): CellEditor {

        return this._cellEditor;

    }


    /**
     * 
     * The current status of the worker
     * 
     */

    get status(): EWorkerStatus {

        return this._status;

    }

    set status(status: EWorkerStatus) {

        this._status = status;

    }



    /**
     *
     * Worker's constructor. Configures the worker, most of this
     * parameters are passed to the worker from env variables by the
     * Docker engine.
     *
     * @param id                    The ID of the worker in the logs.
     * @param pgHost                The CellDS database host.
     * @param pgPort                The CellDS database port.
     * @param pgUser                The CellDS database user.
     * @param pgPass                The CellDS database password.
     * @param pgDb                  The CellDS database.
     * @param pgPoolSize            The database pool size.
     * @param redisUrl              The Redis instance URL.
     * @param redisPort             The Redis instance port.
     * @param redisPass             The Redis instance password.
     * @param apiWorkerQueue        The Redis queue the Cell API uses to
     *                              talk to workers.
     * @param workerApiQueue        The Redis queue the workers use to
     *                              talk to the Cell API.
     * @param workerChannel         The Redis queue the workers use to
     *                              talk between them (I think).
     * @param heartBeat             The number of seconds the worker
     *                              emit a heart beat.
     * @param loopInterval          The number of seconds of the
     *                              interval the main worker's loop is
     *                              fired.
     * @param workerMemory          Mb of memory dedicated to the
     *                              worker.
     * @param memoryLimitIndex      Index of memory usage, as given by
     *                              the _memoryUsage function, above
     *                              which the worker stops accepting new
     *                              jobs.
     *
     */

    constructor(
        id: string,
        pgHost: string,
        pgPort: number,
        pgUser: string,
        pgPass: string,
        pgDb: string,
        pgPoolSize: number,
        redisUrl: string, 
        redisPort: number, 
        redisPass: string,
        apiWorkerQueue: string,
        workerApiQueue: string,
        workerChannel: string,
        heartBeat: number,
        loopInterval: number,
        workerMemory: number,
        memoryLimitIndex: number
    ) {

        this._id = id;

        // API - Worker requests queue
        this._apiWorkerQueue = apiWorkerQueue;

        // Worker - API requests queue
        this._workerApiQueue = workerApiQueue;

        // Worker - Worker channel
        this._workerChannel = workerChannel;

        // Heartbeat in minutes
        this._heartBeat = heartBeat;

        // Memory limit index above which the worker stops getting new
        // jobs

        this._memoryLimitIndex = memoryLimitIndex;


        /**
         * 
         * Dedicated memory to the Node process
         * 
         */

        this._workerMemory = workerMemory;

        // Persistences for the above communications channels
        this._persistenceApiWorker = new Persistence();
        this._persistenceWorkerApi = new Persistence();
        this._persistenceChannel = new Persistence();

        // A general persistence
        this._persistence = new Persistence();

        // Set up of persistence instances

        this._clog(`Connecting to Redis ${redisUrl} ${redisPort}
        `);

        this._persistenceApiWorker.initRedis(redisUrl, redisPort, redisPass,
            (error: any) => {
                this._clog("Error at worker Redis");
                this._clog(error);
            }
        );

        this._persistenceWorkerApi.initRedis(redisUrl, redisPort, redisPass,
            (error: any) => {
                this._clog("Error at worker Redis");
                this._clog(error);
            }
        );

        this._persistence.initRedis(redisUrl, redisPort, redisPass,
            (error: any) => {
                this._clog("Error at worker Redis");
                this._clog(error);
            }
        );

        this._persistenceChannel.initRedis(redisUrl, redisPort, redisPass,
            (error: any) => {
                this._clog("Error at worker Redis");
                this._clog(error);
            }
        );

        // General persistence to write data to the database

        this._persistence.initPg(
            pgHost, pgPort, pgUser, pgPass, pgDb,
            "meta.celldsobject",
            "id",
            "initialization",
            pgPoolSize
        );


        // The cell factory

        this._libCellFactory = new LibCellFactory(this._persistence);

        // Get current activation time

        this._activationTime = new Date().getTime();

        // Set initial status

        this.status = EWorkerStatus.LISTENING;

        // Manually broadcast first heartbeat

        this._heartBeatLoop();

        // Subscribe to worker wide messages

        this._persistenceChannel.redisSubscribeJSON(this._workerChannel,
            (channel: string, message: IMessage) => {

                this._workerChannelProcessing(message); 

            });

        // The GridderJobs helper

        // this._gridderJobsUtils = new GridderJobsUtils(this._libCellFactory);

        // The cell editor

        this._cellEditor = new CellEditor(this._persistence, this._libCellFactory);

        // Populate initial queues list to listen to events at

        this._queues = [ this._apiWorkerQueue ];

        // The logger

        this.logger = new RedisLogger(this._persistence, this);

        // The loop interval in seconds

        this._loopInterval = loopInterval;

    }



    /*

        ------------------------------------

        Public methods

        ------------------------------------

    */

    /**
     *
     * Starts the two loops of the worker: heartBeat and apiWorkerLoop
     *
     */

    public startLoops(): void {

        setInterval(() => { this._heartBeatLoop(); }, 
            this._heartBeat * 1000);

        setInterval(() => { this._apiWorkerLoop(); },
            this._loopInterval * 1000);

    }



    /*
    
        Publish GridderSubJob to the pool of workers

        Publishes the GridderSubJob into the queue for workers to pull
        it and process

    */

    public publishGridderSubJob(gridderSubJob: GridderSubJob): 
    Promise<number> {

        return new Promise<number>((resolve, reject) => {

            // Write the GridderSubJob in the persistence system

            this._libCellFactory.set("GridderSubJob",
                gridderSubJob.id, gridderSubJob.persist)
            .then((gridderSubJob: GridderSubJob) => {

                // Publish job only if GridderJob is RUNNING

                if (gridderSubJob.gridderJob.status === 
                    EGridderJobStatus.RUNNING) 
                {

                    // Publish the new GridderSubJob to its GridderJob 
                    // worker's queue

                    this._publishToGridderJobQueue(
                        gridderSubJob.gridderJob,
                        {
                            idPoster: this._id,
                            time: new Date().getTime(),
                            typeCode: EMessageType.PROCESSGRIDDERSUBJOB,
                            payload: gridderSubJob.id
                        }
                    )
                    .then((result: number) => {

                        // Log

                        this.logger.log(gridderSubJob, <ILoggerMessage> {

                            code: EGridderLogStatus.QUEUED,
                            payload: null,
                            posterid: this._id

                        });

                        resolve(result);

                    })
                    .catch((error) => {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error publishing GridderSubJob ${gridderSubJob.id}`,
                            error));

                    })

                } else {

                    resolve(-1);

                }

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error publishing GridderSubJob ${gridderSubJob.id}`,
                    error));

            });

        })

    }



    /*

        ------------------------------------

        Private methods

        ------------------------------------

    */


    /**
     *
     * This is the worker's main loop, where messages are recieved and
     * processed.
     *
     * It searches in all queues returned by the [[_getWorkerQueues]]
     * method, that are all that complies with the
     * **workers:gridderjob:** prefix. It then proceeds to process the
     * message, derivating it by type [[EMessageType]] to one class or
     * another:
     *
     * - **EMessageType.APISTARTGRIDDERJOB:** starts a [[GridderJob]];
     *
     * - **EMessageType.PROCESSGRIDDERSUBJOB:** process a
     *   [[GridderSubJob]].
     * 
     */

    private _apiWorkerLoop(): void {

        // Get current worker queues at Redis, prefixed as
        // workers:queue:*

        this._getWorkerQueues()
            .then((queues) => {

                this._queues = queues;

            })
            .catch((error) => {

                this._clog("Cannot compose workers:queues from Redis");
                this._clog(error);

            });

        /*

            The search for new jobs is only triggered if the memory
            usage is below a given index

        */

        // console.log("D: ", this._memoryLimitIndex);

        if (this.memoryUsage() < this._memoryLimitIndex) {
        // if (true) {

            // Check the queues. Please note that the blocking timeout
            // is set to 1 second because worker queues are constantly
            // changing and thus they must be refreshed

            this._persistenceApiWorker.redisPullJSON(this._queues, 1)
            .then((message: IMessage) => {

                // Only if there is a message

                if (message) {

                    // Set status to processing

                    this.status = EWorkerStatus.PROCESSINGMESSAGE;

                    // Inform at worker's activity a message is being processed

                    this._setActivity({
                        idPoster: this._id,
                        payload: null,
                        time: new Date().getTime(),
                        typeCode: message.typeCode
                    });

                    /*
                    
                        Start gridderjobs messages

                    */

                    // Message for starting a new GridderJob

                    if (message.typeCode === EMessageType.APISTARTGRIDDERJOB) {

                        this._clog(`Starting GridderJob ${message.payload.id}`);

                        // This object handle the starting of GridderJobs

                        this._startGridderJob(message.payload.id)
                        .then((gridderSubJob: GridderSubJob) => {

                            if (gridderSubJob.data.length > 0) {

                                this._clog(`Successfully initiated GridderJob ${message.payload.id} with ${gridderSubJob.data.length} geometries`);

                            } else {

                                this._clog(`Successfully processed GridderJob ${message.payload.id} with no colliding geometries`);

                            }

                        })
                        .catch((error: CellError) => {

                            this._clog(`Error while starting GridderJob ${message.payload.id}`);

                            this._clog(error.message);

                            this._clog(error.originalMessage);

                        })

                    }


                    // Process a GridderSubJob
                    // This starts the processing of a cell

                    if (message.typeCode === EMessageType.PROCESSGRIDDERSUBJOB) {

                        // Get the subjob

                        this._libCellFactory.get("GridderSubJob", message.payload)
                        .then((gsj: GridderSubJob) => {

                            // Report the griddersubjob has been pulled and
                            // started operations

                            this.logger.log(gsj, < ILoggerMessage > {

                                code: EGridderLogStatus.PULLED,
                                payload: null,
                                posterid: this._id

                            });

                            this.logger.log(gsj, < ILoggerMessage > {

                                code: EGridderLogStatus.WORKERSTART,
                                payload: null,
                                posterid: this._id

                            });

                            // Check the sub job operation

                            const aggOperator: AggOperator =
                                this._getAggOperator(gsj.gridderJob);

                            // Process, all process functions returns a
                            // set of sub cells to process just for
                            // informative purposes. They are supposed
                            // to be autocontained for processing

                            aggOperator.process(gsj)
                            .then((gridderSubJobs: GridderSubJob[]) => {

                                // Publish sub jobs if REDIS processing type
                                // if there are truly GridderSubJobs

                                if (gridderSubJobs) {

                                    for (let sj of gridderSubJobs) {

                                        // Is a Redis processing sub job?

                                        if (sj.processingType === EGridderSubJobProcessingType.REDIS) {

                                            this.publishGridderSubJob(sj);

                                        }

                                    }

                                }

                                // Delete finished griddersubjob

                                this.libCellFactory.del("GridderSubJob", gsj.id);

                            })
                            .catch((error: CellError) => {

                                this._clog("Error processing GridderSubJob");
                                this._clog(error.message);
                                this._clog(error.originalMessage);

                            })

                        })
                        .catch((error: CellError) => {

                            this._clog(`CellWorker: Error getting GridderSubJob ${message.payload}`);
                            this._clog(error.message);
                            this._clog(error.originalMessage);

                        });

                    }

                } else {

                    // There were no message in the worker:queue:*
                    // queues

                    this.status = EWorkerStatus.LISTENING;

                }

            })
            .catch((error) => {

                this._clog("Error at API - Worker message queue");
                this._clog(error);

            });

        } else {

            this.status = EWorkerStatus.STRESSED;

        }

    }


    // Emit heartbeat

    private _heartBeatLoop(): void {

        // Get the time of the heartbeat

        const _time = new Date().getTime();

        // Create heartbeat message

        const payload: IMessage = {
            typeCode: EMessageType.WORKERHEARTBEAT,
            idPoster: this._id,
            time: _time,
            payload: {
                activation: this._activationTime,
                activeFor: _time - this._activationTime,
                status: this.status
            }
        }

        this._clog(`Alive - Status ${this.status} - CPU ${this.cpuUsage()} - Memory ${this.memoryUsage()}`);

        // Push message for API

        this._setActivity(payload);

    }




    /**

            Starts a gridderjob. Starting a gridderjob may consist
            actually in rerunning stalled sub jobs.

            This is the entry point to starting a gridder job once a
            EMessageType.APISTARTGRIDDERJOB message is recieved from a
            queue.

     */

    private _startGridderJob(id: string): Promise<GridderSubJob> {

        return new Promise<GridderSubJob>((resolve, reject) => {

            // The GridderJob

            let gridderJob: GridderJob;

            // Get the gridder job

            this._libCellFactory.get("GridderJob", id)
            .then((gj: GridderJob) => {

                // Fresh start

                // Store the GridderJob

                gridderJob = gj;

                // Set status to RUNNING and register new status

                gridderJob.status = EGridderJobStatus.RUNNING;

                // Publish the new status of the gridder job

                return this._libCellFactory.set("GridderJob", id, 
                    gridderJob.persist);

            })
            .then((gridderJob: GridderJob) => {

                // Starting from scratch

                this._clog("Starting GridderJob from scratch");
                
                // Get aggregation operation class

                const aggOperator: AggOperator = this._getAggOperator(gridderJob);

                // Get initial colliding data

                return aggOperator.initialCollidingGeoms(gridderJob);

            })
            .then((data: any) => {

                // Create the initial gridder sub job

                let gridderSubJob: GridderSubJob = 
                gridderJob.getNewGridderSubJob(
                    gridderJob.dirtyArea, 
                    data, 
                    EGridderSubJobProcessingType.REDIS
                );

                // Log starting time and geoms

                this.logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.INITIALJOB,
                    payload: null,
                    posterid: this.id
        
                });

                this.logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.INITIALGEOMS,
                    payload: gridderSubJob.data.length,
                    posterid: this.id
        
                });

                // Check if there is truly geoms

                if (gridderSubJob.data.length > 0) {

                    // Publish gridder sub job for workers to 
                    // process it

                    this.publishGridderSubJob(gridderSubJob);

                } else {

                    this.logger.log(gridderSubJob, <ILoggerMessage> {

                        code: EGridderLogStatus.WORKEREND,
                        payload: null,
                        posterid: this.id
            
                    });

                }

                resolve(gridderSubJob);

            })
            .catch((error) => {

                reject(new CellError(
                    ECellErrorCode.DATAERROR,
                    `Error while starting GridderJob ${id}`,
                    error
                ));

            })

        })

    }



    /*
    
        General messaging processing

        Processes messages coming to the worker-wide channel to disseminate
        information to all workers

    */

    private _workerChannelProcessing(message: IMessage): void {

        // Report

        this._clog("New message at worker's channel:");
        console.log(message);
        console.log();

    }





    /*
    
        Publish a message to a GridderJob's queue

        This publish a message to a specific GridderJob's queue, most often
        a GridderSubJob process request

        GridderJob's queue has the syntax workers:gridderjob:[gridderjob id]

    */

    private _publishToGridderJobQueue(gridderJob: GridderJob, message: IMessage): Promise<number> {

        // Push to the specific queue

        return this._persistence.redisPushJSON(
            `workers:gridderjob:${gridderJob.id}`,
            message
        );

    }


    /*
    
        Publish a message to the worker's channel
        Every worker will recieve this message

    */

    private _publishWorkersChannel(message: IMessage): void {

        this._persistence.redisPublishJSON(this._workerChannel, message);

    }



    /*

        Respawn stalled subjobs in a GridderJob

        Check all stalled subjobs in a GridderJob and relaunch them

    */

    public _respawnGridderSubJobs(gridderJob: GridderJob): Promise<GridderSubJob[]> {

        return new Promise<GridderSubJob[]>((resolve, reject) => {

            // This SQL check subjobs status looking for not completed (code 1800 in status) ones

            const sql: string = `
                with all_subjobs as (
                    select
                        (cell__cellobjectid(id)).id as id
                    from
                        meta.celldsobject
                    where
                        (cell__cellobjectid(id)).type = 'GridderSubJob' and
                        initialization ->> 'gridderjobid' = $1
                ),
                finished as (
                    select
                        *
                    from
                        meta.gridderjobslog
                    where status = 1800
                )
                select
                    a.id
                from
                    all_subjobs a left join
                    finished b on
                    a.id = b.griddersubjobid
                where
                    status is null;
            `;


            // Execute query and get results

            this._libCellFactory.pgExecuteParamQuery(sql, [ gridderJob.id ])
            .then((gridderSubJobId: QueryResult) => {

                // Get id list

                const id: string[] = gridderSubJobId.rows.map((i) => {
                    return i.id;
                });

                // For pushing created sub jobs

                let out: GridderSubJob[] = [];

                // Iterate over id, create sub jobs and publish them to the worker's queue

                for(let i of id) {

                    this._libCellFactory.get("GridderSubJob", i)
                    .then((gridderSubJob: GridderSubJob) => {

                        out.push(gridderSubJob);

                        this.publishGridderSubJob(gridderSubJob);

                        // Return subjobs created

                        resolve(out);

                    })
                    .catch((error) => {

                        reject(new CellError(ECellErrorCode.DATAERROR, `Error retrieving stalled GridderSubJobs B`, error));

                    })

                }

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR, `Error retrieving stalled GridderSubJobs A`, error));

            });


        });

    }


    /*

        Logs on console with timestamp

        message: string: Message to output.

    */

    private _clog(message: string): void {

        const date = new Date();

        console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()} - ${message}`);
        console.log();

    }


    /**
     *
     * Gets the current list of queues in Redis for workers to listen
     * to searching for sub jobs queues by the name
     * "workers:gridderjob:*"
     * 
     */

    private _getWorkerQueues(): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {
            
            this._persistence.redisKeys("workers:gridderjob:*")
            .then((queues: string[]) => {

                resolve([ this._apiWorkerQueue ].concat(queues));

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR, 
                    "Cannot get workers:queues from Redis", error));

            })

        });

    }



    /*

        Sets a status at persistence system with key:

        worker-activity:[worker id]

        reflecting last action

    */

    private _setActivity(message: IMessage): void {

        this._persistence.set(
            `worker-activity:${this._id}`,
            message
        );

    }


    
    /**
     *
     * This method returns a instance of the correct AggOperator child for a given GridderJob.
     * 
     * @param {GridderJob} gridderJob: The GridderJob to get the AggOperator from.
     * @returns {AggOperator} 
     */

    private _getAggOperator(gridderJob: GridderJob): AggOperator {

        // Check the sub job operation

        const operation: string = gridderJob.variable.lineage.operation;

        // The final operator

        let operator: AggOperator = null;

        // Redirection based on variable agg type operation

        if (operation === "IPointsAvgValue") {

            // Create the operator class, that uses this object for communications

            operator = new IPointsAvgValueOperator(this);

        }

        if (operation === "IPointsAvgInvDistInterpolationOperator") {

            operator = new IPointsAvgInvDistInterpolationOperator(this);

        }

        // Check final compliance

        if (operator) {

            return operator;

        } else {

            throw(new CellError(ECellErrorCode.DATAERROR, `Aggregator for operation ${operation} does not exists`));

        }

    }


    /**
     *
     * Gives an estimation in % of the CPU usage, very approximated. It
     * compares the results with the latest checked that are stored in
     * [[_lastCpuStats]].
     *
     * @returns An estimated % of CPU usage
     *
     */

    public cpuUsage(): number {

        // Get stats

        const cpuUsage: any = process.cpuUsage(this._lastCpuTimeStats);

        // Update stats

        this._lastCpuTimeStats = process.cpuUsage();

        // Convert to seconds

        const totalUsage: number = (cpuUsage.user + cpuUsage.system) / 
            1000000;

        this.lastCpuUsageIndex = totalUsage;

        // 15 is an observer constant to have a more or less 1 based
        // measure: above 1 is considered too much usage, below, safe

        return <number>math.round(totalUsage, 2);

    }


    /**
     *
     * Gives an index of the memory usage, very approximated. This index
     * is a ratio of the worker dedicated memory, and it's not expressed
     * in any memory unit.
     * 
     * @returns The memory index.
     * 
     */

     public memoryUsage(): number {

        const memoryUsage: any = process.memoryUsage();

        // More or less converted to MB, the same unit of the memory
        // assigned to this worker parameter

        memoryUsage.rss = memoryUsage.rss / 1024 / 1024;
        memoryUsage.heapTotal = memoryUsage.heapTotal / 1024 / 1024;
        memoryUsage.heapUsed = memoryUsage.heapUsed / 1024 / 1024;
        memoryUsage.external = memoryUsage.external / 1024 / 1024;

        this.lastMemoryUsageIndex = <number>math.round(
            ((memoryUsage.rss + 
            memoryUsage.heapTotal + memoryUsage.heapUsed + 
            memoryUsage.external) / 
            this._workerMemory), 2);

        return this.lastMemoryUsageIndex;

     }

}