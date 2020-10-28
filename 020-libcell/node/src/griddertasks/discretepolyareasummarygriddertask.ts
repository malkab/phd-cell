import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { PgConnection } from 'src/core/pgconnection';

import { GridderTask } from "./griddertask";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyAreaSummaryGridderTask extends GridderTask {

  /**
   *
   * Discrete field.
   *
   */
  private _discreteFields: string[];

  get discreteFields(): string[] { return this._discreteFields }

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
      geomField: geomField
    });

    this._gridderTaskType = EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY;
    this._gridderTaskTypeName = "Discrete variable on polygon area summary";
    this._gridderTaskTypeDescription = "Given a vector of discrete variables, create as many variables as categories present in the cell presenting the area covered by this category in the cell.";

    this._discreteFields = discreteFields;

  }

}
