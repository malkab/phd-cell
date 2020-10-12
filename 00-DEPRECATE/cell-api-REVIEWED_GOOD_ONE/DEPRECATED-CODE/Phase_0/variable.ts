/*

    Variable class.

*/

import { IPostGIS, PostGIS } from "./postgis";
import { sha256 } from "js-sha256";
import { Grid } from "./Grid";

// Interface for descriptors (name, description)

interface IVariableDescriptor { [language: string]: string; }


// Definition interface

interface IVariable {
    postGIS: IPostGIS;
    variable: {
        grid: string;
        name: IVariableDescriptor;
        description: IVariableDescriptor;
        root: string;
        tags: string[];
        schema: any
    };
}


// Class

export class Variable {

    // Members
    private _postGIS: PostGIS;
    private _hash: string;
    private _grid: Grid;
    private _name: IVariableDescriptor;
    private _description: IVariableDescriptor;
    private _root: string;
    private _tags: string[];
    private _schema: any;


    // Getters and setters

    get postGIS(): PostGIS {
        return this._postGIS;
    }

    get hash(): string {
        return this._hash;
    }

    get grid(): Grid {
        return this._grid;
    }

    get root(): string {
        return this._root;
    }

    // CONTINUE WITH GETTERS


    // Constructor
    constructor(definition: IVariable) {
        this._postGIS = new PostGIS(definition.postGIS);

        //this._grid = definition.variable.grid;
        this._name = definition.variable.name;
        this._description = definition.variable.description;
        this._root = definition.variable.root;
        this._tags = definition.variable.tags;
        this._schema = definition.variable.schema;
        this._hash = this.getHash();

        return this;
    }


    // Generates a hash
    private getHash(): string {
        return sha256(`${this.grid}${this.root}`);
    }
}