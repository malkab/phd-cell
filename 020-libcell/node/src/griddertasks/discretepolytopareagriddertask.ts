import { EGRIDDERTASKTYPE } from './egriddertasktype';

import { GridderTask } from "./griddertask";

/**
 *
 * Top Area Polygon Discrete Gridder Task.
 *
 * This Gridder Task generates only one variable with a discrete category
 * catalog value.
 *
 * This Gridder Task takes a set of discrete fields to check and group all
 * polygons in the cell sharing the same values. The area of the categories
 * present at the cell is sum and only to top one is recorded at the variable.
 *
 */
export class DiscretePolyTopAreaGridderTask extends GridderTask {

  /**
   *
   * Discrete fields.
   *
   */
  protected _discreteFields: string[];
  get discreteFields(): string[] { return this._discreteFields }

  /**
   *
   * The name of the only variable that will be created by this Gridder Task.
   *
   */
  protected _variableName: string;
  get variableName(): string { return this._variableName }

  /**
   *
   * The description of the only variable that will be created by this Gridder
   * Task.
   *
   */
  protected _variableDescription: string;
  get variableDescription(): string { return this._variableDescription }

  /**
   *
   * Category template. This template in the form "{{{discreteFieldX}}}" is used
   * to create the name of each category value for the catalog.
   *
   */
  protected _categoryTemplate: string;
  get categoryTemplate(): string { return this._categoryTemplate }

  /**
   *
   * Constructor.
   *
   * @param __namedParameters
   * GridderTask deconstructed parameters.
   *
   * @param discreteFields
   * Set of fields to categorize. All records in the cell that has a common set
   * of values in these discrece fields are grouped together and a category (see
   * categoryTemplate) is created from their values.
   *
   * @param variableName
   * The name of the variable to be created in this Gridder Task. Only a
   * variable is created in this task.
   *
   * @param variableDescription
   * The description of the variable to be created in this Gridder Task. Only a
   * variable is created in this task.
   *
   * @param categoryTemplate
   * The template of each discrete category to be created in this task, in the
   * form of "{{{discreteFieldsX}}}".
   *
   */
  constructor({
      gridderTaskId,
      name,
      description,
      sourceTable,
      geomField,
      discreteFields,
      variableName,
      variableDescription,
      categoryTemplate
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
      discreteFields: string[];
      variableName: string;
      variableDescription: string;
      categoryTemplate: string;
  }) {

    super({
      gridderTaskId: gridderTaskId,
      name: name,
      description: description,
      sourceTable: sourceTable,
      geomField: geomField
    });

    this._gridderTaskType = EGRIDDERTASKTYPE.DISCRETEPOLYTOPAREA;
    this._gridderTaskTypeName = "Discrete variable on polygon based on top area";
    this._gridderTaskTypeDescription = "Given a vector of discrete variables, create a variable with the value of the category covering most area.";

    this._discreteFields = discreteFields;
    this._variableName = variableName;
    this._variableDescription = variableDescription;
    this._categoryTemplate = categoryTemplate;

  }

}
