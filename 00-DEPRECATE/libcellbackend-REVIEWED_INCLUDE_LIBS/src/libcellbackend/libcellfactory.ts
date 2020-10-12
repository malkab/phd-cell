/*

    This class creates and persist fully initialized CellObjects instances

*/

import { CellObject, ICellObject } from "../libcellbackend/libcell/cellobject";
import { Grid, IGrid } from "../libcellbackend/libcell/grid";
import { Persistence } from "../libpersistence/persistence";
import { CellError, ECellErrorCode } from "../libcellbackend/libcell/cellerror";
import { PgConnection, IPgConnection } from "../libcellbackend/libcell/pgconnection";
import { Catalog, ICatalog } from "../libcellbackend/libcell/catalog";
import { Variable, IVariable } from "../libcellbackend/libcell/variable";
import { GridderJob, IGridderJob, EGridderJobStatus } from "../libcellbackend/libcell/gridderjob";
import { GridderSubJob, IGridderSubJob } from "../libcellbackend/libcell/griddersubjob";
import { getMiniHash, getHash } from "../libcellbackend/libcell/utils";
import { QueryResult } from "pg";
import { decomposeKey } from "./libcell/utils";
import { Cell } from "../libcellbackend/libcell/cell";




export class LibCellFactory {

    /*

        Private members

    */

    // CellDS, the class that models a CellDS database
    private _persistence: Persistence;




    /*

        Getters and setters

    */



    /*

        Constructor

    */

    constructor(persistence: Persistence) {

        this._persistence = persistence;

    }


    /*

        Public members

    */

    // Creates or updates a new CellObject

    public set(type: string, id: string, init: any): Promise<CellObject> {

        return new Promise<CellObject>((resolve, reject) => {

            if (type === "Grid") {

                try {
                    const grid: Grid = new Grid(id, <IGrid>init);

                    this._persistence.set(grid.key, grid.persist)
                    .then((success) => {
                        resolve(grid);
                    })
                    .catch((error) => {
                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error setting new Grid ${id}`, error));
                    });
                } catch (error) {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error setting new Grid ${id}`, error));
                }

            } else if (type === "PgConnection") {

                try {
                    const pgConnection: PgConnection = new PgConnection(id, <IPgConnection>init);

                    this._persistence.set(pgConnection.key, pgConnection.persist)
                    .then((success) => {
                        resolve(pgConnection);
                    })
                    .catch((error) => {
                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error setting new PgConnection ${id}`, error));
                    });
                } catch (error) {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error setting new PgConnection ${id}`, error));
                }

            } else if (type === "Catalog") {

                try {
                    let catalog: Catalog = new Catalog(id, <ICatalog>init);

                    this.get("PgConnection", (<ICatalog>init).pgconnectionid)
                    .then((pgConnection: PgConnection) => {

                        catalog.pgConnection = pgConnection;

                        return this._persistence.set(catalog.key, catalog.persist);
                    })
                    .then((success) => {
                        resolve(catalog);
                    })
                    .catch((error) => {
                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error setting new Catalog ${id}`, error));
                    });
                } catch (error) {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error setting new Catalog ${id}`, error));
                }

            } else if (type === "Variable") {

                try {
                    let variable: Variable = new Variable(id, <IVariable>init);

                    this.get("PgConnection", (<IVariable>init).pgconnectionid)
                    .then((pgConnection: PgConnection) => {

                        variable.pgConnection = pgConnection;

                        return this._getMinihash(variable);

                    })
                    .then((minihash: string) => {
                        variable.miniHash = minihash;

                        return this._persistence.set(variable.key,
                        variable.persist);
                    })
                    .then((success) => {
                        resolve(variable);
                    })
                    .catch((error) => {
                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error setting new Variable ${id}`, error));
                    });
                } catch (error) {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error setting new Variable ${id}`, error));
                }

            } else if (type === "GridderJob") {

                try {

                    const gridderJob: GridderJob =
                        new GridderJob(id, <IGridderJob>init);

                    this.get("Grid", (<IGridderJob>init).gridid)
                    .then((grid: Grid) => {

                        gridderJob.grid = grid;

                        return this.get("Variable", (<IGridderJob>init).variableid);

                    })
                    .then((variable: Variable) => {

                        gridderJob.variable = variable;

                        return this._persistence.set(gridderJob.key, gridderJob.persist);

                    })
                    .then((success) => {

                        resolve(gridderJob);

                    })
                    .catch((error) => {
                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error setting new GridderJob ${id}`, error));
                    });
                } catch (error) {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error setting new GridderJob ${id}`, error));
                }

            } else if (type === "GridderSubJob") {

                try {
                    const gsjInit = <IGridderSubJob>init;

                    const gridderSubJob: GridderSubJob =
                        new GridderSubJob(id, gsjInit);

                    this.get("GridderJob", gsjInit.gridderjobid)
                    .then((gridderJob: GridderJob) => {

                        gridderSubJob.gridderJob = gridderJob;

                        return this.get("Grid", gsjInit.cell.gridid);

                    })
                    .then((grid: Grid) => {

                        const cell: Cell = new Cell(
                            grid, gsjInit.cell.zoom, gsjInit.cell.x,
                            gsjInit.cell.y, gsjInit.cell.data);

                        gridderSubJob.cell = cell;

                        return this._persistence.set(gridderSubJob.key, gridderSubJob.persist);

                    })
                    .then((success) => {

                        resolve(gridderSubJob);

                    })
                    .catch((error) => {
                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error setting new GridderSubJob ${id}`, error));
                    });
                } catch (error) {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error setting new GridderSubJob ${id}`, error));
                }

            } else {

                reject(new CellError(ECellErrorCode.CLASSERROR, `Type ${type} does not exists`));

            }

        });

    }


    // Get list of CellObjects

    public list(type: string): Promise<any[]> {

        return new Promise<any[]>((resolve, reject) => {

            if (type === "Grid") {

                this._persistence.getKeys("Grid:*")
                .then((keys) => {

                    const out: CellObject[] = [];

                    for (let k of Object.keys(keys)) {

                        try {
                            out.push(new CellObject(decomposeKey(k).id,
                                <ICellObject>keys[k]));
                        } catch (error) {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting list of type ${type}`, error));
                        }

                    }

                    resolve(out);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting list of type ${type}`, error));

                });

            } else if (type === "PgConnection") {

                this._persistence.getKeys("PgConnection:*")
                .then((keys) => {

                    const out: CellObject[] = [];

                    for (let k of Object.keys(keys)) {

                        try {
                            out.push(new CellObject(decomposeKey(k).id,
                                <ICellObject>keys[k]));
                        } catch (error) {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting list of type ${type}`, error));
                        }

                    }

                    resolve(out);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting list of type ${type}`, error));

                });

            } else if (type === "Catalog") {

                this._persistence.getKeys("Catalog:*")
                .then((keys) => {

                    const out: CellObject[] = [];

                    for (let k of Object.keys(keys)) {

                        try {
                            out.push(new CellObject(decomposeKey(k).id,
                                <ICellObject>keys[k]));
                        } catch (error) {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting list of type ${type}`, error));
                        }

                    }

                    resolve(out);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting list of type ${type}`, error));

                });

            } else if (type === "Variable") {

                this._persistence.getKeys("Variable:*")
                .then((keys) => {

                    const out: any[] = [];

                    for (let k of Object.keys(keys)) {

                        const id: string = decomposeKey(k).id;

                        out.push({
                            id: id,
                            description: keys[k].description,
                            longdescription: keys[k].longdescription,
                            name: keys[k].name,
                            minihash: keys[k].minihash
                        });

                    }

                    resolve(out);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting list of type ${type}`, error));

                });

            } else if (type === "GridderJob") {

                this._persistence.getKeys("GridderJob:*")
                .then((keys) => {

                    const out: CellObject[] = [];

                    for (let k of Object.keys(keys)) {

                        try {
                            out.push(new CellObject(decomposeKey(k).id,
                                <ICellObject>keys[k]));
                        } catch (error) {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting list of type ${type}`, error));
                        }

                    }

                    resolve(out);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting list of type ${type}`, error));

                });

            } else {

                reject(new CellError(ECellErrorCode.CLASSERROR, `Type ${type} does not exists`));

            }

        });

    }


    // Gets a CellObject

    public get(type: string, id: string): Promise<CellObject> {

        return new Promise<CellObject>((resolve, reject) => {

            if (type === "Grid") {

                this._persistence.get(`${type}:${id}`)
                .then((init) => {

                    try {

                        const grid: Grid = new Grid(id, <IGrid>init);

                        resolve(grid);

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error getting Grid ${id}`, error));

                    }
                })
                .catch((error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting Grid ${id}`, error));
                });

            } else if (type === "PgConnection") {

                this._persistence.get(`${type}:${id}`)
                .then((init) => {

                    try {

                        const pgConnection: PgConnection =
                            new PgConnection(id, <IPgConnection>init);

                        resolve(pgConnection);

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error getting PgConnection ${id}`, error));

                    }
                })
                .catch((error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting PgConnection ${id}`, error));
                });

            } else if (type === "Catalog") {

                this._persistence.get(`${type}:${id}`)
                .then((init) => {

                    try {

                        const catalog: Catalog =
                            new Catalog(id, <ICatalog>init);

                        this.get("PgConnection", catalog.pgConnectionId)
                        .then((pgConnection: PgConnection) => {

                            catalog.pgConnection = pgConnection;

                            resolve(catalog);

                        })
                        .catch((error) => {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting PgConnection ${catalog.pgConnectionId} while initializing Catalog ${catalog.id}`,
                                error));
                        });

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error getting Catalog ${id}`, error));

                    }
                })
                .catch((error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting Catalog ${id}`, error));
                });

            } else if (type === "Variable") {

                this._persistence.get(`${type}:${id}`)
                .then((init) => {

                    try {

                        const variable: Variable =
                            new Variable(id, <IVariable>init);

                        this.get("PgConnection", variable.pgConnectionId)
                        .then((pgConnection: PgConnection) => {

                            variable.pgConnection = pgConnection;

                            resolve(variable);

                        })
                        .catch((error) => {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting PgConnection ${variable.pgConnectionId} while initializing Variable ${variable.id}`,
                                error));
                        });

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error getting Variable ${id}`, error));

                    }
                })
                .catch((error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting Variable ${id}`, error));
                });

            } else if (type === "GridderJob") {

                this._persistence.get(`${type}:${id}`)
                .then((init) => {

                    try {

                        const gridderJob: GridderJob =
                            new GridderJob(id, <IGridderJob>init);

                        this.get("Grid", (<IGridderJob>init).gridid)
                        .then((grid: Grid) => {

                            gridderJob.grid = grid;

                            return this.get("Variable", (<IGridderJob>init).variableid);

                        })
                        .then((variable: Variable) => {

                            gridderJob.variable = variable;

                            resolve(gridderJob);

                        })
                        .catch((error) => {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error getting Grid ${gridderJob.gridId} or Variable ${gridderJob.variableId} while initializing ` +
                                `GridderJob ${id}`,
                                error));
                        });


                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error getting GridderJob ${id}`, error));

                    }
                })
                .catch((error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error getting GridderJob ${id}`, error));
                });

            } else if (type === "GridderSubJob") {

                this._persistence.get(`${type}:${id}`)
                .then((init) => {

                    try {

                        const gsjInit = <IGridderSubJob>init;

                        const gridderSubJob: GridderSubJob =
                            new GridderSubJob(id, gsjInit);

                        this.get("GridderJob", gsjInit.gridderjobid)
                        .then((gridderJob: GridderJob) => {

                            gridderSubJob.gridderJob = gridderJob;

                            return this.get("Grid", gsjInit.cell.gridid);

                        })
                        .then((grid: Grid) => {

                            const cell: Cell = new Cell(
                                grid, gsjInit.cell.zoom, gsjInit.cell.x,
                                gsjInit.cell.y, gsjInit.cell.data);

                            gridderSubJob.cell = cell;

                            return this._persistence.set(gridderSubJob.key, gridderSubJob.persist);

                        })
                        .then((success) => {

                            resolve(gridderSubJob);

                        })
                        .catch((error) => {
                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `LibCellFactory: Error getting GridderSubJob ${id}`, error));
                        });

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `LibCellFactory: Error getting GridderSubJob ${id}`, error));

                    }
                })
                .catch((error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `LibCellFactory: Error getting GridderSubJob ${id}`, error));
                });

            } else {

                reject(new CellError(ECellErrorCode.CLASSERROR, `LibCellFactory: Type ${type} does not exists`));

            }

        });

    }


    // Deletes a CellObject

    public del(type: string, id: string): Promise<CellObject> {

        return new Promise<CellObject>((resolve, reject) => {

            const key: string = `${type}:${id}`;

            if (type === "Grid") {

                let grid: Grid;

                this._persistence.get(key)
                .then((init) => {

                    try {

                        grid = new Grid(id, <IGrid>init);

                        return this._persistence.del(key);

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error deleting Grid ${id}`, error));

                    }
                })
                .then((result) => {

                    if (result) { resolve(grid); }

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error deleting Grid ${id}`, error));

                });

            } else if (type === "GridderSubJob") {

                let gridderSubJob: GridderSubJob;

                this._persistence.get(key)
                .then((init) => {

                    try {

                        gridderSubJob = new GridderSubJob(id, <IGridderSubJob>init);

                        return this._persistence.del(key);

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error deleting GridderSubJob ${id}`, error));

                    }
                })
                .then((result) => {

                    if (result) { resolve(gridderSubJob); }

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error deleting GridderSubJob ${id}`, error));

                });


            
            // Delete a variable

            } else if (type === "Variable") {

                let variable: Variable;

                // Get the variable

                this._persistence.get(key)
                .then((init) => {

                    try {

                        variable = new Variable(id, <IVariable>init);

                        this._persistence.del(key);

                        resolve(variable);

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error deleting Variable ${id}`, error));

                    }

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error deleting Variable ${id}`, error));

                });



            // Delete GridderJob

            } else if (type === "GridderJob") {

                let gridderJob: GridderJob;

                // Get the job

                this._persistence.get(key)
                .then((init) => {

                    // Initialize it and delete

                    try {

                        gridderJob = new GridderJob(id, <IGridderJob>init);

                        return this._persistence.del(key);

                    } catch (error) {

                        reject(new CellError(ECellErrorCode.DATAERROR,
                            `Error deleting GridderJob ${id}`, error));

                    }
                })
                .then((result) => {

                    // Delete worker queue

                    return this._persistence.redisDel(`workers:gridderjob:${gridderJob.id}`);

                })
                .then((result) => {

                    // Delete Redis stats, get keys

                    return this._persistence.redisKeys(`gridderjobstats:${gridderJob.id}*`);

                })
                .then((keys: string[]) => {

                    // Delete at Redis

                    for (let k of keys) {

                        this._persistence.redisDel(k);

                    }

                    // Delete stalled GridderSubJobs

                    let sql: string = `
                    select id
                    from meta.celldsobject
                    where (cell__cellobjectid(id)).type = 'GridderSubJob' and
                    initialization ->> 'gridderjobid' = $1;`;

                    return this._persistence.pgExecuteParamQuery(sql, [ gridderJob.id ]);

                })
                .then((keys) => {

                    // Delete GridderSubJobs, if any

                    for (let k of keys.rows) {
                        
                        this._persistence.del(k.id);

                    }

                    // Delete stalled Redis datapackages

                    return this._persistence.redisKeys(`geoms:${gridderJob.id}:*`);
                    
                })
                .then((keys) => {

                    for (let k of keys) {

                        this._persistence.redisDel(k);

                    }

                    // Clean stalled GridderSubJobs at Redis (some aren't uploaded to the PG)

                    return this._persistence.redisKeys("GridderSubJob:*");

                })
                .then((keys) => {

                    for (let k of keys) {

                        this._persistence.redisGet(k)
                        .then((gsj) => {

                            if (gsj.gridderjobid === gridderJob.id) {

                                this._persistence.redisDel(k);

                            }

                        })
                        .catch((error) => {

                            reject(new CellError(ECellErrorCode.DATAERROR,
                                `Error deleting GridderSubJob ${k} at Redis`,
                                error));

                        })

                    }
            
                    resolve(gridderJob);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error deleting GridderSubJob ${id}`, error));

                });

            } else {

                reject(new CellError(ECellErrorCode.CLASSERROR, `Type ${type} does not exists`));

            }

        });

    }


    /*

        Gets a set of keys of the same type

        getSet("GridderSubJob", [key0, key1, key2])

    */

    public getSet(type: string, keys: string[]): Promise<CellObject[]> {

        return new Promise<CellObject[]>((resolve, reject) => {

            const promises: Promise<CellObject>[] = [];

            for (let i of keys) {
                promises.push(this.get(type, i));
            }

            Promise.all(promises)
            .then((values) => {

                resolve(values);

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error getting set of ${type}`, error));

            });

        });

    }


    /*

        Gets a hash map of keys of the same type

        getSetHash("GridderSubJob", [key0, key1, key2])

        type: string: Type of Cell object to retrieve

        keys: string[]: Keys to retrieve

        returns: { [key: string]: CellObject }: a hash map with the CellObjects
        asked hashed by the key

    */

    public getSetHash(type: string, keys: string[]): 
        Promise<{ [ key: string ]: CellObject }> {

        return new Promise<{ [ key: string]: CellObject }>((resolve, reject) => {

            // The output object

            let out: { [ key: string ]: CellObject } = {};

            // A set of promises

            const promises: Promise<CellObject>[] = [];

            // Construct individual promises

            for (let i of keys) {
                promises.push(this.get(type, i));
            }

            // Wait until all promises are fullfilled

            Promise.all(promises)
            .then((values) => {

                // Build the hash map

                for (let v of values) {

                    out[v.id] = v;

                }

                // Deliver

                resolve(out);

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error getting set of ${type}`, error));

            });

        });

    }



    /*

        Pass a param query to the underlying PostGIS service

    */

    public pgExecuteParamQuery(query: string, params: any[]): Promise<QueryResult> {

        return this._persistence.pgExecuteParamQuery(query, params);

    }



    /*

        Pass a query to the underlying PostGIS service

    */

    public pgExecuteQuery(query: string): Promise<QueryResult> {

        return this._persistence.pgExecuteQuery(query);

    }

    /*

        Gets GridderSubJobs for a GridderJob

    */

    public getGridderJobSubJobs(id: string): Promise<GridderSubJob[]> {

        return new Promise((resolve, reject) => {

            const sql: string = `
                select *
                from meta.celldsobject
                where
                    (cell__cellobjectid(id)).type = 'GridderSubJob' and
                    initialization ->> 'gridderjobid' = $1;
            `;

            let out: string[];

            this.pgExecuteParamQuery(sql, [ id ])
            .then((results: QueryResult) => {
                out = results.rows.map(r => { return decomposeKey(r.id).id; });

                return this.getSet("GridderSubJob", out);
            })
            .then(gsj => {

                resolve(<GridderSubJob[]>gsj);

            })
            .catch(error => {
                reject(new CellError(ECellErrorCode.DATAERROR, `Error getting GridderSubJobs for GridderJob ${id}`, error));
            });
        });

    }



    /*

        Gets a hashmap from the underlying Redis

    */

    public getRedisHashMap(key: string): Promise<any> {

        return this._persistence.redisHGETALL(key);

    }


    /*

        Gets keys from the underlying Redis

    */

    public getRedisKeys(keyPattern: string): Promise<string[]> {

        return this._persistence.redisKeys(keyPattern);

    }


    /*

        Private members

    */

    /*

        Returns a new minihash for a new variable

    */

    private _getMinihash(cellObject: Variable):
    Promise<string> {

        return new Promise<string>((resolve, reject) => {

            // Check if object already has a mini hash
            this.get(cellObject.type, cellObject.id)
            .then((object: Variable) => {

                resolve(object.miniHash);

            })
           .catch((error) => {

                const sql: string = `
                    with a as (
                        select
                            initialization ->> 'minihash' as minihash
                        from
                            meta.celldsobject
                        where
                            (cell__cellobjectid(id)).type = 'Variable'
                    )
                    select array_agg(minihash) as minihashes
                    from a where minihash is not null
                `;

                this._persistence.pgExecuteQuery(sql)
                .then((result: QueryResult) => {

                    const hash = getHash(JSON.stringify(cellObject.persist));
                    const miniHash = getMiniHash(hash, result.rows[0].minihashes);
                    resolve(miniHash);

                })
                .catch((error: Error) => {
                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error minihashing ${cellObject.key}`, error));
                });

            })
            .catch((error: Error) => {
                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error minihashing ${cellObject.key}`, error));
            });

        });

    }

}