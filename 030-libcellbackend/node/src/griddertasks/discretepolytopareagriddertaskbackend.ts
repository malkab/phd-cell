import { GridderTasks as GT } from "libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyTopAreaGridderTaskBackend extends GT.DiscretePolyTopAreaGridderTask  implements PgOrm.IPgOrm<DiscretePolyTopAreaGridderTaskBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTaskBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTaskBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyTopAreaGridderTaskBackend> = (pg) => rx.of();

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      pgConnectionId,
      sourceTable,
      discreteFields,
      geomField,
      nameTemplate,
      descriptionTemplate
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      discreteFields: string[];
      geomField: string;
      nameTemplate: string;
      descriptionTemplate: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      name: name,
      description: description,
      pgConnectionId: pgConnectionId,
      sourceTable: sourceTable,
      descriptionTemplate: descriptionTemplate,
      nameTemplate: nameTemplate,
      discreteFields: discreteFields,
      geomField: geomField
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        params: () => [ this.gridderTaskId, this.gridderTaskType, this.name,
          this.description, this.pgConnectionId, this.sourceTable,
          this.nameTemplate,
          this.descriptionTemplate, { discreteFields: this.discreteFields } ]
        }

      })

  }

}