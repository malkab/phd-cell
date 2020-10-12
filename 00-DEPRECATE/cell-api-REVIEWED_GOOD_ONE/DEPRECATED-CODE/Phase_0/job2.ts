/*

    Jobs.

*/

import { IDataSource } from "./datasource";
import { IAdscriptionMethod } from "./adscriptionmethod";
import { Bbox, IBbox } from "./bbox";
import { sha256 } from "js-sha256";
import { CellDS, ICellDS } from "./cellds";
import { Grid } from "./grid";
import { Redis } from "./redis";
// import { SubJob, ISubJob, ISubJobSubmission } from "./subjob";
// import { Cell } from "./cell";
// import { QueryResult } from "pg";


/*

    Definition interface

*/
export interface IJob {
    name: string;
    gridHash: string;
    zoomLevels: number[];
    dataSource: IDataSource;
    cellDS: ICellDS;
    table: string;
    variableName: string;
    adscriptionMethod: IAdscriptionMethod;
    dirtyArea?: IBbox;
    hash?: string;
}


/*

    Jobs status

*/

export enum JobStatus {
    CREATED = 0,
    STARTED,
    FINISHED
}


/*

    Job class

*/
export class Job {

    /*

        Members

    */

    // private _hash: string;
    // private _name: string;
    // private _parentCellDS: CellDS;
    // private _definition: IJob;
    // private _initialBbox: Bbox;
    // private _grid: Grid;
    // private _dataSource: IDataSource;
    // private _table: string;
    // private _variableName: string;
    // private _zoomLevels: number[];
    // private _adscriptionMethod: IAdscriptionMethod;

    // The parent Redis object read and write messages
    private _redis: Redis;


    /*

        Getters & Setters

    */

//     get hash(): string {
//         return this._hash;
//     }

//     get definition(): IJob {

//         return this._definition;

//     }

//     get parentCellAPI(): CellDS {

//         return this._parentCellDS;

//     }

//     get grid(): Grid {

//         return this._grid;

//     }


//     /*

//         Constructor

//     */
//     constructor(parentCellDS: CellDS, def: IJob) {

//         // Check if there is a hash in the definition
//         if ( def.hash ) {
//             this._hash = def.hash;
//         } else {
//             this._hash = sha256(JSON.stringify(def));
//         }

//         this._name = def.name;
//         this._parentCellDS = parentCellDS;
//         this._definition = def;
//         this._table = def.table;
//         this._variableName = def.variableName;
//         this._adscriptionMethod = def.adscriptionMethod;
//         this._initialBbox = new Bbox(def.dirtyArea);
//         // this._grid = this._parentCellDS.getGrid(def.gridHash);
//         this._zoomLevels = def.zoomLevels;
//         this._dataSource = def.dataSource;

//     }


//     /*

//         Writes the job to Redis

//         return: a promise with the hash of the job if successfull

//     */
//     public writeToRedis(): Promise<string> {

//         return this._parentCellDS.parentCellAPI.redis.setJSON(`job:${this._hash}`, this._definition);

//     }


//     /*

//         Starts the job

//         returns: the total number of initial subjobs created

//     */

//     // public startJob(): number {

//     //     // Get all cells covering the bbox at initial zoom
//     //     const initialCells = this._grid.getBboxCellCoverage(this._initialBbox, this._zoomLevels[0]);

//     //     // Push a subjob for each cell
//     //     for ( let c of initialCells ) {

//     //         this.publishSubJob(c)
//     //         .then((numSubJobs) => {
//     //             console.log(`Subjobs in queue: ${numSubJobs}`);
//     //         })
//     //         .catch((error) => {
//     //             console.log(error);
//     //         });

//     //     }

//     //     this.writeToRedis();
//     //     this._grid.writeToRedis();

//     //     return(initialCells.length);

//     // }


//     /*

//         Publishes a new subjob

//     */

//     // public publishSubJob(cell: Cell): Promise<number> {

//     //     return new Promise<number>((resolve, reject) => {

//     //         // Get the Redis client
//     //         const redis = this._parentCellDS.parentCellAPI.redis.client;

//     //         // Creates the new subjob
//     //         const subjob: SubJob = new SubJob(<ISubJob>{
//     //             cell: cell,
//     //             job: this
//     //         });

//     //         subjob.writeToCellDS()
//     //         .then((query) => { return subjob.publishToRedis(); })
//     //         .then((numSubJobs) => {
//     //             resolve(numSubJobs);
//     //         })
//     //         .catch((error) => {
//     //             reject(error);
//     //         });

//     //     });

//     // }


//     /*

//         Writes an entry into the joblog table

//         status: The new status

//     */

// //    public publishLog(status: JobStatus): Promise<QueryResult> {

// //         return this._parentCellDS.parentCellAPI.cellDS.postgis.executeParamQuery(`
// //             select cell__joblog($1, $2);
// //         `, [ this._hash, status ]);

// //     }


//     /*

//         Write to CellDS

//     */

//     public writeToCellDS(): Promise<string> {

//         return new Promise<string>((resolve, reject) => {

//             const bboxDef: IBbox = {
//                 epsg: this._initialBbox.epsg,
//                 minx: this._initialBbox.lowerLeft.x,
//                 maxx: this._initialBbox.upperRight.x,
//                 miny: this._initialBbox.lowerLeft.y,
//                 maxy: this._initialBbox.upperRight.y
//             };

//             this._parentCellDS.postgis.executeParamQuery(`
//                 select cell__registerjob(
//                     $1, $2, $3, $4, $5, $6, $7, $8, $9
//                 )`,
//             [this._hash, this._name, this._grid.hash,
//             this._zoomLevels, this._dataSource,
//             this._table, this._variableName, this._adscriptionMethod,
//             bboxDef])

//             .then((success) => {
//                 return this.publishLog(JobStatus.CREATED);
//             })
//             .then((success) => {
//                 resolve(this.hash);
//             })
//             .catch((error) => { reject(error); });

//         });

//     }

}