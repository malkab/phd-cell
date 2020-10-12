/*

    Catalog object.

*/

import { CellObject, ICellObject } from "./cellobject";
import { PgConnection } from "./pgconnection";
import { sha256 } from "js-sha256";
import { getMiniHash } from "./utils";


/*

    Definition interface

*/

export interface ICatalog extends ICellObject {
    forward?: { [ hash: string ]: string };
    backward?: { [ term: string ]: string };
    pgconnectionid: string;
    table: string;
    column: string;
}


/*

    Catalog class

*/

export class Catalog extends CellObject {

    /*

        Private members

    */

    // Forward catalog, from hash to term
    private _forward: { [ hash: string ]: string } = {};

    // Reverse catalog, from term to hash
    private _backward: { [ term: string ]: string } = {};

    // PG connection ID
    private _pgConnectionId: string;

    // PgConnection
    private _pgConnection: PgConnection;

    // Table
    private _table: string;

    // Column
    private _column: string;



    /*

        Getters and setters

    */

    get forward(): { [ hash: string ]: string } {
        return this._forward;
    }

    get backward(): { [ hash: string ]: string } {
        return this._backward;
    }

    get pgConnectionId(): string {
        return this._pgConnectionId;
    }

    get pgConnection(): PgConnection {
        return this._pgConnection;
    }

    set pgConnection(pg: PgConnection) {
        this._pgConnection = pg;
    }

    get table(): string {
        return this._table;
    }

    get column(): string {
        return this._column;
    }

    get persist(): ICatalog {

        const base: ICellObject = super.persist;

        (<ICatalog>base).column = this._column;
        (<ICatalog>base).pgconnectionid = this._pgConnection.id;
        (<ICatalog>base).table = this._table;
        (<ICatalog>base).forward = this._forward;
        (<ICatalog>base).backward = this._backward;

        return <ICatalog>base;

    }



    /*

        Constructor

    */

    constructor(id: string, init: ICatalog) {

        super(id, init);

        this._pgConnectionId = init.pgconnectionid;
        this._table = init.table;
        this._column = init.column;
        this._forward = init.forward ? init.forward : {};
        this._backward = init.backward ? init.backward : {};
        this._type = "Catalog";

    }


    /*

        Public methods

    */

    // Builds the catalog

    public build(values: string[]): Catalog {

        // Iterate and construct hashes
        for (let i of values) {

            // Check the element is not already in the catalog
            if ( Object.keys(this._forward).indexOf(i) === -1 ) {

                const hash: string = sha256(i);
                const miniHash: string = getMiniHash(hash,
                    Object.keys(this._backward));

                this._forward[i] = miniHash;
                this._backward[miniHash] = i;

            }

        }

        return this;

    }

}