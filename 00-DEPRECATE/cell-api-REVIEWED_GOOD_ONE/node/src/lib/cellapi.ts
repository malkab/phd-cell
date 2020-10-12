/*

    CellAPI controller class

*/

import { PgConnection, IPgConnection } from "./libcellbackend/libcell/pgconnection";
import { Catalog } from "./libcellbackend/libcell/catalog";
import { Grid } from "./libcellbackend/libcell/grid";
import { CellObject } from "./libcellbackend/libcell/cellobject";
import { CellError, ECellErrorCode } from "./libcellbackend/libcell/cellerror";
import { Persistence } from "./libpersistence/persistence";
import { PostGIS } from "./libpersistence/services/postgis";
import { GridderJob, EGridderJobStatus } from "./libcellbackend/libcell/gridderjob";
import { CellEditor, ICellRequest } from "./libcellbackend/celleditor";
import { Cell } from "./libcellbackend/libcell/cell";
import { LibCellFactory } from "./libcellbackend/libcellfactory";
import { Workers } from "./workers";
import { EMessageType } from "./libcellbackend/message";
import { GridderJobsUtils } from "./libcellbackend/gridderjobsutils";




// Definition interface
export interface ICellAPI {
    id: string;                         // API identifiers for messages
    redisUrl: string;                   // The Redis URL
    redisPort: number;                  // The Redis port
    redisPassword: string;              // The Redis password
    redisTimeOut: number;               // The Redis timeout
    cellDsConnection: IPgConnection;    // CellDS connection
    pgPoolSize: number;                 // Pooling size for PG
    redisQueueApiWorker: string;        // Redis queues to talk to controllers
    redisQueueWorkerApi: string;
    workersHeartbeat: number;
}



// Class
export class CellAPI {

    /*

        Private members

    */

    // ID for messages
    private _id: string;

    // Original creation params
    private _initialization: ICellAPI;

    // The Redis timeout
    private _redisTimeOut: number;

    // GridderJobs controller
    private _workers: Workers;

    // Worker queues
    private _redisQueueApiWorker: string;
    private _redisQueueWorkerApi: string;
    private _workersHeartbeat: number;

    // CellEditor
    private _cellEditor: CellEditor;

    // CellDS, the class that models a CellDS database
    private _persistence: Persistence;

    // The CellObjects factory
    private _libCellFactory: LibCellFactory;



    /*

        Getters & Setters

    */


    /*

        Constructor

    */

    constructor(iCellAPI: ICellAPI) {

        this._initialization = iCellAPI;
        this._id = iCellAPI.id;

        this._persistence = new Persistence();

        this._persistence.initPg(
            iCellAPI.cellDsConnection.host,
            iCellAPI.cellDsConnection.port,
            iCellAPI.cellDsConnection.user,
            iCellAPI.cellDsConnection.pass,
            iCellAPI.cellDsConnection.db,
            "meta.celldsobject",
            "id",
            "initialization",
            iCellAPI.pgPoolSize
        );

        this._redisQueueApiWorker = iCellAPI.redisQueueApiWorker;
        this._redisQueueWorkerApi = iCellAPI.redisQueueWorkerApi;
        this._workersHeartbeat = iCellAPI.workersHeartbeat;

        try {

            this._persistence.initRedis(iCellAPI.redisUrl, iCellAPI.redisPort, iCellAPI.redisPassword, (error: any) => {
                console.log("callback", error);
            });

            this._redisTimeOut = iCellAPI.redisTimeOut;

            this._libCellFactory = new LibCellFactory(this._persistence);

            this._cellEditor = new CellEditor(this._persistence, this._libCellFactory);

            this._workers = new Workers(
                this._workersHeartbeat,
                this._redisQueueApiWorker,
                this._redisQueueWorkerApi,
                this._persistence,
                iCellAPI.redisUrl, 
                iCellAPI.redisPort,
                iCellAPI.redisPassword,
                (error: any) => {

                    console.log("Error at Workers/Persistence Redis");
                    console.log("Error: ", error);

                }
            );

            this._workers.workerApiLoop();

        } catch {
            console.log("Error logging into redis");
        }

    }




    /*

        Public methods

    */

    public set(type: string, id: string, body: any): Promise<CellObject> {

        return this._libCellFactory.set(type, id, body);

    }

    public list(type: string): Promise<CellObject[]> {

        return this._libCellFactory.list(type);

    }

    public get(type: string, id: string): Promise<CellObject> {

        return this._libCellFactory.get(type, id);

    }

    public del(type: string, id: string): Promise<CellObject> {

        return this._libCellFactory.del(type, id);

    }


    /*

        Get workers

    */

    public getWorkers(): Promise<any> {

        return this._workers.getWorkers();

    }



    /*

        A pathetic testbed

    */

    public testbed(): string {

        this._libCellFactory.get("Grid", "eu-grid")
        .then((grid: Grid) => {

            const c: Cell = new Cell(grid, 0, 0, 0, { er: 34 });

            this._cellEditor.set(c);

        })
        .catch((error) => {
            throw error;
        });

        return "testbed";

    }


    /*

        Starts a GridderJob

    */

    public startGridderJob(id: string): Promise<GridderJob> {
        
        return new Promise<GridderJob>((resolve, reject) => {

            this._libCellFactory.get("GridderJob", id)
            .then((gridderJob: GridderJob) => {

                this._workers.sendWorkerMessage(
                    {
                        idPoster: this._id,
                        typeCode: EMessageType.APISTARTGRIDDERJOB,
                        time: new Date().getTime(),
                        payload: {
                            id: id
                        }
                    }
                )

                resolve(gridderJob);

            })
            .catch((error) => {
                reject(new CellError(ECellErrorCode.DATAERROR,
                    `CellAPI startGridderJob: Error starting GridderJob ${id}`, error));
            });

        });

    }


    /*

        Stops a GridderJob

    */

    public stopGridderJob(id: string): Promise<GridderJob> {

        return new Promise<GridderJob>((resolve, reject) => {

            this._libCellFactory.get("GridderJob", id)
            .then((gridderJob: GridderJob) => {

                gridderJob.status = EGridderJobStatus.IDLE;

                return this._libCellFactory.set("GridderJob", id, gridderJob.persist);

            })
            .then((gridderJob: GridderJob) => {

                resolve(gridderJob);

            })
            .catch((error) => {
                reject(new CellError(ECellErrorCode.DATAERROR,
                    `CellAPI startGridderJob: Error stoping GridderJob ${id}`, error));
            });

        });

    }


    // Closes connections

    public close(): void {
        this._persistence.close();
    }


    /*

        Builds a catalog

    */

    public buildCatalog(id: string): Promise<Catalog> {

        return new Promise<Catalog>((resolve, reject) => {

            let catalog: Catalog;
            let pgConnection: PgConnection;

            this._libCellFactory.get("Catalog", id)
            .then((cat: Catalog) => {

                catalog = cat;

                const pgSource: PostGIS = this._getPostGIS(catalog.pgConnection, 1);

                // Get distinct values
                return pgSource.distinct(catalog.table, catalog.column);

            })
            .then((values) => {

                catalog.build(values);

                return this._persistence.set(catalog.key, catalog.persist);

            })
            .then((result) => {

                resolve(catalog);

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.CLASSERROR, `Error building catalog ${id}`, error));

            });

        });

    }


    /*

        Get GridderJob activity statistics

    */

    public infoGridderJob(id: string): Promise<any> {

        return new GridderJobsUtils(this._libCellFactory).infoGridderJob(id);

    }



    /*

        Returns cells

    */

    public getCells(request: ICellRequest): Promise<any> {

        return this._cellEditor.get(request);

    }


    // /*

    //     Returns var statistics

    // */

    // public varstats(id: string): Promise<any> {

    //     return new Promise<any>((resolve, reject) => {

    //         this._libCellFactory.get("Variable", id)
    //         .then((variable: Variable) => {

    //             console.log(variable);

    //             const miniHash: string = variable.miniHash;



    //         });

    //     });

    // }



    /*

        Private methods

    */

    /*

        Creates a PostGIS connection

    */

    private _getPostGIS(pgConnection: PgConnection, connNumber: number): PostGIS {

        const pg =  new PostGIS(
            pgConnection.host,
            pgConnection.port,
            pgConnection.user,
            pgConnection.pass,
            pgConnection.db
        );

        pg.initPool(connNumber);

        return pg;

    }

}