/* 

    -----------------------
    Persistable classes imports
    -----------------------
    
*/

import { ICellObject, CellObject } from "../src/libcell/cellobject";


const registeredClasses: { [ type: string ]: any } = {

    "CellObject": CellObject

}






/**
 *
 * This is the interface persistable objects must adhere to. All objects
 * intended for persistance must comply with it.
 *
 */
export interface IPersistableObject {

    /**
     *
     * The object ID within its type. Persistable objects of different
     * types may have the same ID.
     *
     */
    id: string;

    /**
     * 
     * The object type, represents the object class.
     * 
     */
    type: string;

    /**
     *
     * This property composes the persist data structure to be
     * persistet. This data structure is what is persistet at the
     * database and must be enough to recreate an object in it's class
     * with all its dependencies.
     *
     */
    persist: any;

    /**
     *
     * This read only property must return the object key, which is
     * type:id and is unique in the system
     * 
     */
    key: string;

    /**
     * 
     * This property decomposes the key into id and type.
     * 
     */
    decomposeKey(key: string): { type: string, id: string };

}


/**
 *
 * This interface is the base for the persist data structure that
 * IPersistableObject objects must adhere to.
 *
 */
export interface IPersistableDataStructure {

    /**
     * 
     * The object ID within its type.
     */
    id: string;

    /**
     *
     * The object type, represents the object class. It's optional
     * because for creating objects from scratch it can be null, the
     * object will set it in its constructor. But must be set to persist
     * and to create an object from a persisted init object.
     *
     */
    type: string;

    /**
     *
     * The object's custom data structure to persist, must be defined at
     * each object.
     * 
     */
    persist: any;

}


/**

    This is the class that is the base class for any persistable class.

*/

export class PersistableObject implements IPersistableObject {

    /*
        ---------------------------

        Members

        ---------------------------
    */

    /**
     * 
     * The object ID, intended to be unique among the same object type.
     * 
     */

    private _id: string;


    /**
     *
     * The object type. Originally the constructor.name was returned,
     * but since Webpack's code minification, a hash is used instead, so
     * it must be hard-coded at each class.
     *
     */ 
    private _type: string;


    /**
     * 
     * The persisted data.
     * 
     */
    private _persist: IPersistableDataStructure;



    /*

        ---------------------------

        Getters & Setters

        ---------------------------

    */

    /**
     *
     * The object type. This can't be accessed by instrospection because
     * when Webpack minifies the code for production all original class
     * names are lost.
     *
     */
    get type(): string {
        return this._type;
    }


    /**
     * 
     * The object's ID, unique among objects of the same **type**.
     * 
     */
    get id(): string {
        return this._id;
    }


    /**
     *
     * The object's persist data structure. This property is what is
     * persistet at the persistance systems and must be the only data
     * structure needed to initialize an object of this type at the
     * persistence system.
     *
     */
    get persist(): IPersistableDataStructure {

        // let out: ICellObject = {

        //     id: this._id,
        //     type: this._type,

            
        // };

        // if (this._description) { out.description = this._description; }
        // if (this._longDescription) { out.longdescription = this._longDescription; }
        // if (this._name) { out.name = this._name; }

        return this._persist;

    }

    // The persistence key
    get key(): string {
        return `${this.type}:${this.id}`;
    }



    /**
     * 
     * Constructor.
     * 
     * @param init      The init data structure.
     * 
     */

    constructor(init: IPersistableDataStructure) {

        if (init.id === "" || !init.id) {
            throw new Error(`Unable to create PersistableObject: no id for object type ${init.type}`);
        }

        if (init.type === "" || !init.type) {
            throw new Error(`Unable to create PersistableObject: no type for object ID ${init.id}`);
        }

        if (init.persist === "" || !init.persist) {
            throw new Error(`Unable to create PersistableObject: no persist for object type ${init.type} and ID ${init.id}`);
        }

        this._id = init.id;
        this._type = init.type;
        this._persist = init.persist;

        return this;

    }


    /**
     * 
     * Decomposes a key into type / ID.
     * 
     * @param key       The key to decompose.
     * 
     * @returns         A { type: string, id: string } structure.
     * 
     */
    public decomposeKey(key: string): { type: string, id: string } {

        const split = key.split(":");

        if (split.length !== 2) {
            throw Error(`Bad Redis key ${key}`);
        } else {
            return { type: split[0], id: split[1] };
        }

    }

}




/**
 * 
 * 
 */

export function getCellObject(init: ICellObject): any {

    console.log("D: init", init);

    const object: any = registeredClasses[init.type];

    const a = <object>new object(init);

    return a;

}