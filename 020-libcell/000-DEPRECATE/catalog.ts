import { IMetadated } from './imetadated';

/**
 *
 * The catalog class.
 *
 */
export class Catalog implements IMetadated {

  /**
   *
   * ID.
   *
   */
  get catalogId(): string { return this._catalogId; }
  set catalogId(catalogId: string) { this._catalogId = catalogId; }
  protected _catalogId: string;

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
   * The ID of the PgConnection.
   *
   */
  protected _pgConnectionId: string;
  get pgConnectionId(): string { return this._pgConnectionId }

  /**
   *
   * The source table.
   *
   */
  protected _sourceTable: string;
  get sourceTable(): string { return this._sourceTable }

  /**
   *
   * The source field.
   *
   */
  protected _sourceField: string;
  get sourceField(): string { return this._sourceField }

  /**
   *
   * The forward map, that is, item > minihash
   *
   */
  get forward(): { [ item: string ]: string } { return this._forward; }
  protected _forward: { [ item: string ]: string } = {};

  /**
   *
   * The backward map, that is, minihash > item
   *
   */
  get backward(): { [ item: string ]: string } { return this._backward; }
  protected _backward: { [ hash: string ]: string } = {};

  /**
   *
   * Constructor, optionally gets the forward and backward maps.
   *
   */
  constructor({
      catalogId,
      name,
      description,
      pgConnectionId,
      sourceTable,
      sourceField,
      forward = {},
      backward = {}
    }: {
      catalogId: string;
      name: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      sourceField: string;
      forward: { [ item: string ]: string };
      backward: { [ hash: string ]: string };
  }) {

    this._catalogId = catalogId;
    this._name = name;
    this._description = description;
    this._forward = forward;
    this._backward = backward;
    this._pgConnectionId = pgConnectionId;
    this._sourceTable = sourceTable;
    this._sourceField = sourceField;

  }

}
