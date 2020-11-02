import { Variable } from './variable';

/**
 *
 * This class manages a discrete catalog for a discrete variable.
 *
 */
export class Catalog {

  /**
   *
   * GridderTaskId ID this catalog belongs to.
   *
   */
  protected _gridderTaskId: string;

  get gridderTaskId(): string { return this._gridderTaskId }

  /**
   *
   * Variable ID this catalog belongs to.
   *
   */
  protected _variableId: string;

  get variableId(): string { return this._variableId }

  /**
   *
   * Variable this catalog belongs to, if available.
   *
   */
  protected _variable: Variable | undefined;

  get variable(): Variable | undefined { return this._variable }

  /**
   *
   * Forward: the key > value mapping for the catalog.
   *
   */
  protected _forward: Map<string, string>;

  get forward(): Map<string, string> { return this._forward }

  /**
   *
   * Backward: the value > key mapping for the catalog.
   *
   */
  protected _backward: Map<string, string>;

  get backward(): Map<string, string> { return this._backward }

  /**
   *
   * Constructor.
   *
   */
  constructor({
      gridderTaskId,
      variableId,
      variable = undefined,
      forward = new Map<string, string>(),
      backward = new Map<string, string>()
    }: {
      gridderTaskId: string;
      variableId: string;
      variable?: Variable;
      forward?: Map<string, string>;
      backward?: Map<string, string>;
  }) {

    this._gridderTaskId = gridderTaskId;
    this._variableId = variableId;
    this._variable = variable;
    this._forward = forward;
    this._backward = backward;

  }

}
