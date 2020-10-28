import { GridderTasks as GT } from "libcell";

import { PgOrm } from "@malkab/rxpg"

import { RxPg, QueryResult } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { CellBackend } from "../core/cellbackend";

import { PgConnection } from 'src/core/pgconnection';

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
      pgConnection = undefined,
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
      pgConnection?: PgConnection;
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
      pgConnection: pgConnection,
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
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        params: () => [ this.gridderTaskId, this.gridderTaskType, this.name,
          this.description, this.pgConnectionId, this.sourceTable,
          this.nameTemplate,
          this.descriptionTemplate, this.geomField,
          { discreteFields: this.discreteFields } ]
        }

      })

  }

  /**
   *
   * Apply the gridder task to a cell.
   *
   */
  public computeCell(cell: CellBackend): rx.Observable<any> {

    this.pgConnection?.open();

    // Take geometries colliding with the cell
    let sqlDebug: string = `
      create table test.y0 as
      with a as (
        select
          ${this.discreteFields.join(",")},
          ${this.geomField} as geom,
          st_intersection(${this.geomField}, st_geomfromewkt('${cell.ewkt}')) as geom_inter,
          st_area(st_intersection(${this.geomField}, st_geomfromewkt('${cell.ewkt}'))) as a
        from ${this.sourceTable}
        where st_intersects(${this.geomField}, st_geomfromewkt('${cell.ewkt}'))
      )
      select
        ${this.discreteFields.join(",")},
        st_union(geom) as geom,
        st_union(geom_inter) as geom_inter,
        sum(a) as a
      from a
      group by ${this.discreteFields.join(",")}
      order by a desc
      limit 1;
    `;

    console.log("D: nnnnn", sqlDebug);

    let sql: string = `
      with a as (
        select
          ${this.discreteFields.join(",")},
          ${this.geomField} as geom,
          st_intersection(${this.geomField}, st_geomfromewkt('${cell.ewkt}')) as geom_inter,
          st_area(st_intersection(${this.geomField}, st_geomfromewkt('${cell.ewkt}'))) as a
        from ${this.sourceTable}
        where st_intersects(${this.geomField}, st_geomfromewkt('${cell.ewkt}'))
      )
      select
        ${this.discreteFields.join(",")},
        sum(a) as a
      from a
      group by ${this.discreteFields.join(",")}
      order by a desc
      limit 1;
    `;

    if (this.pgConnection) {

      if (this.pgConnection.conn) {

        return this.pgConnection?.conn?.executeQuery$(sqlDebug)
        .pipe(

          rxo.map((o: QueryResult) => {

            console.log("D: jjjee", o);

            return o;

          })

        );

      } else {

        throw new Error("Cannot open PgConnection");

      }

    } else {

      throw new Error("Cannot open PgConnection");

    }

  }

}
