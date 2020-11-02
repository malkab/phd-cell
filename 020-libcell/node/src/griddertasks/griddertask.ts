import { IMetadated } from "../core/imetadated";

import { EGRIDDERTASKTYPE } from "./egriddertasktype";

/**
 *
 * Base class to define GridderTasks.
 *
 */
export class GridderTask implements IMetadated {

  /**
   *
   * GridderTask type.
   *
   */
  protected _gridderTaskType: EGRIDDERTASKTYPE | undefined;

  get gridderTaskType(): EGRIDDERTASKTYPE | undefined { return this._gridderTaskType }

  /**
   *
   * GridderTask type name. This is the name of the GridderTask type itself, not
   * the specific task. It will be fixed for all GridderTasks for this type.
   *
   */
  protected _gridderTaskTypeName: string | undefined;

  get gridderTaskTypeName(): string | undefined { return this._gridderTaskTypeName }

  /**
   *
   * GridderTask type description. Like name, this is the GridderTask
   * description type itself, not for the specific GridderTask. All GridderTasks
   * of this type will have the same description.
   *
   */
  protected _gridderTaskTypeDescription: string | undefined;

  get gridderTaskTypeDescription(): string | undefined { return this._gridderTaskTypeDescription }

  /**
   *
   * Source table.
   *
   */
  protected _sourceTable: string;

  get sourceTable(): string { return this._sourceTable }

  /**
   *
   * GridderTaskId.
   *
   */
  protected _gridderTaskId: string;

  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * Name.
   *
   */
  protected _name: string;

  get name(): string { return this._name }

  /**
   *
   * Description.
   *
   */
  protected _description: string;

  get description(): string { return this._description }

  /**
   *
   * Description template for variables.
   *
   */
  protected _geomField: string;

  get geomField(): string { return this._geomField }

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
      geomField
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      sourceTable: string;
      geomField: string;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._name = name;
    this._description = description;
    this._sourceTable = sourceTable;
    this._geomField = geomField;

    this._gridderTaskType = undefined;
    this._gridderTaskTypeName = undefined;
    this._gridderTaskTypeDescription = undefined;

  }

}
