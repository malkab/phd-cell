import { Catalog } from './catalog';

import { Variable } from "./variable";

import { IMetadated } from './imetadated';

/**
 *
 * A Vector is composed of several Variables at the end and a set of Catalogs as a
 * lineage into the Cell data structure.
 *
 */
export class Vector implements IMetadated {

  /**
   *
   * The ID.
   *
   */
  private _vectorId: string;

  get vectorId(): string { return this._vectorId }

  /**
   *
   * The Catalogs names.
   *
   */
  private _catalogNames: string[];

  get catalogNames(): string[] { return this._catalogNames }

  /**
   *
   * The Catalogs.
   *
   */
  private _catalogs: Catalog[] | undefined;

  get catalogs(): Catalog[] | undefined { return this._catalogs }

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
   * Variable names.
   *
   */
  private _variableNames: string[];

  get variableNames(): string[] { return this._variableNames }

  /**
   *
   * Variables.
   *
   */
  private _variables: Variable[] | undefined;

  get variables(): Variable[] | undefined { return this._variables }

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
  private _catalogFieldNames: string[];

  get catalogFieldNames(): string[] { return this._catalogFieldNames }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      vectorId,
      name,
      title,
      description,
      pgConnectionId,
      sourceTable,
      catalogNames,
      catalogFieldNames,
      variableNames
    }: {
      vectorId: string;
      name: string;
      title: string;
      description: string;
      pgConnectionId: string;
      sourceTable: string;
      catalogNames: string[];
      catalogFieldNames: string[];
      variableNames: string[];
  }) {

    this._vectorId = vectorId;
    this._name = name;
    this._title = title;
    this._description = description;
    this._catalogNames = catalogNames;
    this._variableNames = variableNames;
    this._pgConnectionId = pgConnectionId;
    this._sourceTable = sourceTable;
    this._catalogFieldNames = catalogFieldNames;

  }

}
