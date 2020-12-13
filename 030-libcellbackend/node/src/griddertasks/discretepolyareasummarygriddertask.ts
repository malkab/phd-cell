import { PgOrm } from "@malkab/rxpg"

import { RxPg } from "@malkab/rxpg";

import * as rx from "rxjs";

import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { GridderTask } from "./griddertask";

import { Grid } from "../core/grid";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyAreaSummaryGridderTask extends GridderTask implements PgOrm.IPgOrm<DiscretePolyAreaSummaryGridderTask> {

  // Dummy PgOrm
  // TODO: implement full ORM
  public pgDelete$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTask> = (pg) => rx.of();
  public pgInsert$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTask> = (pg) => rx.of();
  public pgUpdate$: (pg: RxPg) => rx.Observable<DiscretePolyAreaSummaryGridderTask> = (pg) => rx.of();

  /**
   *
   * Discrete field.
   *
   */
  private _discreteFields: string[];
  get discreteFields(): string[] { return this._discreteFields }

  /**
   *
   * The name of the only variable that will be created by this Gridder Task.
   *
   */
  private _variableNameTemplate: string;
  get variableNameTemplate(): string { return this._variableNameTemplate }

  /**
   *
   * The description of the only variable that will be created by this Gridder
   * Task.
   *
   */
  private _variableDescriptionTemplate: string;
  get variableDescriptionTemplate(): string { return this._variableDescriptionTemplate }

  /**
   *
   * Constructor.
   *
   * @param __namedParameters
   * GridderTask deconstructed parameters.
   *
   * @param nameTemplate
   *
   *
   */
  constructor({
      gridderTaskId,
      gridId,
      grid = undefined,
      name,
      description,
      sourceTable,
      geomField,
      discreteFields,
      variableNameTemplate,
      variableDescriptionTemplate
    }: {
      gridderTaskId: string;
      gridId: string;
      grid?: Grid;
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
      gridderTaskType: EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY,
      gridderTaskTypeName: "Discrete variable on polygon area summary",
      gridderTaskTypeDescription: "Given a vector of discrete variables, create as many variables as categories present in the cell presenting the area covered by this category in the cell.",
      gridId: gridId,
      grid: grid,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField
    });

    this._variableNameTemplate = variableNameTemplate;
    this._variableDescriptionTemplate = variableDescriptionTemplate;

    this._discreteFields = discreteFields;

    PgOrm.generateDefaultPgOrmMethods(this, {

      pgInsert$: {
        sql: () => `
        insert into cell_meta.gridder_task
        values ($1, $2, $3, $4, $5, $6, $7, $8);`,
        params$: () => rx.of([
          this.gridderTaskId,
          this.gridderTaskType,
          this.gridId,
          this.name,
          this.description,
          this.sourceTable,
          this.geomField,
          {
            discreteFields: this.discreteFields,
            variableNameTemplate: this.variableNameTemplate,
            variableDescriptionTemplate: this.variableDescriptionTemplate
          }
        ])
      }

    })

  }

}
