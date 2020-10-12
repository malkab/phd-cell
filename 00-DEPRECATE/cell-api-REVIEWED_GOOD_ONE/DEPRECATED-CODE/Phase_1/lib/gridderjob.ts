/*

    Gridder Job class

*/

import { IBbox, Bbox } from "./bbox";
import { Variable } from "./variable";
import { Grid } from "./grid";
import { Cell } from "./cell";
import { mainStatus } from "./controllermessage";
import { CellDS, ICellDSObjectDefinition, cellDSObjectTypes } from "./cellds";
import { CellDSObject } from "./celldsobject";
import { GridderSubJob, IGridderSubJob } from "./griddersubjob";



/*

    Definition interface

*/

export interface IGridderJob extends ICellDSObjectDefinition {
    params: {
        jobType: "GridderJob";
        jobParams: {
            grid: string;
            zoomlevels: number[];
            variable: string;
            dirtyarea: IBbox;
        }
    };
}



/*

    Class

*/

export class GridderJob extends CellDSObject {

    /*

        Members

    */

    // Grid
    private _grid: Grid;

    // Zoom levels
    private _zoomLevels: number[];

    // Variable
    private _variable: Variable;

    // Dirty area
    private _dirtyArea: Bbox;


    /*

        Getters & Setters

    */

    // Grid
    get grid(): Grid {
        return this._grid;
    }


    /*

        Main constructor

    */

    constructor(parentCellDS: CellDS) {
        super(parentCellDS);
        this.type = cellDSObjectTypes.GridderJob;
    }


    /*

        Constructor from definition

    */

    public async definitionInit(definition: IGridderJob): Promise<GridderJob> {

        return new Promise<GridderJob>((resolve, reject) => {

            super.definitionInit(definition)
            .then((success: CellDSObject) => {

                this._zoomLevels = definition.params.jobParams.zoomlevels;
                this._dirtyArea = new Bbox(definition.params.jobParams.dirtyarea);
                this._grid = new Grid(this.parentCellDS);
                return this._grid.dbInit(definition.params.jobParams.grid);

            })
            .then((grid: Grid) => {

                this._variable = new Variable(this.parentCellDS);
                return this._variable.dbInit(definition.params.jobParams.variable);

            })
            .then((variable: Variable) => {
                resolve(this);
            })
            .catch((error: any) => {
                reject(error);
            });

        });

    }


    /*

        Write to CellDS

    */

    public async writeToCellDS(): Promise<GridderJob> {

        return new Promise<GridderJob>((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                insert into gridderjobs.job
                values ($1, $2, $3, $4,
                    st_setsrid(st_geomfromgeojson($5)::geometry, $6::integer)
                )`,
                [ this.hash, this.name, this.description,
                  this.creationParams.params, this._dirtyArea.pggeojson,
                  this._grid.epsg
                ]
            )
            .then((success) => { this.log(mainStatus.Created); })
            .then((success) => { resolve(this); })
            .catch((error) => { reject(error); });

        });

    }


    /*

        Initialization from database

    */

    public async dbInit(hash: string): Promise<GridderJob> {

        return new Promise<GridderJob>((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                select
                    *
                from gridderjobs.job
                where hash=$1`,
                [ hash ])
            .then((result) => {

                if (result.rowCount === 0) {
                    reject(new Error(`Job ${hash} not found at CellDS`));
                }

                const data = result.rows[0];

                const def: IGridderJob = {
                    description: data.description,
                    name: data.name,
                    params: data.params
                };

                this.definitionInit(def)
                .then((success) => {
                    this.hash = hash;
                    resolve(this);
                })
                .catch((error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Starts the job by creating the first subjobs

    */

    public async start(): Promise<GridderJob> {

        return new Promise<GridderJob> ((resolve, reject) => {

            // Find colliding cells and create subjobs

            const cells: Cell[] = this._grid.getBboxCellCoverage(this._dirtyArea, this._zoomLevels[0]);

            for (let c of cells) {

                const sjob = new GridderSubJob(this.parentCellDS);

                const isjob: IGridderSubJob = {
                    description: `Job: ${this.hash}, Cell: (${c.definition.zoom}, ${c.definition.x}, ${c.definition.y})`,
                    name: "GridderSubjob",
                    params: {
                        subjobtype: "GridderSubJob",
                        subjobparams: {
                            cell: c.definition,
                        },
                        job: this.hash
                    }
                };

                sjob.definitionInit(isjob)
                .then((success) => {
                    return this.grid.writeToRedis();
                })
                .then((success) => {
                    return this.writeToRedis();
                })
                .then((grid) => {
                    return this._variable.writeToRedis();
                })
                .then((subjob) => {
                    return sjob.writeToCellDS();
                })
                .then((subjob) => {
                    return sjob.writeToRedis();
                })
                .then((subjob) => {
                    return sjob.publishToRedis();
                })
                .then((success) => {
                    return this.log(mainStatus.Started);
                })
                .then((success) => {
                    resolve(this); })
                .catch((error) => {
                    reject(error); });
            }

        });

    }


    /*

        Logs status

    */

   public async log(status: mainStatus): Promise<mainStatus> {

    return new Promise<mainStatus> ((resolve, reject) => {

        this.parentCellDS.postgis.executeParamQuery(`
            select cell__gridderjoblog($1, $2)`,
            [ this.hash, status ]
        )
        .then((result) => { resolve(status); })
        .catch((error) => { reject(error); });

    });

}

}