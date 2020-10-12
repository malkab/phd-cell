/*

    DataSet class.

    This class represents a connection to a PostGIS dataset (a table or view).

*/

import { IDataSource, DataSource } from "./datasource";
import { PostGIS } from "./postgis";

/*

    Definition interface

*/

export interface IDataSet {

    dataSource: IDataSource;
    dataSet: string;

}


/*

    Class

*/

export class DataSet {

    /*

        Members

    */

    private _definition: IDataSet;
    private _dataSource: DataSource;
    private _dataSet: string;


    /*

        Constructor

    */

    constructor(def: IDataSet) {

        this._definition = def;
        this._dataSet = def.dataSet;
        this._dataSource = new DataSource(def.dataSource);

    }


    /*

        Inits the connection

        initPool: optional, number of pool connections, defaults to 5

    */

    public initPool(initPool: number = 5): void {

        this._dataSource.initPool(initPool);

    }


    /*

        Closes the connection

    */

    public async closePool(): Promise<PostGIS> {

        return this._dataSource.closePool();

    }


    /*

        Gets unique values for a column in the dataset

        columnName: name of the column to explore

    */

    public getUniqueValues(columnName: string): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            this._dataSource.postgis.executeQuery(
                `select distinct ${columnName} from ${this._dataSet}`,
            )
            .then((rows) => {
                let out: string[] = [];

                for (let r of rows.rows) {
                    out.push(r[columnName]);
                }

                resolve(out);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }

}