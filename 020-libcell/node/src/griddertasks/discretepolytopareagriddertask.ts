import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { GridderTask } from "./griddertask";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class DiscretePolyTopAreaGridderTask extends GridderTask {

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
      geomField: geomField
    });

    this._gridderTaskType = EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA;
    this._gridderTaskTypeName = "Discrete variable on polygon based on top area";
    this._gridderTaskTypeDescription = "Given a vector of discrete variables, create a variable with the value of the category covering most area.";

    this._discreteFields = discreteFields;

  }

}
