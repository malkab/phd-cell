/*

    Variable object

*/

import { CellDS, CellDSObjectDefinition, cellDSObjectTypes } from "./cellds";
import { CellDSObject } from "./celldsobject";
import { miniHash } from "./utils";
import { DataSource } from "./datasource";
import { Catalog } from "./catalog";


/*

    Definition interfaces

*/

export interface IVariable extends ICellDSObjectDefinition {
    params: {
        table: string;
        minihash: string;
        datasource: string;
        lineage: {
            operation: string;
            params: IAggArea;
        }
    };
}

/*

    Operations interface

*/

interface IAggArea {
    geom: string;
    columns: [
        {
            name: string;
            catalog: string;
        }
    ];
}



/*

    Variable class

*/

export class Variable extends CellDSObject {

    /*

        Members

    */

    // Minihash for the data.data table
    private _miniHash: string;


    /*

        Getters & Setters

    */

    get payload(): any {
        return { minihash: this._miniHash };
    }


    /*

        Main constructor

    */

    constructor(parentCellDS: CellDS) {
        super(parentCellDS);
        this.type = cellDSObjectTypes.Variable;
    }


    /*

        Write to CellDS

        return: a promise with the grid hash if successfull

    */

    public async writeToCellDS(): Promise<Variable> {

        return new Promise<Variable>((resolve, reject) => {

            this.parentCellDS.postgis.executeParamQuery(`
                insert into meta.variable
                values ($1, $2, $3, $4, $5)`,
                [ this.hash, this._miniHash, this.name, this.description,
                  this.creationParams.params ]
            )
            .then(result => { resolve(this); })
            .catch(error => { reject(error); });
        });

    }


    /*

        Writes itself and all other data to Redis

    */

    public async writeToRedis(): Promise<string> {

        return new Promise<string> ((resolve, reject) => {

            // Write catalogs
            for (let col of this.creationParams.params.lineage.params.columns) {
                const cat = new Catalog(this.parentCellDS);
                cat.dbInit(col.catalog)
                .then((catalog) => { catalog.writeToRedis(); })
                .catch((error) => { reject(error); });
            }

            super.writeToRedis()
            .then((result) => {
                const dataSource = new DataSource(this.parentCellDS);

                return dataSource.dbInit(this.creationParams.params.datasource);
            })
            .then((datasource) => {
                return datasource.writeToRedis();
            })
            .then((datasource) => { resolve(datasource); })
            .catch((error) => { reject(error); });

        });

    }


    /*

        Gets all minihashes currently present at the variable
        and the catalog tables

    */

    public async getMiniHashes(): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            this.parentCellDS.postgis.executeQuery(`
                with minihashes as(
                    select minihash from meta.variable
                    union all
                    select minihash from meta.catalog
                )
                select array_agg(minihash) as minihashes
                from minihashes
            `)
            .then((results) => {
                resolve(results.rows[0].minihashes);
            })
            .catch((error) => {
                reject(error);
            });

        });
    }


    /*

        Constructor from definition

        definition: optional definition interface

    */

    public async definitionInit(definition: IVariable): Promise<Variable> {

        return new Promise<Variable>((resolve, reject) => {

            super.definitionInit(definition)
            .then((success: CellDSObject) => {
                return this.getMiniHashes();
            })
            .then((miniHashes: string[]) => {

                // Calculate minihash only if null
                if (!this._miniHash) {
                    if (miniHashes === null) { miniHashes = []; }
                    this._miniHash = miniHash(this.hash, miniHashes);
                }

                resolve(this);

            })
            .catch((error: any) => {
                reject(error);
            });

        });

    }



