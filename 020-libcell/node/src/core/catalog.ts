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

  private _catalogId: string;

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
   * The forward map, that is, item > minihash
   *
   */
  get forward(): { [ item: string ]: string } { return this._forward; }

  private _forward: { [ item: string ]: string } = {};

  /**
   *
   * The backward map, that is, minihash > item
   *
   */
  get backward(): { [ item: string ]: string } { return this._backward; }

  private _backward: { [ hash: string ]: string } = {};

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
