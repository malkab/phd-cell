import { TsUtilsHashing } from "@malkab/ts-utils";



/**
 *
 * An item retrieved from a cell's data with a JSON Path.
 *
 */

export class DataItem {

    /**
     *
     * The internal ID, a hash.
     *
     */

    get id(): string {

        return this._id;

    }

    private _id: string;



    /**
     *
     * Name.
     *
     */

    get name(): string {

        return this._name;

    }

    private _name: string;



    /**
     *
     * Description.
     *
     */

    get description(): string {

        return this._description;

    }

    private _description: string;



    /**
     *
     * The path to retrieve.
     *
     */

    get path(): string {

        return this._path;

    }

    private _path: string;



    /**
     *
     * The constructor.
     *
     * @param name
     * @param description
     * @param path
     * @param id
     *
     */

    constructor(

        name: string,
        description: string,
        path: string,
        id?: string

    ) {

        this._name = name;

        this._description = description;

        this._path = path;

        this._id = id ? id : TsUtilsHashing.sha256(
            `${name}${description}`, true
        );

    }

}
