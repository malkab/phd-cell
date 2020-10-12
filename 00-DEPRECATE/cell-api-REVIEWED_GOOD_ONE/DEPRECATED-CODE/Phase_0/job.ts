/*

    Job class.

*/

import { IPostGIS, PostGIS, IQueryResult } from "./postgis";
import { IAdscriptionMethod } from "./iadscriptionmethod";
import { Bbox, IBbox } from "./bbox";
import { sha256 } from "js-sha256";
import { DBConnections } from "./dbConnections";



// Interfaz

export interface IJob {
    name: string;
    description: string;
    dataSource: IPostGIS;
    cellDs: IPostGIS;
    adscriptionMethod: IAdscriptionMethod;
    useExistingTiles: boolean;
    bbox?: IBbox;
}

// Jobs status
export enum JobStatus {
    Active = 0,
    Completed
}


export class Job {
    // Members
    private _hash: string;
    private _name: string;
    private _description: string;
    private _adscriptionMethod: IAdscriptionMethod;
    private _bbox: Bbox;
    private _status: JobStatus;

    private _dataSource: IPostGIS;
    private _dataSourcePostGIS: PostGIS;
    private _dataSourceHash: string;

    private _cellDs: IPostGIS;
    private _cellDsPostGIS: PostGIS;
    private _cellDsHash: string;

    private _useExistingTiles: boolean;
    private _dbStatusPostGIS: PostGIS;


    // Getters
    get hash(): string {
        return this._hash;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get dataSourcePostGIS(): PostGIS {
        return this._dataSourcePostGIS;
    }

    get cellDsPostGIS(): PostGIS {
        return this._cellDsPostGIS;
    }

    get dataSource(): IPostGIS {
        return this._dataSource;
    }

    get cellDs(): IPostGIS {
        return this._cellDs;
    }

    get adscriptionMethod(): IAdscriptionMethod {
        return this._adscriptionMethod;
    }

    get bbox(): Bbox {
        return this._bbox;
    }

    get status(): number {
        return this._status;
    }

    set status(status: number) {
        this._status = status;
    }

    get useExistingTiles(): Boolean {
        return this._useExistingTiles;
    }

    get jobDbStatusRecord(): any {
        return [
            this.hash,
            this.name,
            this.description,
            JSON.stringify(this.dataSource),
            JSON.stringify(this.cellDs),
            JSON.stringify(this.adscriptionMethod),
            this._status,
            JSON.stringify(this.bbox.pggeojson)
        ];
    }


    // Constructor
    constructor(iJob: IJob, dbStatusPostGIS: PostGIS,
        dbConnections: DBConnections, maxPoolSize: number) {

        this._name = iJob.name;
        this._description = iJob.description;

        // Connection to master DBStatus
        this._dbStatusPostGIS = dbStatusPostGIS;

        // Initialize data source connection
        this._dataSource = iJob.dataSource;
        this._dataSourceHash = dbConnections.createNewConnection(iJob.dataSource);
        this._dataSourcePostGIS =
            dbConnections.getConnectionByHash(this._dataSourceHash);
        this._dataSourcePostGIS.initPool(maxPoolSize);

        // Initialize CellDS connection
        this._cellDs = iJob.cellDs;
        this._cellDsHash = dbConnections.createNewConnection(iJob.cellDs);
        this._cellDsPostGIS =
            dbConnections.getConnectionByHash(this._cellDsHash);
        this._cellDsPostGIS.initPool(maxPoolSize);

        this._adscriptionMethod = iJob.adscriptionMethod;

        this._useExistingTiles = iJob.useExistingTiles;

        if (iJob.bbox) {
            this._bbox = new Bbox(iJob.bbox);
        }

        this._hash = this.getHash();

        return this;
    }


    // Generates a hash
    private getHash(): string {
        return sha256(`${Date.now()}${this._name}${this._description}`);
    }


    // Registers the job into the database
    public writeToDbStatus(): Promise<IQueryResult> {
        return new Promise<IQueryResult>((resolve, reject) => {

            const q = "select cell__createjob($1, $2, $3, $4, $5, $6, $7, $8);";
            this._dbStatusPostGIS.executeParamQuery(q, this.jobDbStatusRecord)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });

        });
    }


    /**
     *
     * TEST ZONE
     *
     *
     */




    // // Initializes the job
    // public initJob(): Promise<IOutput> {
    //     return new Promise((resolve, reject) => {
    //         // Check if there are already any cells at top zoom
    //         if (this.useExistingTiles) {
    //             console.log("S");
    //         }
    //     });
    // }


    // // Get cells at CellDS with a given zoom

}