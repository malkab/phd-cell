import { DiscretePolyAreaSummaryGridderTask } from './discretepolyareasummarygriddertask';

import { DiscretePolyTopAreaGridderTask } from './discretepolytopareagriddertask';

import { PointAggregationsGridderTask } from './pointaggregationsgriddertask';

import { MdtProcessingGridderTask } from './mdtprocessinggriddertask';

import { PointIdwGridderTask } from './pointidwgriddertask';

import { RxPg, PgOrm } from '@malkab/rxpg';

import { EGRIDDERTASKTYPE } from "./egriddertasktype";

import { GridderTask } from "./griddertask";

import * as rx from "rxjs";

/**
 *
 * Factory for creating GridderTasks specialized classes.
 *
 */
export function gridderTaskFactory$(params: any): rx.Observable<
  DiscretePolyAreaSummaryGridderTask |
  DiscretePolyTopAreaGridderTask |
  PointAggregationsGridderTask |
  PointIdwGridderTask |
  MdtProcessingGridderTask
> {

  if (params.gridderTaskType === EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY) {

    return rx.of(new DiscretePolyAreaSummaryGridderTask({ ...params }));

  };

  if (params.gridderTaskType === EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA) {

    return rx.of(new DiscretePolyTopAreaGridderTask({ ...params }));

  }

  if (params.gridderTaskType === EGRIDDERTASKTYPE.POINTAGGREGATIONS) {

    return rx.of(new PointAggregationsGridderTask({ ...params }));

  }

  if (params.gridderTaskType === EGRIDDERTASKTYPE.POINTIDWINTERPOLATION) {

    return rx.of(new PointIdwGridderTask({ ...params }));

  }

  if (params.gridderTaskType === EGRIDDERTASKTYPE.MDTPROCESSING) {

    return rx.of(new MdtProcessingGridderTask({ ...params }));

  }

  throw new Error(`unknown GridderTask type ${params.gridderTaskType}`);

}

/**
 *
 * Gets a GridderTask by ID.
 *
 */
export function gridderTaskGet$(pg: RxPg, gridderTaskId: string): rx.Observable<any> {

  return PgOrm.select$<GridderTask>({
    pg: pg,
    sql: `
      select
        gridder_task_id as "gridderTaskId",
        gridder_task_type as "gridderTaskType",
        name,
        description,
        source_table as "sourceTable",
        geom_field as "geomField",
        additional_params as "additionalParams",
        index_variable_key as "indexVariableKey"
      from cell_meta.gridder_task where gridder_task_id = $1;`,
    params: () => [ gridderTaskId ],
    type: GridderTask,
    newFunction$: (params: any) =>
      gridderTaskFactory$({
        ...params,
        ...params.additionalParams
      })

  })

}
