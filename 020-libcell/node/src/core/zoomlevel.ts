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

  /**
   *
   * Safe serial for databases.
   *
   */
  get apiSafeSerial(): any { return { name: this.name, size: this.size } }

  /*

    Getters & Setters

  */
  get name(): string { return this._name; }

  get size(): number { return this._size; }

  /*

      Constructor

  */
  constructor({
      name,
      size
    }: {
      name: string;
      size: number;
  }) {

    this._name = name;
    this._size = size;

  }

}
