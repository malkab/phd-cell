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

import { mean } from "simple-statistics";

import { round } from "mathjs";

import { idw } from "../core/utils";

/**
 *
 * MDT processing by either averaging colliding points if there are enough of
 * or by interpolation by IDW.
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
 * If **numberOfPoints** or more points collides the cell, the average of the
 * data field is provided as the final data. If not, IDW is applied.
 *
 * This GridderTask generates a single variable. The name and description for
 * this variable must be provided in the **variableName** and
 * **variableDescription** additional params.
 *
 */
export class MdtProcessingGridderTask extends GridderTask implements PgOrm.IPgOrm<MdtProcessingGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<MdtProcessingGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<MdtProcessingGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<MdtProcessingGridderTask> = (pg) => rx.of();

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
      gridderTaskType: EGRIDDERTASKTYPE.MDTPROCESSING,
      gridderTaskTypeName: "Processing of MDT data by averaging / IDW",
      gridderTaskTypeDescription: "Processes MDT data by averaging height data if enough points collide the cell or interpolating by Inverse Distance Weighting method.",
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField,
      pgDataType: "numeric",
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

    // Void cell
    let voidCell: boolean = false;

    // To store the final interpolated result
    let h: number | undefined = undefined;

    // To store the key of the variable
    let variableKey: string;

    // The flag to signal not enough points found within maxDistance
    let notEnoughPointsMaxDistance: boolean = false;

    // Cell with offset
    const offsetCell: Cell = cell.clone();
    offsetCell.offset = this.maxDistance * 2;

    // SQL for detecting a void cell with offset
    const voidCellSql: string = `
      with geom_cell as (
        select st_geomfromewkt('${offsetCell.ewkt}') as geom
      )
      select count(*) as n_colliding_points
      from
        geom_cell a inner join
        ${this.sourceTable} b on
        st_intersects(b.${this.geomField}, a.geom);
    `;

    // SQL for colliding points, first check for averaging
    const sqlCollidingPoints: string = `
      with geom_cell as (
        select st_geomfromewkt('${cell.ewkt}') as geom
      )
      select ${this.heightField} as h
      from ${this.sourceTable} a, geom_cell b
      where st_intersects(a.${this.geomField}, b.geom);
    `;

    // SQL for nearest points, second check for IDW
    const sqlNearPoints: string = `
      with geom_cell as (
        select st_geomfromewkt('${cell.ewkt}') as geom
      ),
      center as (
        select st_centroid(geom) as geom from geom_cell
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

    if (log) log.logInfo({
      message: `${this.logHeader(cell)}: compute start`,
      methodName: "computeCell$",
      moduleName: "MdtProcessingGridderTask",
      payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
    })

    // Get cell grid
    return cell.getGrid$(cellPg)
    .pipe(

      // Get the variable
      rxo.concatMap((o: Cell) => this.getVariables$(cellPg)),

      // Execute void cell SQL
      rxo.concatMap((o: GridderTask) => {

        variableKey = <string>(<Variable[]>this.variables)[0].variableKey;
        return sourcePg.executeParamQuery$(voidCellSql);

      }),

      // Execute colliding points
      rxo.concatMap((o: any) => {

        if((+o.rows[0].n_colliding_points) === 0) {

          voidCell = true;
          return rx.of(voidCell);

        } else {

          return sourcePg.executeParamQuery$(sqlCollidingPoints);

        }

      }),

      rxo.concatMap((o: any) => {

        if (voidCell === false) {

          // Check if there are more points colliding the cell than numberOfPoints
          if (o.rowCount > 0) {

            if (log) log.logInfo({
              message: `${this.logHeader(cell)}: colliding points for averaging (${o.rowCount} points)`,
              methodName: "computeCell$",
              moduleName: "MdtProcessingGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            // Averaging
            h = round(mean(o.rows.map((x: any) => x.h)), this.round);

            return rx.of(h);

          } else {

            if (log) log.logInfo({
              message: `${this.logHeader(cell)}: no colliding points for averaging (${o.rowCount} points)`,
              methodName: "computeCell$",
              moduleName: "MdtProcessingGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            // Get nearest points for IDW
            return sourcePg.executeParamQuery$(sqlNearPoints);

          }

        } else {

          return rx.of(voidCell);

        }

      }),

      // Calculate IDW if h is yet undefined
      rxo.concatMap((o: any) => {

        // Check if the recieved item is a QueryResult or h
        if (o.rowCount !== undefined && h === undefined) {

          // Check if any point was found within the maxDistance. If not, raise
          // the void cell flag.
          if (o.rowCount < this.numberOfPoints) {

            if (log) log.logInfo({
              message: `${this.logHeader(cell)}: not enough points within distance for IDW (${o.rowCount} points)`,
              methodName: "computeCell$",
              moduleName: "MdtProcessingGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            notEnoughPointsMaxDistance = true;

          } else {

            if (log) log.logInfo({
              message: `${this.logHeader(cell)}: calculating IDW (${o.rowCount} points)`,
              methodName: "computeCell$",
              moduleName: "MdtProcessingGridderTask",
              payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
            })

            // Calculate the IDW
            h = idw(
              o.rows.map((x: any) => x.h),
              o.rows.map((x: any) => x.d),
              this.power,
              this.round
            );

          }

        }

        // Write the cell if h has been calculated
        if (h !== undefined) {

          if (log) log.logInfo({
            message: `${this.logHeader(cell)}: setting final h ${h}`,
            methodName: "computeCell$",
            moduleName: "MdtProcessingGridderTask",
            payload: { cell: cell.apiSafeSerial, targetZoom: targetZoom }
          })

          cell.data[variableKey] = h;
          return cell.pgUpdate$(cellPg);

        } else {

          return rx.of([]);

        }

      }),

      // Return child cells, always. Even if a cell is not in range of the cloud
      // point, child cells may be.
      rxo.map((o: any) => {

        if (voidCell === false) {

          if (cell.zoom < targetZoom) {

            const c: Cell[] = cell.getSubCells(cell.zoom+1);

            if (log) log.logInfo({
              message: `${this.logHeader(cell)}: returning ${c.length} subcells`,
              methodName: "computeCell$",
              moduleName: "MdtProcessingGridderTask"
            })

            return c;

          } else {

            if (log) log.logInfo({
              message: `${this.logHeader(cell)}: end of gridding stack`,
              methodName: "computeCell$",
              moduleName: "MdtProcessingGridderTask"
            })

            return [];

          }

        } else {

          if (log) log.logInfo({
            message: `${this.logHeader(cell)}: end of gridding stack`,
            methodName: "computeCell$",
            moduleName: "MdtProcessingGridderTask"
          })

          return [];

        }

      })

    )

  }

}
