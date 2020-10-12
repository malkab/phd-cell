/*

    This class handles all Redis logging facilities.

*/

import { Persistence } from "../libpersistence/persistence";
import { GridderSubJob } from "./libcell/griddersubjob";
import { EGridderLogStatus } from "./egridderlogstatus";



/*

    Interface to compose messages

*/

export interface ILoggerMessage {

    code: number;
    posterid: string;
    payload: any;

}



/*

    The class

*/

export class RedisLogger {

    /*

        Private members

    */

    // Persistence to log issues to Redis
    private _persistence: Persistence;





    /*

        Constructor

    */

    constructor(persistence: Persistence) {

        this._persistence = persistence;

    }



    /*

        Log into Redis

    */

    public log(gridderSubJob: GridderSubJob, message: ILoggerMessage): void {

        // The gridder job and the worker ID, for short

        const gjId: string = gridderSubJob.gridderJobId;
        const wId: string = message.posterid;

        // Log first activity

        if (message.code === 500) {

            this._logSet(gjId, wId, "firstactivity", 
                <string><any>new Date().getTime());

        }

        // Log initial geoms

        if (message.code === 550) {

            this._logSet(gjId, wId, "initialgeoms", +message.payload);

        }

        // Count geoms processed so far

        if (message.code === EGridderLogStatus.GEOMSFOUND) {

            this._logInc(gjId, wId, "processedgeoms", +message.payload.numgeoms);

        }

        // Log last activity

        this._logSet(gjId, wId, "lastactivity", <string><any>new Date().getTime());

        // Log into stats the code counters

        this._logInc(gjId, wId, <string><any>message.code, 1);

        // If it's a cell finished, log its zoom

        if (message.code === 9000) {

            this._logInc(gjId, wId, `ncellszoom::${gridderSubJob.cell.zoom}`, 1);

            this._logInc(gjId, wId, "ncells", 1);

        }

    }



    /*

        Private methods

    */

    // HSET a value into general and worker stats

    private _logSet(gridderJobId: string, workerId: string, key: string, value: any): void {

        // General stats

        this._persistence.redisHSET(`gridderjobstats:${gridderJobId}`, "id", "master");

        this._persistence.redisHSET(`gridderjobstats:${gridderJobId}`, key, value);

        // Worker stats

        this._persistence.redisHSET(`gridderjobstats:${gridderJobId}:${workerId}`, "id", workerId);

        this._persistence.redisHSET(`gridderjobstats:${gridderJobId}:${workerId}`, key, value);

    }


    // HINCRBY a value into general and worker stats

    private _logInc(gridderJobId: string, workerId: string, key: string, value: any): void {

        // General stats

        this._persistence.redisHSET(`gridderjobstats:${gridderJobId}`, "id", "master");

        this._persistence.redisHINCRBY(`gridderjobstats:${gridderJobId}`, key, value);

        // Worker stats

        this._persistence.redisHSET(`gridderjobstats:${gridderJobId}:${workerId}`, "id", workerId);

        this._persistence.redisHINCRBY(`gridderjobstats:${gridderJobId}:${workerId}`, key, value);

    }

}