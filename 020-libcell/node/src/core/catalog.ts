/**
 *
 * The catalog class.
 *
 */
export class Catalog {

  /**
   *
   * ID.
   *
   */
  get id(): string { return this._id; }

  set id(id: string) { this._id = id; }

  private _id: string;

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
  constructor(
    id: string,
    forward: { [ item: string ]: string } = {},
    backward: { [ hash: string ]: string } = {}
  ) {

    this._id = id;
    this._forward = forward;
    this._backward = backward;

  }

}
