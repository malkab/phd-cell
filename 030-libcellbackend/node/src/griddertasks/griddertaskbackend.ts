import { GridderTasks as GT } from "libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class GridderTaskBackend extends GT.GridderTask implements PgOrm.IPgOrm<GridderTaskBackend> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<GridderTaskBackend> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<GridderTaskBackend> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<GridderTaskBackend> = (pg) => rx.of();

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
      nameTemplate,
      descriptionTemplate,
      geomField
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      nameTemplate: string;
      descriptionTemplate: string;
      geomField: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      name: name,
      description: description,
      pgConnectionId: pgConnectionId,
      sourceTable: sourceTable,
      nameTemplate: nameTemplate,
      descriptionTemplate: descriptionTemplate,
      geomField: geomField
    });

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        params: () => [ this.gridderTaskId, this.gridderTaskType, this.name,
          this.description, this.pgConnectionId, this.sourceTable,
          this.nameTemplate, this.descriptionTemplate, null ]
      }

    })

  }

}
