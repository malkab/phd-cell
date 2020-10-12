/*

    GridderSubJob object.

*/

import { CellObject, ICellObject } from "./cellobject";
import { Cell, ICell } from "./cell";
import { IPersistable } from "./ipersistable";
import { GridderJob } from "./gridderjob";


/*

    GridderSubJob API definition interface

*/

export interface IGridderSubJob extends ICellObject {
    gridderjobid: string;
    processingtype: EGridderSubJobProcessingType;
    cell: ICell;
    data: string;
}


/*

    GridderSubJob type: 

        INMEMORY: In memory processing, no Redis
        REDIS: comes from Redis

    This is important because GSJ coming from INMEMORY doesn't need
    to be deleted when processed

*/

export enum EGridderSubJobProcessingType {

    INMEMORY = 0,
    REDIS

}



/*

    GridderJob class

*/

export class GridderSubJob extends CellObject implements IPersistable {

    /*

        Private members

    */

    // The GridderJob ID
    private _gridderJobId: string;

    // The cell definition
    private _iCell: ICell;

    // The cell
    private _cell: Cell;

    // The GridderJob
    private _gridderJob: GridderJob;

    // The data

    private _data: any;

    // GridderSubJob type

    private _processingType: EGridderSubJobProcessingType;


    /*

        Getters and setters

    */

    get persist(): IGridderSubJob {

        const base: ICellObject = super.persist;

        (<IGridderSubJob>base).gridderjobid = this._gridderJob.id;

        (<IGridderSubJob>base).cell = this._cell.persist;

        (<IGridderSubJob>base).data = JSON.stringify(this._data);

        (<IGridderSubJob>base).processingtype = this._processingType;

        return <IGridderSubJob>base;

    }

    get gridderJobId(): string {
        return this._gridderJobId;
    }

    get gridderJob(): GridderJob {
        return this._gridderJob;
    }

    set gridderJob(gj: GridderJob) {
        this._gridderJob = gj;
        this._cell = new Cell(this._gridderJob.grid,
            this._iCell.zoom, this._iCell.x, this._iCell.y, null);
    }

    get cell(): Cell {
        return this._cell;
    }

    set cell(cell: Cell) {
        this._cell = cell;
    }

    get data(): any {

        return this._data;

    }

    set data(data: any) {

        this._data = data;

    }

    get processingType(): EGridderSubJobProcessingType {

        return this._processingType;

    }

    set processingType(type: EGridderSubJobProcessingType) {

        this._processingType = type;

    }





    /*

        Constructor

    */

    constructor(id: string, init: IGridderSubJob) {

        super(id, init);

        this._type = "GridderSubJob";

        this._gridderJobId = init.gridderjobid;

        this._iCell = init.cell;

        this._data = JSON.parse(init.data);

        this._processingType = init.processingtype;

    }

}
