import { PgConnection } from 'src/core/pgconnection';

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
   * GridderTask type name.
   *
   */
  protected _gridderTaskTypeName: string | undefined;

  get gridderTaskTypeName(): string | undefined { return this._gridderTaskTypeName }

  /**
   *
   * GridderTask type description.
   *
   */
  protected _gridderTaskTypeDescription: string | undefined;

  get gridderTaskTypeDescription(): string | undefined { return this._gridderTaskTypeDescription }

  /**
   *
   * PgConnectionId.
   *
   */
  protected _pgConnectionId: string;

  get pgConnectionId(): string { return this._pgConnectionId }

  /**
   *
   * PgConnection.
   *
   */
  protected _pgConnection: PgConnection | undefined;

  get pgConnection(): PgConnection | undefined { return this._pgConnection }

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
   * Name template for variables.
   *
   */
  protected _nameTemplate: string;

  get nameTemplate(): string { return this._nameTemplate }

  /**
   *
   * Description template for variables.
   *
   */
  protected _descriptionTemplate: string;

  get descriptionTemplate(): string { return this._descriptionTemplate }

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
   */
  constructor({
      gridderTaskId,
      name,
      description,
      pgConnectionId,
      pgConnection = undefined,
      sourceTable,
      nameTemplate,
      descriptionTemplate,
      geomField
    }: {
      gridderTaskId: string;
      name: string;
      description: string;
      pgConnectionId: string;
      pgConnection?: PgConnection;
      sourceTable: string;
      nameTemplate: string;
      descriptionTemplate: string;
      geomField: string;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._name = name;
    this._description = description;
    this._pgConnectionId = pgConnectionId;
    this._sourceTable = sourceTable;
    this._nameTemplate = nameTemplate;
    this._descriptionTemplate = descriptionTemplate;
    this._geomField = geomField;

    this._gridderTaskType = undefined;
    this._gridderTaskTypeName = undefined;
    this._gridderTaskTypeDescription = undefined;

    this._pgConnection = pgConnection;

  }

}
