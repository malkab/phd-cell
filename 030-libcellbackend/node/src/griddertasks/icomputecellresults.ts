import { ICell } from "../core/icell";

/**
 *
 * An interface to store the results of the computeCell$ for gridders, basicly
 * a cell result and a set of child cells to further the gridder task.
 *
 */
export interface IComputeCellResults {

  computedCell: ICell;

  childCells: ICell[];

}
