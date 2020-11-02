import { GridderTask } from '../griddertasks';

import { IMetadated } from './imetadated';

/**
 *
 * A Variable is an element of a Vector. It has a name, a title, and a
 * description. A Vector is composed of several Variables, plus other things.
 *
 */
export class Variable implements IMetadated {

  /**
   *
   * The Gridder Task ID.
   *
   */
  protected _gridderTaskId: string;

  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * The Gridder Task.
   *
   */
  protected _gridderTask: GridderTask | undefined;

  get gridderTask(): GridderTask | undefined { return this._gridderTask }

  /**
   *
   * The ID.
   *
   */
  protected _variableId: string;

  get variableId(): string { return this._variableId }

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
   * Key. This is the key used at the data vector to refer to the variable.
   *
   */
  protected _key: string | undefined;

  get key(): string | undefined { return this._key }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      gridderTask = undefined,
      variableId,
      key = undefined,
      name,
      description
    }: {
      gridderTaskId: string;
      gridderTask?: GridderTask;
      variableId: string;
      key?: string;
      name: string;
      description: string;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._gridderTask = gridderTask;
    this._variableId = variableId;
    this._key = key;
    this._name = name;
    this._description = description;

  }

}
