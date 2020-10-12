/*

    Class to store PG connection details

*/

import { IPersistable } from "./ipersistable";
import { CellObject, ICellObject } from "./cellobject";


/*

    Definition interface

*/

export interface IPgConnection extends ICellObject {
    host: string;
    port: number;
    user: string;
    pass: string;
    db: string;
}


/*

    Class

*/

export class PgConnection extends CellObject implements IPersistable {

    /*

        Private members

    */

    // Host
    private _host: string;

    // Port
    private _port: number;

    // User
    private _user: string;

    // Password
    private _pass: string;

    // Database
    private _db: string;


    /*

        Getters & setters

    */

    get host(): string {
        return this._host;
    }

    get port(): number {
        return this._port;
    }

    get user(): string {
        return this._user;
    }

    get pass(): string {
        return this._pass;
    }

    get db(): string {
        return this._db;
    }

    get persist(): IPgConnection {

        const base: ICellObject = super.persist;

        (<IPgConnection>base).db = this._db;
        (<IPgConnection>base).host = this._host;
        (<IPgConnection>base).port = this._port;
        (<IPgConnection>base).user = this._user;
        (<IPgConnection>base).pass = this._pass;

        return <IPgConnection>base;

    }


    /*

        Constructor

    */

    constructor(id: string, init: IPgConnection) {

        super(id, init);

        this._type = "PgConnection";
        this._host = init.host;
        this._port = init.port;
        this._user = init.user;
        this._pass = init.pass;
        this._db = init.db;
    }

}