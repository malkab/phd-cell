import { KeeperPrototype }
    from "@malkab/keeper-core";

/*

    Class to store PG connection details

*/

import { CellObject, ICellObject } from "../../src/libcell/cellobject";


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

@KeeperPrototype({

    serialize: {

        members: [ "host" ],
        dependencies: []

    },

    type: "PgConnection"

})
export class PgConnection extends CellObject {

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

    set host(host: string) {
        this._host = host;
    }

    set port(port: number) {
        this._port = port;
    }

    set user(user: string) {
        this._user = user;
    }

    set pass(pass: string) {
        this._pass = pass;
    }

    set db(db: string) {
        this._db = db;
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