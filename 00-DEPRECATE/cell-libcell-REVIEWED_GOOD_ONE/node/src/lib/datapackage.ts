import { TsUtilsHashing } from "@malkab/ts-utils";

import { DataItem } from "./dataitem";



/**
 * 
 * The DataPackage is a selection of data coming from the cell's data.
 * 
 */

export class DataPackage {

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
     * DataItems, the data items this package is composed of.
     * 
     */

    get dataItems(): DataItem[] {

        return this._dataItems;

    }

    private _dataItems: DataItem[] = [];



    /**
     * 
     * The constructor.
     * 
     * @param name 
     * @param description
     * @param id 
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
     * Adds a data item.
     * 
     */

    public addDataItem(dataItem: DataItem): void {

        this.dataItems.push(dataItem);

    }

}
