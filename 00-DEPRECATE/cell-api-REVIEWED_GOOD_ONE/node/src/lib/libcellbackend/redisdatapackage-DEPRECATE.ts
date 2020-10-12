/*

    This class is used to store geometry data from the database
    into Redis for quick processing

*/

import { GridderSubJob } from "./libcell/griddersubjob";
import { Persistence } from "../libpersistence/persistence";
import { CellError, ECellErrorCode } from "./libcell/cellerror";




export class RedisDataPackage {

    /*

        Private members

    */

    // The GridderSubJob this package belongs to

    private _gridderSubJob: GridderSubJob;

    // The persistence to read data from and to

    private _persistence: Persistence;



    /*

        Getters && Setters

    */

    // The Redis data package for the sub job cell, it is a key with syntax:
    //
    //      geoms:[ gridderjob ID ]:[ cell zoom ]:[ cell x ]:[ cell y ]

    get dataPackageKey(): string {

        return `geoms:${this._gridderSubJob.gridderJob.id}:${this._gridderSubJob.cell.zoom}:${this._gridderSubJob.cell.x}:${this._gridderSubJob.cell.y}`;

    }




    /*

        The constructor.

        gridderSubJob: GridderSubJob: The GridderSubJob this data package 
        belongs to.

    */

    constructor(gridderSubJob: GridderSubJob, persistence: Persistence) {

        this._gridderSubJob = gridderSubJob;

        this._persistence = persistence;

    }



    /*

        Public methods

    */

    /*
     
        Pushes an array of data to the data package.

        This function creates a Redis data package, that is, a key with syntax:

            geoms:[ gridder job ID ]:[ cell zoom ]:[ cell x ]:[ cell y ]

        and as value a stringified version of the data row extracted from the database.

        This functions doesn't return anything, but it loads the data package at Redis.

        gridderSubJob: GridderSubJob: The GridderSubJob associated with this data package

        data: any[]: The array containing the data

        returns: A promise returning this data package key when the data is loaded.

    */

    public pushDataPackage(data: any[]): Promise<string> {
        
        return new Promise<string>((resolve, reject) => {

            const promises: Promise<number>[] = [];

            // Iterate and load data using promises

            for (let g of data) {

                promises.push(this._persistence.redisRPush(
                    this.dataPackageKey, JSON.stringify(g)
                ));

            }

            Promise.all(promises)
            .then((values) => {

                resolve(this.dataPackageKey);

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error creating Redis data package`, error));

            });

        });

    }



    /*

        Deletes the data package from Redis

    */

    public async deleteDataPackage(): Promise<number> {

        try {

            return await this._persistence.redisDel(this.dataPackageKey);

        } catch (error) {

            throw(error);

        }

    }


    /*

        Get the Redis data package and return it as an array of data

    */

    public pullDataPackage(): Promise<any[]> {

        return new Promise<any[]>((resolve, reject) => {

            // Get all elements in the data package key list at Redis

            this._persistence.redisLRANGE(this.dataPackageKey, 0, -1)
            .then((data: string[]) => {

                // An output data structure

                const out: any[] = [];

                // Convert extracted strings to objects

                for (let d of data) {

                    // Parse object and its geom

                    let o: any = JSON.parse(d);

                    out.push(o);

                }

                resolve(out);

            })
            .catch((error) => {

                // Error
                
                reject(new CellError(ECellErrorCode.DATAERROR, 
                    `Unable to get data for RedisDataPackage ${this.dataPackageKey}`,
                    error))

            })

        })

    }

}