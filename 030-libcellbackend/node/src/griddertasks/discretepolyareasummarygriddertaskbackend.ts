import { GridderTasks as GT } from "libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { PgConnection } from 'src/core/pgconnection';

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyAreaSummaryGridderTaskBackend extends GT.DiscretePolyAreaSummaryGridderTask implements PgOrm.IPgOrm<DiscretePolyAreaSummaryGridderTaskBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTaskBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTaskBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTaskBackend> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      sourceTable,
      geomField,
      discreteFields,
      variableNameTemplate,
      variableDescriptionTemplate
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      discreteFields: string[];
      variableNameTemplate: string;
      variableDescriptionTemplate: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      discreteFields: discreteFields,
      variableNameTemplate: variableNameTemplate,
      variableDescriptionTemplate: variableDescriptionTemplate
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7);`,
        params: () => [
          this.gridderTaskId,
          this.gridderTaskType,
          this.name,
          this.description,
          this.sourceTable,
          this.geomField,
          {
            discreteFields: this.discreteFields,
            variableNameTemplate: this.variableNameTemplate,
            variableDescriptionTemplate: this.variableDescriptionTemplate
          }
        ]
      }

    })

  }

}
