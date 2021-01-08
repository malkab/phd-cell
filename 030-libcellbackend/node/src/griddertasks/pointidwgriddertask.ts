import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import * as rxo from "rxjs/operators";

import { Cell } from "../core/cell";

import { Variable } from "../core/variable";

import { GridderTask } from "./griddertask";

import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { NodeLogger } from "@malkab/node-logger";

import { Grid } from "../core/grid";

import { idw } from "../core/utils";

/**
 *
 * Point interpolation by IDW Gridder Task.
 *
 * This Gridder Task generates an interpolation of a point cloud based on the
 * IDW method.
 *
 * IDW is defined by three params:
 *
 * - **maxDistance**: max distance to look for neighbour points;
 * - **numberOfPoints**: number of neighbour points to take within the nearest
 *   (defaults to 10);
 * - **power**: power the distance influence drops (defaults to 2);
 * - **heightField:** the field containing the height of the points;
 * - **round:** round the final height to this number of decimals.
 *
 * This GridderTask generates a single variable. The name and description for
 * this variable must be provided in the **variableName** and
 * **variableDescription** additional params.
 *
 */
export class PointIdwGridderTask extends GridderTask implements PgOrm.IPgOrm<PointIdwGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<PointIdwGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<PointIdwGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<PointIdwGridderTask> = (pg) => rx.of();

  /**
   *
   * Round decimals.
   *
   */
  private _round: number;
  get round(): number { return this._round }

  /**
   *
   * Height field.
   *
   */
  private _heightField: string;
  get heightField(): string { return this._heightField }

  /**
   *
   * Variable name.
   *
   */
  private _variableName: string;
  get variableName(): string { return this._variableName }

  /**
   *
   * Variable description.
   *
   */
  private _variableDescription: string;
  get variableDescription(): string { return this._variableDescription }

  /**
   *
   * Max distance.
   *
   */
  private _maxDistance: number;
  get maxDistance(): number { return this._maxDistance }

  /**
   *
   * Number of points to take from near ones within the max distance.
   *
   */
  private _numberOfPoints: number;
  get numberOfPoints(): number { return this._numberOfPoints }

  /**
   *
   * Power the distance influence falls.
   *
   */
  private _power: number;
  get power(): number { return this._power }

  /**
   *
   * Constructor.
   *
   * @param __namedParameters
   * GridderTask deconstructed parameters.
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      sourceTable,
      geomField,
      indexVariableKey,
      indexVariable,
      heightField,
      variableName,
      variableDescription,
      maxDistance,
      numberOfPoints = 10,
      power = 2,
      round = 1
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      indexVariableKey?: string;
      indexVariable?: Variable;
      heightField: string,
      variableName: string;
      variableDescription: string;
      maxDistance: number;
      numberOfPoints: number;
      power: number;
      round: number;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      gridderTaskType: EGRIDDERTASKTYPE.POINTIDWINTERPOLATION,
      gridderTaskTypeName: "Interpolation of point cloud by IDW",
      gridderTaskTypeDescription: "Produces an interpolation of a point cloud based on the Inverse Distance Weighting method.",
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      indexVariableKey: indexVariableKey,
      indexVariable: indexVariable
    });

    this._heightField = heightField;
    this._variableName = variableName;
    this._variableDescription = variableDescription;
    this._maxDistance = maxDistance;
    this._numberOfPoints = numberOfPoints;
    this._power = power;
    this._round = round;

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: () => `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7);`,
        params$: () => rx.of([
          this.gridderTaskId,
          this.gridderTaskType,
          this.name,
          this.description,
          this.sourceTable,
          this.geomField,
          {
            heightField: this.heightField,
            variableName: this.variableName,
            variableDescription: this.variableDescription,
            maxDistance: this.maxDistance,
            numberOfPoints: this.numberOfPoints,
            power: this.power
          }
        ])
      },

      pgUpdate$: {
        sql: () => `
        update cell_meta.gridder_task
        set
          name = $1,
          description = $2;`,
        params$: () => rx.of([
          this.name,
          this.description
        ])
      }

    })

  }

  /**
   *
   * Set ups the GridderTask for the GridderJob setup$ method. Creates all the
   * variables and catalogs.
   *
   */
  public setup$(sourcePg: RxPg, cellPg: RxPg, log?: NodeLogger):
  rx.Observable<any> {

    // To store the variables
    const variable: Variable = new Variable({
        gridderTaskId: this.gridderTaskId,
        name: this.variableName,
        description: this.variableDescription,
        gridderTask: this
    })

    return variable.pgInsert$(cellPg)
    .pipe(

      // Single variable GridderTask, index var is the only var
      rxo.concatMap((o: Variable) => this.setIndexVariableKey$(cellPg, o.variableKey)),

      rxo.map((o: any) => this)

    );

  }

  /**
   *
   * Apply the gridder task to a cell. Returns the child cells to compute the
   * next level on. Min zoom is the lowest zoom level to reach.
   *
   */
  public computeCell$(
    sourcePg: RxPg,
    cellPg: RxPg,
    cell: Cell,
    targetZoom: number,
    log?: NodeLogger
  ): rx.Observable<Cell[]> {

    // Check if the index variable is set
    if (this._indexVariableKey === undefined) {

      if (log) log.logInfo({
        message: `GridderTask ${this.gridderTaskId} of type ${this.gridderTaskType} is not set up`,
        methodName: "computeCell$",
        moduleName: "PointIdwGridderTask"
      })

      return rx.throwError(
        new Error(
          `GridderTask ${this.gridderTaskId} of type ${this.gridderTaskType} is not set up`));

    }

    // To store the final interpolated result
    let h: number = 0;

    // To store the key of the variable
    let variableKey: string;

    // The flag to signal a void cell, that is, no point found within
    // maxDistance
    let voidCell: boolean = false;

    const sql: string = `
      with center as (
        select st_centroid(st_geomfromewkt('${cell.ewkt}')) as geom
      ),
      nearest_points as (
        select
          ${this.heightField} as h,
          st_distance(center.geom, a.geom) as d
        from ${this.sourceTable} a, center
        where st_dwithin(center.geom, a.geom, ${this.maxDistance})
      )
      select
        *
      from nearest_points
      order by d
      limit ${this.numberOfPoints};
    `;

    // Get the variable
    return cell.getGrid$(cellPg)
    .pipe(

      rxo.concatMap((o: Cell) => Variable.getByGridderTaskId$(cellPg, this.gridderTaskId)),

      rxo.concatMap((o: Variable[]) => {

        variableKey = <string>o[0].variableKey;
        return sourcePg.executeParamQuery$(sql)

      }),

      rxo.map((o: any) => {

        // Check if any point was found within the maxDistance. If not, raise
        // the void cell flag.
        if (o.rowCount === 0) voidCell = true;

        // Calculate the IDW
        h = idw(
          o.rows.map((x: any) => x.h),
          o.rows.map((x: any) => x.d),
          this.power,
          this.round
        );

      }),

      // Update the cell if not void
      rxo.concatMap((o: any) => {

        // Write the cell if not void
        if (!voidCell) {

          cell.data[variableKey] = h;
          return cell.pgUpdate$(cellPg);

        } else {

          return rx.of([]);

        }

      }),

      // Return child cells, always. Even if a cell is not in range of the cloud
      // point, child cells may be.
      rxo.map((o: any) => {

        if (cell.zoom < targetZoom) {

          return cell.getSubCells(cell.zoom+1);

        } else {

          return [];

        }

      })

    )

  }

}
