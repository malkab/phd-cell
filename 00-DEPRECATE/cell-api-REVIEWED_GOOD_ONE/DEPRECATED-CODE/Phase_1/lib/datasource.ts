import { PostGIS, IPostGIS } from "./postgis";
import { CellDSObject } from "./celldsobject";
import { CellDS, ICellDSObjectDefinition, ICellDSObjectList, cellDSObjectTypes } from "./cellds";

/*

    PostGIS data source.

    This class controls a connection to a PostGIS DataSource.

*/

export interface IDataSource extends ICellDSObjectDefinition {
    params: {
        connection: {
            host: string;
            port: string;
            user: string;
            pass: string;
            db: string;
        }
    };
}


/*

    Class

*/

export class DataSource extends CellDSObject {

    /*

        Members

    */

    // PostGIS object to interact with the database
    private _postgis: PostGIS;


    /*

        Main constructor

    */

    constructor(parentCellDS: CellDS) {
        super(parentCellDS);
        this.type = cellDSObjectTypes.DataSource;
    }



    /*

        Constructor from definition

        definition: optional definition interface

    */

    public definitionInit(definition: IDataSource): Promise<DataSource> {

        return new Promise<DataSource>((resolve, reject) => {

            super.definitionInit(definition)
            .then((success) => {

                this._postgis = new PostGIS(
                    <IPostGIS>{
                        host: definition.params.connection.host,
                        port: +definition.params.connection.port,
                        user: definition.params.connection.user,
                        password: definition.params.connection.pass,
                        database: definition.params.connection.db
                    }
                )
                .initPool(5);

                resolve(this);

            })
            .catch((error) => { throw error; });

        });

    }


    /*

        Initialization from database

    */

    public async dbInit(hash: string): Promise<DataSource> {

        return new Promise<DataSource>((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                select
                    *
                from meta.datasource
                where hash=$1`,
                [ hash ])
            .then((result) => {

                if (result.rowCount === 0) {
                    reject(new Error(`DataSource ${hash} not found at CellDS`));
                }

                const data = result.rows[0];

                const def: IDataSource = {
                    description: data.description,
                    name: data.name,
                    params: { connection: data.connection }
                };

                this.definitionInit(def);
                this.hash = hash;

                resolve(this);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Write to CellDS

    */

    public async writeToCellDS(): Promise<DataSource> {

        return new Promise<DataSource>((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                insert into meta.datasource
                values ($1, $2, $3, $4)`,
                [ this.hash, this.name, this.description,
                  this.creationParams.params.connection ]
            )
            .then((success) => { resolve(this); })
            .catch((error) => { console.log(error); reject(error); });

        });

    }


    /*

        Closes the connection

    */

    public async closePool(): Promise<PostGIS> {

        return this._postgis.closePool();

    }


    /*

        Gets unique values for a column in the dataset

        columnName: name of the column to explore

    */

    public getUniqueValues(table: string, columnName: string): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            this._postgis.executeQuery(`
                select distinct ${columnName} from ${table} 
                order by ${columnName}`,
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
