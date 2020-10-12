import { KeeperBaseClass, KeeperPrototype }
    from "@malkab/keeper-core";

/*

    Base class for all CellObjects

*/

// import { IPersistableDataStructure, PersistableObject } from "./ipersistable";


/*

    Persistence interface

*/

/**
 *
 * This is the base interface all CellObject's persist data structures
 * must comply to.
 *
 */

// export interface ICellObject {

//     /**
//      *
//      * The persist structure base. Each CellObject must extend this data
//      * structure to store all custom data to be persisted.
//      */   

//     /**
//      * 
//      * The optional name of the object.
//      * 
//      */
//     name?: string;

//     /**
//      * 
//      * The optional short description of the object.
//      * 
//      */
//     description?: string;

//     /**
//      * 
//      * The optional long description of the object.
//      * 
//      */
//     longdescription?: string;

// }


/*

    Class

*/

@KeeperPrototype({

    serialize: {

        members: [ "name", "description", "longDescription" ],
        dependencies: []

    },

    type: "CellObject"

})
export class CellObject extends KeeperBaseClass {

    /*
        ---------------------------

        Members

        ---------------------------
    */

    // /**
    //  * 
    //  * The object ID, intended to be unique among the same object type.
    //  * 
    //  */

    // private _id: string;

    /**
     * 
     * The optional object type.
     * 
     */
    private _name: string;

    /**
     * 
     * The optional short description.
     * 
     */
    private _description: string;

    /**
     * 
     * The optional long description.
     * 
     */
    private _longDescription: string;

    // /**
    //  *
    //  * The object type. Originally the constructor.name was returned,
    //  * but since Webpack's code minification, a hash is used instead, so
    //  * it must be hard-coded at each class.
    //  *
    //  */ 
    // private _type: string;



    /*

        ---------------------------

        Getters & Setters

        ---------------------------

    */

    // /**
    //  *
    //  * The object type. This can't be accessed by instrospection because
    //  * when Webpack minifies the code for production all original class
    //  * names are lost.
    //  *
    //  */
    // get type(): string {
    //     return this._type;
    // }


    // /**
    //  * 
    //  * The object's ID, unique among objects of the same **type**.
    //  * 
    //  */
    // get id(): string {
    //     return this._id;
    // }


    /**
     * 
     * The object's optional name.
     * 
     */
    get name(): string {
        return this._name;
    }

    set name(name: string) {

        this._name = name;

    }


    /**
     * 
     * The object's optional short description.
     * 
     */
    get description(): string {
        return this._description;
    }

    set description(description: string) {

        this._description = description;

    }

    /**
     * 
     * The object's optional long description.
     * 
     */
    get longDescription(): string {
        return this._longDescription;
    }

    set longDescription(longDescription: string) {

        this._longDescription = longDescription;

    }

    // /**
    //  *
    //  * The object's persist data structure. This property is what is
    //  * persistet at the persistance systems and must be the only data
    //  * structure needed to initialize an object of this type at the
    //  * persistence system.
    //  *
    //  */
    // get persist(): ICellObject {

    //     // let out: ICellObject = {

    //     //     id: this._id,
    //     //     type: this._type,

            
    //     // };

    //     // if (this._description) { out.description = this._description; }
    //     // if (this._longDescription) { out.longdescription = this._longDescription; }
    //     // if (this._name) { out.name = this._name; }

    //     return null;

    // }

    // // The persistence key
    // get key(): string {
    //     return `${this.type}:${this.id}`;
    // }


    // /**
    //  * 
    //  * Constructor.
    //  * 
    //  * @param init      The init data structure.
    //  * 
    //  */

    constructor(id: string, name: string, description: string, 
        longDescription: string) 
    {

        super(id);

        // if (id === "" || !id) {
        //     throw new Error("Unable to create CellObject: no id");
        // }

        this._name = name;
        this._description = description;
        this._longDescription = longDescription;

        // return this;

    }

    // /*

    //    Gets type and ID from a Redis key

    // */

    // public decomposeKey(key: string): { type: string, id: string } {

    // const split = key.split(":");

    // if (split.length !== 2) {
    //     throw Error(`Bad Redis key ${key}`);
    // } else {
    //     return { type: split[0], id: split[1] };
    // }

}