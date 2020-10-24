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
   * Title.
   *
   */
  private _title: string;

  get title(): string { return this._title }

  /**
   *
   * Description.
   *
   */
  private _description: string;

  get description(): string { return this._description }

  /**
   *
   * The ID of the PgConnection.
   *
   */
  private _pgConnectionId: string;

  get pgConnectionId(): string { return this._pgConnectionId }

  /**
   *
   * The source table.
   *
   */
  private _sourceTable: string;

  get sourceTable(): string { return this._sourceTable }

  /**
   *
   * The source field.
   *
   */
  private _sourceField: string;

  get sourceField(): string { return this._sourceField }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      variableId,
      name,
      title,
      description,
      pgConnectionId,
      sourceTable,
      sourceField
    }: {
      variableId: string;
      name: string;
      title: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      sourceField: string;
  }) {

    this._variableId = variableId;
    this._name = name;
    this._title = title;
    this._description = description;
    this._pgConnectionId = pgConnectionId;
    this._sourceTable = sourceTable;
    this._sourceField = sourceField;

  }

}
