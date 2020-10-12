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
    cell: ICell;
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


    /*

        Getters and setters

    */

    get persist(): IGridderSubJob {

        const base: ICellObject = super.persist;

        (<IGridderSubJob>base).gridderjobid = this._gridderJob.id;

        (<IGridderSubJob>base).cell = this._cell.persist;

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



    /*

        Constructor

    */

    constructor(id: string, init: IGridderSubJob) {

        super(id, init);

        this._type = "GridderSubJob";

        this._gridderJobId = init.gridderjobid;

        this._iCell = init.cell;

    }

}
