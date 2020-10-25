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
   * The ID.
   *
   */
  private _variableId: string;

  get variableId(): string { return this._variableId }

  /**
   *
   * Name.
   *
   */
  private _name: string;

  get name(): string { return this._name }

  /**
   *
   * Description.
   *
   */
  private _description: string;

  get description(): string { return this._description }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      variableId,
      name,
      description
    }: {
      variableId: string;
      name: string;
      description: string;
  }) {

    this._variableId = variableId;
    this._name = name;
    this._description = description;

  }

}
