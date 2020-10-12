/*

    CellGridderController main class

*/

import { CellRabbit } from "./rabbit";
import { Job, IJob, JobStatus } from "./job";
// import { GridJsonDefinition, Grid } from "./grid";
import { Grid } from "./grid";
// import { Coordinate } from "./coordinate";
// import { Bbox } from "./bbox";
import { IPostGIS, PostGIS } from "./postgis";
import { DBConnections } from "./dbconnections";
import { IOutput } from "./ioutput";



// CellGridderController main class

export class CellGridderController {

    // Members

    private _rabbit: CellRabbit;
    private _sqlScriptsPath: string;
    private _rabbitUrl: string;
    private _dbStatusName: string;
    private _dbStatusDdlScript: string;
    private _dbCellDsDdlScript: string;
    private _activeJobs: Job[];
    private _grids: Grid[];
    private _postgisConnections: DBConnections;
    private _dbStatusHash: string;
    private _dbStatusPostGIS: PostGIS;
    private _dbStatusAdminHash: string;
    private _dbStatusAdminPostGIS: PostGIS;
    private _defaultPoolSize: number;
    private _dbStatusConnectionConfig: IPostGIS;


    // Constructor
    constructor(sqlScriptsPath: string, rabbitUrl: string,
        dbStatusName: string, poolSize: number,
        dbStatusDdlScript: string, dbCellDsDdlScript: string,
        dbStatusConfig: IPostGIS) {

        this._sqlScriptsPath = sqlScriptsPath;
        this._rabbitUrl = rabbitUrl;
        this._dbStatusName = dbStatusName;
        this._dbStatusDdlScript = dbStatusDdlScript;
        this._activeJobs = [];
        this._grids = [];
        this._dbCellDsDdlScript = dbCellDsDdlScript;
        this._postgisConnections = new DBConnections();
        this._defaultPoolSize = poolSize;

        // Creation of the connection to the admin status database
        this._dbStatusAdminHash =
            this._postgisConnections.createNewConnection(dbStatusConfig);

        this._dbStatusAdminPostGIS =
            this._postgisConnections.getConnectionByHash(this._dbStatusAdminHash);

        // Initialize admin pool
        this._dbStatusAdminPostGIS.initPool(1);

        // Store future DBStatus connection config for future initialization
        dbStatusConfig.database = this._dbStatusName;
        this._dbStatusConnectionConfig = dbStatusConfig;

    }


    // Initializes connection to DBStatus
    private initializeDbStatus(): PostGIS {

        this._dbStatusHash =
            this._postgisConnections.createNewConnection
                (this._dbStatusConnectionConfig);

        this._dbStatusPostGIS =
            this._postgisConnections.getConnectionByHash(this._dbStatusHash)
            .initPool(this._defaultPoolSize);

        return this._dbStatusPostGIS;
    }


    // Create DB Status
    public async createDbStatus(): Promise<IOutput> {
        return new Promise<IOutput>((resolve, reject) => {
            this._dbStatusAdminPostGIS.createDatabase(this._dbStatusName)
            .then(res => {
                console.log(`DBStatus database ${this._dbStatusName} created at host ${this._dbStatusAdminPostGIS.host}`);

                return this.initializeDbStatus()
                    .executeScript(this.getSqlScriptPath(this._dbStatusDdlScript));
            })
            .then(res => {
                const msg = `DBStatus database ${this._dbStatusName} successfully initialized at host ${this._dbStatusAdminPostGIS.host}`;

                resolve({
                    code: 0,
                    success: true,
                    description: msg,
                    payload: null
                });
            })
            .catch(error => {
                if (error.routine === "createdb") {
                    // Initialize DBStatus anyway
                    this.initializeDbStatus();

                    resolve({
                        code: 0,
                        success: true,
                        description: `DSStatus database ${this._dbStatusName} already exists at host ${this._dbStatusPostGIS.host}`,
                        payload: null
                    });
                } else {
                    reject({
                        code: 0,
                        success: false,
                        description: `Unexpected error when configuring DBStatus ${this._dbStatusName} at host ${this._dbStatusPostGIS.host}`,
                        payload: error
                    });
                }
            });
        });

    }


    // Construct SQL script paths

    private getSqlScriptPath(scriptFileName: string): string {
        return `${this._sqlScriptsPath}/${scriptFileName}`;
    }


    // Delete DBStatus database

    public deleteDbStatus(): Promise<IOutput> {
        return new Promise<IOutput>((resolve, reject) => {

            this._dbStatusAdminPostGIS.deleteDatabase(this._dbStatusName)
            .then(res => {
                // Clear DBStatus
                this._postgisConnections.dropConnectionByHash(this._dbStatusAdminHash);
                this._dbStatusHash = null;
                this._dbStatusPostGIS = null;

                resolve({
                    code: 0,
                    success: true,
                    description: `DBStatus ${this._dbStatusName} successfully deleted at host ${this._dbStatusConnectionConfig.host}`,
                    payload: null
                });
            })
            .catch(error => {
                reject({
                    code: 1,
                    success: false,
                    description: `Unexpected error deleting DBStatus database ${this._dbStatusName} at host ${this._dbStatusConnectionConfig.host}`,
                    payload: error
                });
            });
        });
    }


    // Publish a job

    public publishJob(iJob: IJob): Promise<IOutput> {
        return new Promise((resolve, reject) => {

            // Create and register job
            const j: Job = new Job(iJob, this._dbStatusPostGIS,
                this._postgisConnections, this._defaultPoolSize);
            j.status = JobStatus.Active;
            this._activeJobs.push(j);

            j.writeToDbStatus()
            .then(res => {
                const msg = `Job ${j.hash} successfully registrated`;

                resolve({
                    code: 0,
                    success: true,
                    description: msg,
                    payload: j.jobDbStatusRecord
                });
            })
            .catch(error => {
                const msg = `Error registering job ${j.hash}`;

                reject({
                    code: 1,
                    success: false,
                    description: msg,
                    payload: error
                });
            });

        });

    }


    // Get jobs

    public getJobs(status?: JobStatus): Promise<IOutput> {
        let q: string = "select * from jobs.job";
        let params: any[] = [];

        if (status !== undefined) {
            q += " where status=$1";
            params = [ status ];
        }

        console.log(q);
        console.log(params);

        return new Promise((resolve, reject) => {
            this._dbStatusPostGIS.executeParamQuery(q, params)
            .then(res => {
                console.log(res);

                resolve({
                    code: 0,
                    success: true,
                    description: `Got jobs with status ${status}`,
                    payload: res.queryResult
                });
            })
            .catch(error => {
                reject({
                    code: 1,
                    success: false,
                    description: `Error getting jobs with status ${status}`,
                    payload: error
                });
            });
        });
    }




           /**
     * TEST ZONE
     */




    // // Create DB Status
    // public createCellDs(dbConfig: PoolConfig,
    //     cellDsName: string): Promise<IOutput> {

    //     return new Promise((resolve, reject) => {

    //         // Connect to admin database
    //         const admindb = new pg.PostGIS();
    //         dbConfig.max = 1;

    //         // First connect to the database in admin mode
    //         admindb.connect(dbConfig)
    //         .then(admindb => {
    //             console.log("Connected to admin db...");

    //             // Create new database
    //             const db = new pg.Database(cellDsName);

    //             return admindb.createDbObject(db);
    //         })
    //         .then(boolean => {
    //             console.log("Created CellDS database...");

    //             admindb.closePool();

    //             const cellDs = new pg.PostGIS();
    //             dbConfig.database = cellDsName;

    //             return cellDs.connect(dbConfig);
    //         })
    //         .then(dbstatus => {
    //             console.log("Connected to CellDS database...");

    //             this._dbStatus = dbstatus;
    //             return dbstatus.executeScript(
    //                 this.getSqlScriptPath(this._dbCellDsDdlScript));
    //         })
    //         .then(boolean => {
    //             console.log("Successfully set up CellDS database...");

    //             resolve({
    //                 code: 0,
    //                 success: true,
    //                 description: `CellDS database ${cellDsName} successfully created at host ${dbConfig.host}`,
    //                 payload: dbConfig
    //             });
    //         })
    //         .catch(error => {
    //             if (error.routine === "createdb") {
    //                 // Initialize DBStatus access nonetheless
    //                 this._dbStatus = new pg.PostGIS();
    //                 this._dbStatus.connect(this._statusDbConfig);

    //                 resolve({
    //                     code: 0,
    //                     success: true,
    //                     description: `CellDS database ${cellDsName} already exists at host ${dbConfig.host}`,
    //                     payload: dbConfig
    //                 });
    //             } else {
    //                 reject({
    //                     code: 1,
    //                     success: false,
    //                     description: `Unexpected error when configuring CellDS ${cellDsName} at host ${dbConfig.host}`,
    //                     payload: error
    //                 });
    //             }
    //         });
    //     });
    // }


    // Create grid

    public createGrid(definition: GridJsonDefinition): Promise<IOutput> {

        return new Promise((resolve, reject) => {
            const grid = new Grid();

            grid.constructFromDefinition(definition);
            this._grids.push(grid);

            const postgis: pg.PostGIS = new pg.PostGIS();
            const dbConfig: DataSource = new DataSource();
            dbConfig.constructFromDefinition(definition.dataSource);

            postgis.connect(dbConfig.getPoolConfig(1))
            .then(postgis => {
                const origin = new Coordinate(+definition.grid.epsg,
                    definition.grid.origin[0],
                    definition.grid.origin[1]);

                const q = `select cell__registergrid($1,
                           st_setsrid(st_geomfromgeojson($2), $3),
                           $4::jsonb);`;

                const v = [ definition.grid.name, origin.pggeojson,
                            definition.grid.epsg,
                            JSON.stringify(definition.grid.zooms) ];

                return postgis.executeParamQuery(q, v);
            })
            .then(res => {
                resolve({
                    code: 0,
                    success: true,
                    description: `Grid ${definition.grid.name} successfully created`,
                    payload: res
                });
            })
            .catch(error => {
                reject({
                    code: 1,
                    success: false,
                    description: `Error creating grid ${definition.grid.name}`,
                    payload: error
                });
            });

        });
    }


    // // Returns a bbox with the envelope of a data set

    // private getDataEnvelope(dataSource: IDataSource): Promise<Bbox> {
    //     return new Promise((resolve, reject) => {
    //         const dbConfig: DataSource = new DataSource();
    //         dbConfig.constructFromDefinition(dataSource);

    //         const db = new pg.PostGIS();
    //         db.connect(dbConfig.getPoolConfig(1))
    //         .then(db => {
    //             const q: string = `
    //                 select
    //                     min(st_xmin(${dataSource.column})) as minx,
    //                     max(st_xmax(${dataSource.column})) as maxx,
    //                     min(st_ymin(${dataSource.column})) as miny,
    //                     max(st_ymax(${dataSource.column})) as maxy,
    //                     min(st_srid(${dataSource.column})) as epsg
    //                 from ${dataSource.table};`;

    //             return db.executeQuery(q);
    //         })
    //         .then(res => {
    //             const data: any = res.rows[0];
    //             const b: Bbox = new Bbox();

    //             b.fromCoordinates(
    //                 data.epsg,
    //                 new Coordinate(data.epsg, data.minx, data.miny),
    //                 new Coordinate(data.epsg, data.maxx, data.maxy)
    //             );

    //             resolve(b);
    //         })
    //         .catch(error => {
    //             throw(error);
    //         });
    //     });
    // }





    // // CONTINUE HERE, geting cells in an area


    // public getCellsInArea(grid: Grid, zoom: number, bbox: Bbox): void {
    //     console.log("AA");
    // }

}