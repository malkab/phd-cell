import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { GridderTask } from "./griddertask";

/**
 *
 * Area summary of areas of polygons Gridder Task.
 *
 * This Gridder Task generates as many variables as discrete categories it
 * encounters in its discrete fields, one to represent the percentage of the
 * cell's area covered by this discrete category.
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
      geomField: geomField
    });

    this._gridderTaskType = EGRIDDERTASKTYPE.DISCRETEPOLYAREASUMMARY;
    this._gridderTaskTypeName = "Discrete variable on polygon area summary";
    this._gridderTaskTypeDescription = "Given a vector of discrete variables, create as many variables as categories present in the cell presenting the area covered by this category in the cell.";
    this._variableNameTemplate = variableNameTemplate;
    this._variableDescriptionTemplate = variableDescriptionTemplate;

    this._discreteFields = discreteFields;

  }

}
