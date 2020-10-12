/*

    Catalog class

    This class is used to hash unique values ocurring in a DataSet
    column.

*/

import { CellDSObject } from "./celldsobject";
import { ICellDSObjectDefinition, ICellDSObjectList, cellDSObjectTypes, ICellDSObjectFull, CellDS } from "./cellds";

import { miniHash } from "./utils";



   /*

        Constructor from definition

        definition: optional definition interface

    */

    public async definitionInit(definition: ICatalog): Promise<Catalog> {

        return new Promise<Catalog>((resolve, reject) => {

            super.definitionInit(definition)
            .then((success: CellDSObject) => {

                this._column = definition.params.column;
                this._table = definition.params.table;
                this._forward = {};
                this._reverse = {};

                this._dataSource = new DataSource(this.parentCellDS);
                return this._dataSource.dbInit(definition.params.datasource);
            })
            .then((datasource: DataSource) => {
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



}

