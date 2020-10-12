/*

    The worker class

*/

import { Persistence } from "./libpersistence/persistence";
import { EMessageType, IMessage } from "./libcellbackend/message";
import { LibCellFactory } from "./libcellbackend/libcellfactory";
import { CellError, ECellErrorCode } from "./libcellbackend/libcell/cellerror";
import { GridderJob, EGridderJobStatus } from "./libcellbackend/libcell/gridderjob";
import { GridderJobsUtils } from "./libcellbackend/gridderjobsutils";
import { Cell, ICell } from "./libcellbackend/libcell/cell";
import { getHash } from "./libcellbackend/libcell/utils";
import { QueryResult } from "pg";
import { Catalog } from "./libcellbackend/libcell/catalog";
import { PgConnection } from "./libcellbackend/libcell/pgconnection";
import { PostGIS } from "./libpersistence/services/postgis";
import { Variable } from "./libcellbackend/libcell/variable";
import { IPointsAvgValueOperator } from "./libaggregationmethods/ipointsavgvalueoperator";
import { GridderSubJob, IGridderSubJob } from "./libcellbackend/libcell/griddersubjob";
import { CellEditor } from "./libcellbackend/celleditor";
import { RedisDataPackage } from "./libcellbackend/redisdatapackage";
import { RedisLogger, ILoggerMessage } from "./libcellbackend/redislogger";
import { EGridderLogStatus } from "./libcellbackend/egridderlogstatus";
import * as _ from "lodash";
import { decomposeKey } from "./libcellbackend/libcell/utils";



/*

    Worker status

*/

export enum EWorkerStatus {
    IDLE = 100
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

    // Current status
    private _currentStatus: number;

    // Heartbeat interval
    private _heartBeat: number;

    // The LibCellFactory
    private _libCellFactory: LibCellFactory;

    // GridderJobsUtil, helpers for gridder jobs
    private _gridderJobsUtils: GridderJobsUtils;

    // Cell editor
    private _cellEditor: CellEditor;

    // Initial queues
    private _queues: string[];

    // The logger
    private _logger: RedisLogger;




    /*

        Getters & Setters

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



    /*

        Constructor

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
        heartBeat: number
    ) {

        this._id = id;
        this._apiWorkerQueue = apiWorkerQueue;
        this._workerApiQueue = workerApiQueue;
        this._workerChannel = workerChannel;
        this._heartBeat = heartBeat;

        this._persistenceApiWorker = new Persistence();
        this._persistenceWorkerApi = new Persistence();
        this._persistenceChannel = new Persistence();
        this._persistence = new Persistence();

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

        this._persistence.initPg(
            pgHost, pgPort, pgUser, pgPass, pgDb,
            "meta.celldsobject",
            "id",
            "initialization",
            pgPoolSize
        );

        this._libCellFactory = new LibCellFactory(this._persistence);

        this._activationTime = new Date().getTime();

        this._setStatus(EWorkerStatus.IDLE);

        this.heartBeat();

        // Subscribe to worker wide messages

        this._persistenceChannel.redisSubscribeJSON(this._workerChannel,
            (channel: string, message: IMessage) => {

                this._workerChannelProcessing(message); 

            });

        // The GridderJobs helper

        this._gridderJobsUtils = new GridderJobsUtils(this._libCellFactory);

        // The cell editor

        this._cellEditor = new CellEditor(this._persistence, this._libCellFactory);

        this._queues = [ this._apiWorkerQueue ];

        // The logger

        this._logger = new RedisLogger(this._persistence);

    }



    /*

        Public methods

    */

    // The heartbeat loop

    public heartbeatLoop(): void {

        setInterval(() => { this.heartBeat(); }, this._heartBeat/2);

    }


    // Starts the API-worker message loop

    public apiWorkerLoop(): void {

        // Get current worker queues at Redis

        this._getWorkerQueues()
        .then((queues) => {

            this._queues = queues;

        })
        .catch((error) => {

            this._clog("Cannot compose workers:queues from Redis");
            this._clog(error);

        });


        // Check all queues. Remember that new queues are added for each GridderJob

        this._persistenceApiWorker.redisPullJSON(this._queues, 1)
        .then((message: IMessage) => {

            if (message) {
                
                // Inform at worker's activity a message is being processed

                this._setActivity({
                    idPoster: this._id,
                    payload: null,
                    time: new Date().getTime(),
                    typeCode: message.typeCode
                });


                // Start gridderjobs messages

                if (message.typeCode === EMessageType.APISTARTGRIDDERJOB) {

                    this._clog(`Starting GridderJob ${message.payload.id}`);

                    // This object handle the starting of GridderJobs

                    this._startGridderJob(message.payload.id);

                }


                // Process a GridderSubJob

                if (message.typeCode === EMessageType.PROCESSGRIDDERSUBJOB) {

                    // Get the subjob

                    this._libCellFactory.get("GridderSubJob", message.payload)
                    .then((gsj: GridderSubJob) => {

                        // Report the griddersubjob has been pulled and
                        // started operations

                        this._logger.log(gsj, <ILoggerMessage> {

                            code: EGridderLogStatus.PULLED,
                            payload: null,
                            posterid: this._id

                        });

                        this._logger.log(gsj, <ILoggerMessage> {

                            code: EGridderLogStatus.WORKERSTART,
                            payload: null,
                            posterid: this._id

                        });


                        // Check the sub job operation

                        const operation: string = gsj.gridderJob.variable.lineage.operation;

                        // Redirection based on variable agg type operation

                        if (operation === "IPointsAvgValue") {

                            // Create the operator class, that uses this object for communications

                            const operator: IPointsAvgValueOperator = new IPointsAvgValueOperator(this, this._persistence, this._logger);

                            // Process, all process functions returns a set of sub cells to process just for
                            // informative purposes. They are supposed to be autocontained for processing

                            operator.process(gsj)
                            .then((cell: Cell[]) => {

                                // Inform the sub job is over

                                // TODO: Do reporting here

                                // this._clog(`Finished processing GridderSubJob ${gsj.id} from GridderJob ${gsj.gridderJob.id}, variable ${gsj.gridderJob.variable.id} of type ${operation}, cell ${gsj.cell.x}/${gsj.cell.y}/${gsj.cell.zoom}, new cells: ${cell.length}`);

                            })
                            .catch((error: CellError) => {

                                this._clog("Error processing GridderSubJob");
                                this._clog(error.message);
                                this._clog(error.originalMessage);

                            })

                        } 

                    })
                    .catch((error: CellError) => {

                        this._clog(`CellWorker: Error getting GridderSubJob ${message.payload}`);
                        this._clog(error.message);
                        this._clog(error.originalMessage);

                    });

                }

            }

            // Reloop

            this.apiWorkerLoop();

        })
        .catch((error) => { 
            
            this._clog("Error at API - Worker message queue"); 
            this._clog(error);
        
        });

    }


    // Emit heartbeat

    private heartBeat(): void {

        // Get the time of the heartbeat

        const _time =  new Date().getTime();


        // Create heartbeat message

        const payload: IMessage = {
            typeCode: EMessageType.WORKERHEARTBEAT,
            idPoster: this._id,
            time: _time,
            payload: {
                activation: this._activationTime,
                activeFor: _time - this._activationTime,
                status: this._currentStatus
            }
        }

        this._clog(`Alive - Status ${this._currentStatus}`);

        // Push message for API

        this._setActivity(payload);

    }




    /*
    
        Publish GridderSubJob to the pool of workers

        Publishes the GridderSubJob into the queue for workers to pull it
        and process

    */

    public publishGridderSubJob(gridderSubJob: GridderSubJob): Promise<number> {

        return new Promise<number>((resolve, reject) => {

            // Write the GridderSubJob in the persistence system

            this._libCellFactory.set("GridderSubJob",
                gridderSubJob.id, gridderSubJob.persist)
            .then((gridderSubJob: GridderSubJob) => {

                // Publish job only if GridderJob is RUNNING

                if (gridderSubJob.gridderJob.status === EGridderJobStatus.RUNNING) {

                    // Publish the new GridderSubJob to its GridderJob worker's queue

                    this._publishToGridderJobQueue(gridderSubJob.gridderJob,
                        {
                            idPoster: this._id,
                            time: new Date().getTime(),
                            typeCode: EMessageType.PROCESSGRIDDERSUBJOB,
                            payload: gridderSubJob.id
                        }
                    )
                    .then((result: number) => {

                        // Log

                        this._logger.log(gridderSubJob, <ILoggerMessage> {

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
    
        Create new GridderSubJob

        Creates a new GridderSubJob from a GridderJob and a cell

    */

    public createNewGridderSubJob(cell: Cell, gridderJob: GridderJob): GridderSubJob {

        // Creation interface

        const init: IGridderSubJob = {
            cell: <ICell>cell.persist,
            gridderjobid: gridderJob.id
        };

        // Create the GridderSubJob hash id

        const sj: GridderSubJob = new GridderSubJob(
            getHash(`${JSON.stringify(init)}${Date.now()}`),
            init);

        // Set parent GridderJob

        sj.gridderJob = gridderJob;

        // Log GridderSubJob creation

        this._logger.log(sj, <ILoggerMessage> {

            code: EGridderLogStatus.CREATED,
            payload: null,
            posterid: this._id

        });

        return sj;

    }






    /*

        Private methods

    */

    /*
    
        Change worker status

    */

    private _setStatus(status: number): void {

        this._currentStatus = status;

    }



    /*
    
        Starts a gridderjob. Starting a gridderjob may consist actually in rerunning stalled sub jobs.

    */

    private _startGridderJob(id: string): void {

        // The GridderJob

        let gridderJob: GridderJob;

        // Arrays for potential existing gridder sub Jobs

        let existingGridderSubJobs: { [ gridderSubJobKey: string ]: any };

        // Get the gridder job

        this._libCellFactory.get("GridderJob", id)
        .then((gj: GridderJob) => {

            // Store the GridderJob

            gridderJob = gj;

            // Check if there are already some subjobs
            // defined at Redis

            return this._persistence.redisGetKeys("GridderSubJob:*");

        })
        .then((gsj: { [ key: string ]: any }) => {

            // Traverse GridderSubJobs looking for the given
            // GridderJob

            existingGridderSubJobs = _.pickBy(gsj, (value, key) => {

                return value.gridderjobid === gridderJob.id;

            });

            // Check now if there are existing sub jobs

            if (Object.keys(existingGridderSubJobs).length > 0) {

                // Respawn gridder sub jobs

                this._clog(`Respawning existing ${Object.keys(existingGridderSubJobs).length} sub jobs`);

                // Republish

                for (let i of Object.keys(existingGridderSubJobs)) {

                    let gridderSubJob: GridderSubJob = new GridderSubJob(
                        decomposeKey(i).id,
                        <IGridderSubJob>{
                            gridderjobid: gridderJob.id,
                            cell: {
                                data: null,
                                gridid: gridderJob.gridId,
                                x: existingGridderSubJobs[i].cell.x,
                                y: existingGridderSubJobs[i].cell.y,
                                zoom: existingGridderSubJobs[i].cell.zoom
                            }
                        }
                    );

                    gridderSubJob.gridderJob = gridderJob;

                    this.publishGridderSubJob(gridderSubJob);

                } 

            } else {

                // Fresh start

                // The gridder sub job to be created, if any
                
                let gsj: GridderSubJob;

                // The Redis Data Package to be created, if any

                let redisDataPackage: RedisDataPackage;

                // Set status to RUNNING and register new status

                gridderJob.status = EGridderJobStatus.RUNNING;

                // Starting from scratch

                this._clog("Starting GridderJob from scratch");

                // A placeholder PostGIS connection to connect to
                // source declared here so it can be later closed
                // once the only query to be executed is processed

                let sourcePg: PostGIS;

                // Shortcuts to the variable and cell

                const variable: Variable = gridderJob.variable;
                const cell: Cell = gridderJob.dirtyArea;

                // Get the GridderJob

                this._libCellFactory.set("GridderJob", gridderJob.id,
                    gridderJob.persist)
                .then((gridderJob: GridderJob) => {

                    // Get all geoms at the initial cell

                    // Compose SQL to get initial geoms

                    let sql: string = "select ";

                    // Check if there are lineage columns

                    if ("columns" in variable.lineage.params) {

                        for (let c of variable.lineage.params.columns) {

                            sql += `${c.name}, `;

                        }
                    }

                    sql += `st_asgeojson(st_intersection(${variable.lineage.params.geom}, st_geomfromewkt('${cell.ewkt}'))) as geom, st_area(${variable.lineage.params.geom}) as area, ${variable.lineage.params.value} as value
                    from ${variable.table}
                    where st_intersects(${variable.lineage.params.geom}, 
                        st_geomfromewkt('${cell.ewkt}'))`;

                    // Create a PostGIS to connect to source data

                    sourcePg = this._postgisFromPgConnection(variable.pgConnection, 1);

                    return sourcePg.executeQuery(sql);

                })
                .then((geoms: QueryResult) => {

                    // Close pool

                    sourcePg.closePool();

                    // Apply catalogs to the QueryResult, if any

                    return this._applyCatalogs(variable, geoms);

                })
                .then((geoms: QueryResult) => {

                    // Parse geoms JSON

                    for (let g of geoms.rows) {

                        g.geom = JSON.parse(g.geom);

                    }

                    // Create the new sub job for the initial cell
                    gsj = this.createNewGridderSubJob(cell, gridderJob)

                    // Log starting time and geoms

                    this._logger.log(gsj, <ILoggerMessage> {

                        code: EGridderLogStatus.INITIALJOB,
                        payload: null,
                        posterid: this.id
            
                    });

                    this._logger.log(gsj, <ILoggerMessage> {

                        code: EGridderLogStatus.INITIALGEOMS,
                        payload: geoms.rowCount,
                        posterid: this.id
            
                    });

                    // Create the Redis data package before publishing the subjob

                    redisDataPackage = new RedisDataPackage(
                        gsj, this._persistence);

                    return redisDataPackage.pushDataPackage(geoms.rows);

                })
                .then((key: string) => {

                    // Publish gridder sub job

                    this.publishGridderSubJob(gsj);

                })
                .catch((error) => {

                    this._clog("Unable to start new gridder job");
                    this._clog(error);

                });

            }

        })
        .catch((error: CellError) => {

            this._clog("Error while retrieving GridderJob at startGridderJob");
            console.log(error);
            console.log(error.originalMessage);

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


    /*

        Gets the current list of queues in Redis for workers to listen
        to searching for sub jobs queues by the name "workers:gridderjob:*"

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



    /*

        Increase Redis stats. Each log entry with a EGridderLogStatus code
        has a key by the form "gridderjobstats:[gridder job id]:[code]"
        to increase the number of each message of this type logged and get
        quicker stats than scanning the PostgreSQL log, which is really 
        slow

    */

    private _increaseRedisStats(gridderJob: GridderJob, code: EGridderLogStatus): void {

        this._persistence.redisIncr(`gridderjobstats:${gridderJob.id}:${code}`);

    }



    /*
    
        Returns a Persistence object with PostGIS configured 
        from a PgConnection

        Used frequently to connect the worker to source DBs

    */

    private _postgisFromPgConnection(pgConnection: PgConnection,
    maxConn: number): PostGIS {

        const p: PostGIS = new PostGIS(
            pgConnection.host,
            pgConnection.port,
            pgConnection.user,
            pgConnection.pass,
            pgConnection.db
        );

        p.initPool(maxConn);

        return p;

    }



    /*

        Translates catalogs in a colliding geoms results

        The transformation is directly applied to the QueryResult containing
        original lineaged colliding geoms data retrieved from the source DB. For
        each catalog found in the columns section of the variable lineage, a new
        row data item called "catalog::catalogname" will be aggregated with the
        forwarded key in the catalog that matches the given lineage data. This 
        usually is used then by functions like this._aggregateLineage to aggregate
        data by lineage.

        variable: Variable: The variable

        geoms: QueryResult: A colliding geoms extraction (see this._getCollidingGeoms) 

        returns: The query result with the keys of the catalogs applied to the lineage columns

    */

    protected _applyCatalogs(variable: Variable, geoms: any): Promise<QueryResult> {

        return new Promise((resolve, reject) => {

            // First check if there is any lineage

            if ("columns" in variable.lineage.params) {

                // Get lineage columns

                const columns: any[] = variable.lineage.params.columns;

                // Get catalog names in columns

                const catNames = columns.map((x) => { return x.catalog });

                // Get a hash map with the catalogs and their keys

                this.libCellFactory.getSetHash("Catalog", catNames)
                .then((catalogs: { [ id: string ]: Catalog }) =>{

                    // Iterate rows

                    for (let g of geoms.rows) {

                        // Iterate columns 

                        for (let c of columns) {

                            // Forward the catalog value for each column into 
                            // the row structure with a "catalog::catalogname" key

                            g[`catalog::${c.catalog}`] = 
                                catalogs[c.catalog].forward[g[c.name]];

                        }

                    }

                    resolve(geoms);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR, "Error applying catalogs", error));

                })

            } else {

                // There are no columns for lineage, so return rows unaffected

                resolve(geoms);

            }

        })
        
    }


}