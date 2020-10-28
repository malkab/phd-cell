import { DiscretePolyAreaSummaryGridderTaskBackend } from './discretepolyareasummarygriddertaskbackend';

import { DiscretePolyTopAreaGridderTaskBackend } from './discretepolytopareagriddertaskbackend';

import { GridderTasks as gt } from 'libcell';

import { RxPg, PgOrm } from '@malkab/rxpg';

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { GridderTask } from 'libcell/dist/griddertasks';

import { PgConnection } from '../core/pgconnection';

/**
 *
 * Factory for creating GridderTasks specialized classes.
 *
 */
export function gridderTaskFactory(pg: RxPg, params: any): rx.Observable<
DiscretePolyAreaSummaryGridderTaskBackend |
DiscretePolyTopAreaGridderTaskBackend> {

  if (params.gridderTaskType === gt.EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY) {

    return PgConnection.get$(pg, params.pgConnectionId)
    .pipe(

      rxo.map((pg: PgConnection) => {

        return new DiscretePolyAreaSummaryGridderTaskBackend({
          ...params,
          pgConnection: pg
        });

      })

    )

  };

  if (params.gridderTaskType === gt.EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA) {

    return PgConnection.get$(pg, params.pgConnectionId)
    .pipe(

      rxo.map((pg: PgConnection) => {

        return new DiscretePolyTopAreaGridderTaskBackend({
          ...params,
          pgConnection: pg
        });

      })

    )

  }

  throw new Error(`unknown GridderTask type ${params.gridderTaskType}`);

}

export function get$(pg: RxPg, id: string): rx.Observable<any> {

  return PgOrm.select$<gt.GridderTask>({
    pg: pg,
    sql: `
      select
        gridder_task_id as "gridderTaskId",
        gridder_task_type as "gridderTaskType",
        name,
        description,
        pg_connection_id as "pgConnectionId",
        source_table as "sourceTable",
        name_template as "nameTemplate",
        description_template as "descriptionTemplate",
        geom_field as "geomField",
        additional_params as "additionalParams"
      from cell_meta.gridder_task where gridder_task_id = $1;`,
    params: () => [ id ],
    type: gt.GridderTask,
    newFunction: (params: any) =>
      gridderTaskFactory(pg, {
        ...params,
        ...params.additionalParams
      })

  })

}
