/*

    Variable object.

*/

import { CellObject, ICellObject } from "./cellobject";
import { IPersistable } from "./ipersistable";
import { PgConnection } from "./pgconnection";


/*

    Variable API definition interfaces

*/

/**
 * 
 * Interface for defining the lineage of a variable.
 * 
 * - **operation:** the operation to use, for example IPointsAvgInvDistInterpolationOperator or IPointsAvgValue;
 * 
 * - **params:** specific params for the operation, refer to each operator documentation for details.
 * 
 */

interface ILineage {
    operation: string;
    params: any;
}

/**
 * 
 * Interface for variable definition, extends [[ICellObject]].
 * 
 * - **table:** the table or view holding source data;
 * 
 * - **pgconnectionid:** the [[PgConnectionId]] object containing source data connection details;
 * 
 * - **lineage:** an [[ILineage]] interface defining the variable's lineage;
 * 
 * - **stats:** variable statistics (currently not used);
 * 
 * - **minihash:** variable minihash used by the variable in this CellDS database (WARNING /!\ this is exclusive of THIS  CellDS database and may change if moved to another one).
 * 
 */

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




    /*

        Getters and setters

    */

    get persist(): IVariable {

        const base: ICellObject = super.persist;

        (<IVariable>base).table = this._table;
        (<IVariable>base).pgconnectionid = this._pgConnection.id;
        (<IVariable>base).lineage = this._lineage;
        (<IVariable>base).minihash = this._miniHash;

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

    }

}
