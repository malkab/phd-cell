/*

    Class for zoom level

*/



/*

    Persistance interface

*/

export interface IZoomLevel {
    name: string;
    size: number;
}


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

    get name(): string {
        return this._name;
    }

    get size(): number {
        return this._size;
    }

    get persist(): IZoomLevel {

        return <IZoomLevel>{
            name: this._name,
            size: this._size
        };

    }


    /*

        Constructor

    */

    constructor(name: string, size: number) {
        if (!name || name === "") {
            throw new Error("ZoomLevel: name can't be null nor empty");
        }

        if (!size || size === 0) {
            throw new Error("ZoomLevel: size can't be null nor 0");
        }

        this._name = name;
        this._size = size;
    }

}
