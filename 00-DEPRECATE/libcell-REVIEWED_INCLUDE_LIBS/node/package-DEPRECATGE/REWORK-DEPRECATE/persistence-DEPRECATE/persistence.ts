export interface IPersistenceTemplate {

    serialize: {
        members: any[];

        dependencies: any[];
    },

    type: string

}


export class BasePersistenceClass {

    // This hack deactivates the "index signature" error when accessing
    // class members by index

    [k: string]: any;

    private _id: string;

    get id(): string {

        return this._id;

    }

    get key(): string {

        if (!this._id) {

            throw Error(`ID for IPersistenceObject ${this._type} not defined.`);
            
        }

        return `${this.type}:${this._id}`;

    }

    constructor(id: string) {

        this._id = id;

    }

}




export function Persistence(config: IPersistenceTemplate) {
    
    return (f: Function) => {

        f.prototype.serialize = config.serialize;

        f.prototype.type = config.type;

    }

}
