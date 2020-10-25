import { DiscretePolyAreaSummaryGridderTask } from './discretepolyareasummarygriddertask';
import { DiscretePolyTopAreaGridderTask } from './discretepolytopareagriddertask';
import { EGRIDDERTASKTYPE } from './egriddertasktype';

/**
 *
 * Factory for creating GridderTasks specialized classes.
 *
 */
export function gridderTaskFactory(params: any):
DiscretePolyAreaSummaryGridderTask |
DiscretePolyTopAreaGridderTask {

  if (params.gridderTaskType === EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY) {

    return new DiscretePolyAreaSummaryGridderTask(params);

  };

  if (params.gridderTaskType === EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA) {

    return new DiscretePolyTopAreaGridderTask(params);

  }

  throw new Error(`unknown GridderTask type ${params.gridderTaskType}`);

}
