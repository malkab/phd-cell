import { Catalog } from "./catalog";

import { TsUtilsHashing } from "@malkab/ts-utils";



/**
 * 
 * The DataSet is the highest ranking tier of data organization within
 * the cell's data. It represents one of the JSON items at the data's root.
 * 
 */

export class DataSet {

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
     * Description. Markdown.
     * 
     */

    get description(): string {

        return this._description;

    }

    private _description: string;



    /**
     * 
     * Catalogs, the set of catalogs in use in the DataSet.
     * 
     */

    get catalogs(): Catalog[] {

        return this._catalogs;

    }

    private _catalogs: Catalog[] = [];



    /**
     * 
     * The constructor.
     * 
     * @param id 
     * @param name 
     * @param description 
     * 
     */

    constructor(

        name: string,
        description: string,
        id?: string

    ) {

        this._name = name;

        this._description = description;

        this._id = id ? id : TsUtilsHashing.sha256(
            `${name}${description}`, true
        );

    }



    /**
     * 
     * Adds a catalog.
     * 
     */

    public addCatalog(catalog: Catalog): void {

        this._catalogs.push(catalog);

    }

}
