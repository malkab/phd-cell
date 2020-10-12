/*

    Class

*/
export class ZoomLevel {

  /*

    Private members

  */

  // Name
  private _name: string;

  // Size
  private _size: number;

  /*

    Getters & Setters

  */
  get name(): string { return this._name; }

  get size(): number { return this._size; }

  /*

      Constructor

  */
  constructor(name: string, size: number) {

    this._name = name;
    this._size = size;

  }

}
