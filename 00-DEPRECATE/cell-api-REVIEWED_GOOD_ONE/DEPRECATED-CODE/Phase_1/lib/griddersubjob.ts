/*

    GridderSubjob class

*/

import { ICellDSObjectDefinition, cellDSObjectTypes, CellDS } from "./cellds";
import { CellDSObject } from "./celldsobject";
import { GridderJob } from "./gridderjob";
import { ICell, Cell } from "./cell";
import { mainStatus, codeStatus } from "./controllermessage";



/*

    Definition interface

*/

export interface IGridderSubJob extends ICellDSObjectDefinition {
    params: {
        job: string;
        subjobtype: "GridderSubJob";
        subjobparams: {
            cell: ICell;
        }
    };
}


/*

    Class

*/

export class GridderSubJob extends CellDSObject {

    /*

        Members

    */

    // Parent job
    private _job: GridderJob;

    // Cell
    private _cell: Cell;


    /*

        Main constructor

    */

    constructor(parentCellDS: CellDS) {
        super(parentCellDS);
        this.type = cellDSObjectTypes.GridderSubJob;
    }


    /*

        Constructor from definition

    */

    public async definitionInit(definition: IGridderSubJob): Promise<GridderSubJob> {

        return new Promise<GridderSubJob>((resolve, reject) => {

            super.definitionInit(definition)
            .then((success: CellDSObject) => {

                this._job = new GridderJob(this.parentCellDS);
                return this._job.dbInit(definition.params.job);

            })
            .then((job: GridderJob) => {

                this._cell = new Cell(this._job.grid, definition.params.subjobparams.cell);

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

    public async writeToCellDS(): Promise<GridderSubJob> {

        return new Promise<GridderSubJob>((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                insert into gridderjobs.subjob
                values ($1, $2, $3, $4, $5,
                    cell__cellgeom(($6, $7, $8, $9, $10, '{}'::jsonb)::cell__cell
                ))`,
                [ this.hash, this.name, this.description, this.creationParams.params,
                  this._job.hash,
                  this._job.grid.hash, this._job.grid.epsg, this._cell.zoom,
                  this._cell.x, this._cell.y
                ]
            )
            .then((success) => { this.log(mainStatus.Created); })
            .then((success) => { resolve(this); })
            .catch((error) => { reject(error); });

        });

    }


    /*

        Publish the subjob to Redis

    */

    public async publishToRedis(): Promise<number> {

        return new Promise<number>((resolve, reject) => {

            this.parentCellDS.parentCellAPI.redis.rpush("GridderQ", `griddersubjob:${this.hash}`)
            .then((success) => {
                return this.log(mainStatus.Started);
            })
            .then((success) => {
                resolve(success);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Logs status

    */

    public async log(status: mainStatus): Promise<mainStatus> {

        return new Promise<mainStatus> ((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                select cell__griddersubjoblog($1, $2)`,
                [ this.hash, status ]
            )
            .then((result) => { resolve(status); })
            .catch((error) => { reject(error); });

        });

    }

}