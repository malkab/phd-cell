/*

    GridderJob object.

*/

import { CellObject, ICellObject } from "./cellobject";
import { Bbox, IBbox } from "./bbox";
import { Grid } from "./grid";
import { Cell, ICell } from "./cell";
import { Variable } from "./variable";
import { IPersistable } from "./ipersistable";
import { getHash } from "./utils";
import { GridderSubJob, IGridderSubJob, EGridderSubJobProcessingType } from "./griddersubjob";



/*

    GridderJob API definition interface

*/

export interface IGridderJob extends ICellObject {
    gridid: string;
    zoomlevels: number[];
    variableid: string;
    dirtyarea: ICell;
    status?: EGridderJobStatus;
}



/*

    GridderJob general status

*/

export enum EGridderJobStatus {
    UNSTARTED = 0,
    IDLE,
    RUNNING,
    FINISHED
}



/*

    GridderJob class

*/

export class GridderJob extends CellObject implements IPersistable {

    /*

        Private members

    */

    // The grid ID
    private _gridId: string;

    // The grid
    private _grid: Grid;

    // Zoom levels
    private _zoomLevels: number[];

    // Variable ID
    private _variableid: string;

    // Variable
    private _variable: Variable;

    // The definition of the dirty area
    // This has to be stored because at constructor time it's impossible
    // to initialize the dirty area Cell because at this stage the
    // GridderJob's Grid is unset
    private _dirtyAreaDefinition: ICell;

    // Status
    private _status: EGridderJobStatus;


    /*

        Getters and setters

    */

    get persist(): IGridderJob {

        const base: ICellObject = super.persist;

        (<IGridderJob>base).gridid = this._grid.id;

        (<IGridderJob>base).zoomlevels = this._zoomLevels;

        (<IGridderJob>base).variableid = this._variable.id;

        (<IGridderJob>base).dirtyarea = this._dirtyAreaDefinition;

        (<IGridderJob>base).status = this._status;

        return <IGridderJob>base;

    }

    get gridId(): string {
        return this._gridId;
    }

    get variableId(): string {
        return this._variableid;
    }

    get grid(): Grid {
        return this._grid;
    }

    set grid(g: Grid) {
        this._grid = g;
    }

    get variable(): Variable {
        return this._variable;
    }

    set variable(v: Variable) {
        this._variable = v;
    }

    // Can be a BBox or a Cell, resolved here at runtime

    get dirtyArea(): Cell {

        return this._getDirtyArea();

    }

    get zoomLevels(): number[] {
        return this._zoomLevels;
    }

    get status(): EGridderJobStatus {
        return this._status;
    }

    set status(s: EGridderJobStatus) {
        this._status = s;
    }


    /*

        Constructor

    */

    constructor(id: string, init: IGridderJob) {

        super(id, init);

        this._gridId = init.gridid;

        this._zoomLevels = init.zoomlevels;

        this._variableid = init.variableid;

        this._type = "GridderJob";

        // The dirty area cell definition, not instantiable here because
        // the GridderJob Grid object doesn't exist still

        this._dirtyAreaDefinition = init.dirtyarea;

        this._status = init.status;

    }



    /*
    
        Create new GridderSubJob

        Creates a new GridderSubJob from the GridderJob and optionally 
        data.

    */

    public getNewGridderSubJob(cell: Cell, data: any, processingType: EGridderSubJobProcessingType): GridderSubJob {

        // Creation interface

        const init: IGridderSubJob = {
            cell: <ICell>cell.persist,
            processingtype: processingType,
            gridderjobid: this.id,
            data: JSON.stringify(data)
        };

        // Create the GridderSubJob hash id

        const sj: GridderSubJob = new GridderSubJob(
            getHash(`${JSON.stringify(init)}${Date.now()}`),
            init);

        // Set parent GridderJob

        sj.gridderJob = this;

        return sj;

    }






    /*

        Private methods

    */

    /*

        Builds the dirty area

        The dirty area can be supplied in the Gridder Job definition as
        an "any" object that may match an IBbox or ICell definition,
        but that is checked at run time

    */

    private _getDirtyArea(): Cell {

        // Try to cast definition to either IBbox or ICell

        try {

            const cell: Cell = new Cell(
                this._grid,
                this._dirtyAreaDefinition.zoom,
                this._dirtyAreaDefinition.x,
                this._dirtyAreaDefinition.y,
                null
            );

            return cell;

        } catch (e) {

            throw e;

        }

    }

}
