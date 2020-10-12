/*

    Base class for all CellObjects

*/

import { IPersistable } from "./ipersistable";


/*

    Persistence interface

*/

export interface ICellObject {
    name?: string;
    description?: string;
    longdescription?: string;
}


/*

    Class

*/

export class CellObject implements IPersistable {


    /*

        Private members

    */

    // ID
    private _id: string;

    // Name
    private _name: string;

    // Description
    private _description: string;

    // Long description
    private _longDescription: string;

    // The object type
    // Originally the constructor.name was returned, but since
    // Webpack's code minification, a hash is used instead, so it
    // must be hard-coded at each class
    protected _type: string;



    /*

        Getters & Setters

    */

    get type(): string {
        return this._type;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get longDescription(): string {
        return this._longDescription;
    }

    get persist(): ICellObject {
        let out: ICellObject = {};

        if (this._description) { out.description = this._description; }
        if (this._longDescription) { out.longdescription = this._longDescription; }
        if (this._name) { out.name = this._name; }

        return out;

    }

    // The persistence key
    get key(): string {
        return `${this.type}:${this.id}`;
    }



    /*

        Constructor

    */

    constructor(id: string, init: ICellObject) {

        if (id === "" || !id) {
            throw new Error("Unable to create CellObject: no id");
        }

        this._id = id;
        this._name = init.name;
        this._description = init.description;
        this._longDescription = init.longdescription;

        return this;

    }

}