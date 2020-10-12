/*

    This object centralizes all database connections.

    It's the only one authorized to create new pools.

*/

import { PostGIS, IPostGIS } from "./postgis";
import { sha256 } from "js-sha256";


// Class

export class DBConnections {

    // Members
    private _connections: { [hash: string]: PostGIS };


    // Constructor
    constructor() {
        this._connections = {};
    }


    // Creates a new PostGIS object with a hash
    public createNewConnection(definition: IPostGIS): string {
        const db: PostGIS = new PostGIS(definition);
        const hash: string = this.getHash(definition);

        this._connections[hash] = db;
        return hash;
    }


    // Drops a connection
    public dropConnectionByDefinition(definition: IPostGIS): void {
        delete this._connections[this.getHash(definition)];
    }


    // Drops a connection
    public dropConnectionByHash(hash: string): void {
        delete this._connections[hash];
    }


    // Gets a connection
    public getConnectionByDefinition(definition: IPostGIS): PostGIS {
        return this._connections[this.getHash(definition)];
    }


    // Gets a connection
    public getConnectionByHash(hash: string): PostGIS {
        return this._connections[hash];
    }


    // Generates a hash
    private getHash(definition: IPostGIS): string {
        return sha256(`${definition.host}${definition.port}${definition.user}${definition.password}${definition.database}`);
    }
}