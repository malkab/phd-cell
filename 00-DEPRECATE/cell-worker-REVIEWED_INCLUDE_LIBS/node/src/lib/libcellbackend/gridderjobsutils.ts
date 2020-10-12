/*

    This class sports some utilites for Gridder Jobs analysis

*/

import { LibCellFactory } from "./libcellfactory";
import { GridderJob } from "./libcell/gridderjob";
import { QueryResult } from "pg";
import { CellError, ECellErrorCode } from "./libcell/cellerror";
// import { EGridderJobStatus } from "./egridderlogstatus";



export class GridderJobsUtils {

    /*

        Private members

    */

    private _libCellFactory: LibCellFactory;



    /*

        Constructor

    */

    constructor(libCellFactory: LibCellFactory) {

        this._libCellFactory = libCellFactory;

    }


    /*

        Returns GridderSubJob statistics for a GridderJob

    */

    public infoGridderJob(id: string): Promise <any> {

        return new Promise<any>((resolve, reject) => {

            // Get all keys that holds stats about the GridderJob

            this._libCellFactory.getRedisKeys(`gridderjobstats:${id}*`)
            .then((keys: string[]) => {

                // Get all hashmaps that has stats

                const promises: Promise<any>[] = [];

                for (let i of keys) {

                    promises.push(this._libCellFactory.getRedisHashMap(i));

                }

                return Promise.all(promises);

            })
            .then((hashes: any[]) => {

                let out: any = {};

                // Look for the master hash

                const master: any = (hashes.filter((x: any) => { return x.id === "master" }))[0];

                // Iterate hashes and build response

                for (let h of hashes) {

                    let hout: any = {};

                    hout.initialjobs = h["500"];
                    hout.initialgeoms = h["550"];
                    hout.jobscreated = h["1000"];
                    hout.jobsqueued = h["2000"];
                    hout.jobsstarted = h["3000"];
                    hout.jobsfinished = h["9000"];
                    hout.started = (new Date(+master["firstactivity"])).toString();
                    hout.lastactivity = (new Date(+h["lastactivity"])).toString();

                    // Calculate duration

                    let total_sec: number = Math.floor(((+h["lastactivity"])-(+master["firstactivity"])) / 1000);

                    let total_hour: number = Math.floor(total_sec / 3600);

                    let res_sec: number = total_sec % 3600;

                    let total_min: number = Math.floor(res_sec / 60);

                    res_sec = res_sec % 60; 

                    hout.duration = `${total_hour}:${total_min}:${res_sec}`;

                    hout.initialgeoms = h["initialgeoms"];
                    hout.processedgeoms = h["processedgeoms"];

                    hout.cells = {
                        total: h["ncells"]
                    };

                    for (let k of Object.keys(h)) {

                        if (k.substring(0,12) === "ncellszoom::") {

                            const s = k.split("::");

                            hout.cells[`zoom${s[1]}`] = h[k];

                        }

                    }

                    out[h["id"]] = hout;

                }

                resolve(out);


            })
            .catch((error: any) => {

                reject(new CellError(ECellErrorCode.DATAERROR, `Error processing gridder job info for GridderJob ${id}`, error));

            });

        });

    }

}
