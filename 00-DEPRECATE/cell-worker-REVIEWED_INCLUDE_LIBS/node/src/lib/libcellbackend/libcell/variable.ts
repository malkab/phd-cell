/*

    Variable object.

*/

import { CellObject, ICellObject } from "./cellobject";
import { IPersistable } from "./ipersistable";
import { PgConnection } from "./pgconnection";


/*

    Variable API definition interfaces

*/

interface ILineage {
    operation: string;
    params: any;
}

export interface IVariable extends ICellObject {
    table: string;
    pgconnectionid: string;
    lineage: ILineage;
    stats: any;
    minihash?: string;
}



/*

    Variable class

*/

export class Variable extends CellObject implements IPersistable {

    /*

        Private members

    */

    // The source table
    private _table: string;

    // The PgConnection ID
    private _pgConnectionId: string;

    // The PgConnection
    private _pgConnection: PgConnection;

    // Origin
    private _lineage: ILineage;

    // Minihash
    private _miniHash: string;

    // Stats store
    private _stats: any;



    /*

        Getters and setters

    */

    get persist(): IVariable {

        const base: ICellObject = super.persist;

        (<IVariable>base).table = this._table;
        (<IVariable>base).pgconnectionid = this._pgConnection.id;
        (<IVariable>base).lineage = this._lineage;
        (<IVariable>base).minihash = this._miniHash;
        (<IVariable>base).stats = this._stats;

        return <IVariable>base;

    }

    get miniHash(): string {
        return this._miniHash;
    }

    set miniHash(miniHash: string) {
        this._miniHash = miniHash;
    }

    set pgConnection(pgConnection: PgConnection) {
        this._pgConnection = pgConnection;
    }

    get pgConnectionId(): string {
        return this._pgConnectionId;
    }

    get lineage(): ILineage {
        return this._lineage;
    }

    get table(): string {
        return this._table;
    }

    get pgConnection(): PgConnection {
        return this._pgConnection;
    }

    get stats(): any {

        return this._stats;

    }


    /*

        Constructor

    */

    constructor(id: string, init: IVariable) {

        super(id, init);

        this._table = init.table;

        this._type = "Variable";

        this._pgConnectionId = init.pgconnectionid;

        this._lineage = init.lineage;

        this._miniHash = init.minihash ? init.minihash : null;

        this._stats = {};

    }



    /*

        Set stat item. Takes a stat key and a value and updates it.

        key: string: the stats key

        value: any: the stats value

    */

    public updateStats(key: string, value: any) {

        this._stats[key] = value;

    }

}
