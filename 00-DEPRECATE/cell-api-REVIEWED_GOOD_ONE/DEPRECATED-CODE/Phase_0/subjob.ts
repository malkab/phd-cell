/*

    SubJob class.

*/

import { Cell, ICell } from "./cell";
import { Job } from "./job";
import { sha256 } from "js-sha256";
import { PostGIS } from "./postgis";
import { QueryResult } from "pg";



/*

    Definition interface

*/

export interface ISubJob {

    job: Job;
    cell: Cell;

}



/*

    Subjobs status

*/

export enum SubJobStatus {
    CREATED = 0,
    STARTED,
    FINISHED
}


/*

    SubJob Redis submission interface

*/

export interface ISubJobSubmission {

    jobHash: string;
    cellDefinition: ICell;
    subJobHash: string;

}



/*

    Class

*/

export class SubJob {

    /*

        Members

    */

    private _hash: string;
    private _parentJob: Job;
    private _cell: Cell;
    private _definition: ISubJob;


    /*

        Getters & Setters

    */

    get hash(): string {

        return this._hash;

    }

    /*

        Constructor by definition

    */

    constructor(def: ISubJob) {

        this._parentJob = def.job;
        this._cell = def.cell;
        this._definition = def;

        this._hash = sha256(JSON.stringify(this._parentJob.definition) +
            JSON.stringify(this._cell.definition) + Date.now());

    }


    /*

        Write to CellDS

        postgis: a PostGIS object
        returns: a promise

    */

    // public writeToCellDS(): Promise<QueryResult> {

    //     return new Promise<QueryResult>((resolve, reject) => {

    //         this._parentJob.parentCellAPI.cellDS.postgis.executeParamQuery(`
    //         select cell__registersubjob(
    //             $1, $2, $3, $4, $5, $6
    //         )`,
    //         [ this._hash, this._parentJob.grid.hash, this._parentJob.hash,
    //         this._cell.zoom, this._cell.x, this._cell.y ])
    //         .then((queryResult) => {
    //             return this.publishLog(SubJobStatus.CREATED);
    //         })
    //         .then((queryResult) => {
    //             resolve(queryResult);
    //         })
    //         .catch((error) => {
    //             reject(error);
    //         });

    //     });

    // }


    /*

        Writes an entry into the subjoblog table

        status: The new status

    */

    // public publishLog(status: SubJobStatus): Promise<QueryResult> {

    //     return this._parentJob.parentCellAPI.cellDS.postgis.executeParamQuery(`
    //         select cell__subjoblog($1, $2);
    //     `, [ this._hash, status ]);


    // }


    /*

        Publishes the subjob to the Redis queue

        returns number: the number of subjobs in the queue

    */

    // public publishToRedis(): Promise<number> {

    //     const redis = this._parentJob.parentCellAPI.redis.client;

    //     const submission = JSON.stringify(
    //         <ISubJobSubmission>{
    //             cellDefinition: this._cell.definition,
    //             jobHash: this._parentJob.hash,
    //             subJobHash: this._hash
    //         });

    //     return new Promise<number>((resolve, reject) => {
    //         redis.lpush("subjobs", submission, (err, key) => {

    //             if (err) {
    //                 reject(err);
    //             }

    //             resolve(key);

    //         });

    //     });

    // }

}