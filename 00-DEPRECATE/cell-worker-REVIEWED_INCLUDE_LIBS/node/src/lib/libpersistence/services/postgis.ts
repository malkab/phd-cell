/*

    Generic PG services

    The goal of this class is just to provide PG services
    but not to contain any application logic, making it
    reusable

*/

import { PoolConfig, Pool, QueryResult } from "pg";
import { readFile } from  "fs";



// Class

export class PostGIS {

    // Members
    private _host: string;
    private _port: number;
    private _user: string;
    private _password: string;
    private _database: string;
    private _pool: Pool;
    private _maxPoolSize: number;


    // Getters and setters
    get host(): string {
        return this._host;
    }

    get port(): number {
        return this._port;
    }

    get user(): string {
        return this._user;
    }

    get password(): string {
        return this._password;
    }

    get database(): string {
        return this._database;
    }

    get pool(): Pool {
        return this._pool;
    }

    get maxPoolSize(): number {
        return this._maxPoolSize;
    }

    set maxPoolSize(maxPoolSize: number) {
        this._maxPoolSize = maxPoolSize;
    }

    get poolConfig(): PoolConfig {
        return {
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database,
            max: this.maxPoolSize
        };
    }


    // Construct from interface
    constructor(host: string, port: number, user: string, pass: string, db: string) {

        this._host = host;
        this._port = port;
        this._user = user;
        this._password = pass;
        this._database = db;

    }


    // Initialize pool
    public initPool(maxPoolSize: number): PostGIS {

        this.maxPoolSize = maxPoolSize;
        this._pool = new Pool(this.poolConfig);

        this._pool.on("error", (error) => {
            throw error;
        });

        return this;

    }


    // Closes the pool
    public closePool(): void {

        this._pool.end();

    }


    // Creates a database
    public async createDatabase(databaseName: string): Promise<PostGIS> {

        return new Promise<PostGIS>((resolve, reject) => {
            this._pool.query(`create database ${databaseName};`)
            .then(res => {
                resolve(this);
            })
            .catch(error => {
                reject(error);
            });
        });

    }


    // Deletes a database
    public async deleteDatabase(databaseName: string): Promise<PostGIS> {

        return new Promise<PostGIS>((resolve, reject) => {
            this._pool.query(`drop database ${databaseName};`)
            .then(res => {
                resolve(this);
            })
            .catch(error => {
                reject(error);
            });
        });

    }


    // Executes script
    public async executeScript(fileName: string): Promise<PostGIS> {

        return new Promise<PostGIS>((resolve, reject) => {
            readFile(fileName, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                }

                this.executeQuery(data)
                .then(res => {
                    resolve(this);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });

    }


    // Executes an arbitrary query
    public async executeQuery(query: string): Promise<QueryResult> {

        return new Promise<QueryResult>((resolve, reject) => {
            this.pool.connect()
            .then(client => {
                client.query(query)
                .then(res => {
                    client.release();
                    resolve(res);
                })
                .catch(error => {
                    client.release();
                    reject(error);
                });
            })
            .catch(error => {
                reject(error);
            });
        });

    }


    // Returns databases in server

    public async getDatabases(): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {
            this.executeQuery(`
                select * from pg_catalog.pg_database
            `)
            .then((results) => {

                let out: string[] = [];

                for (let db of results.rows) {
                    out.push(db.datname);
                }

                resolve(out);

            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Executes an arbitrary parametrized query:

        query: tag parameters with $X
        values: a list

    */

    public async executeParamQuery(query: string, values: any):
        Promise<QueryResult> {
        return new Promise<QueryResult>((resolve, reject) => {
            this.pool.connect()
            .then(client => {
                client.query(query, values)
                .then(res => {
                    client.release();
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                });
            })
            .catch(error => {
                reject(error);
            });
        });
    }


    /*

        Return distinct values in a column

    */

    public distinct(table: string, column: string,
    ordered?: boolean): Promise<any[]> {

        return new Promise<any[]>((resolve, reject) => {

            if (!ordered) { ordered = true; }

            if (!this._validSQL(table) || !this._validSQL(column)) {
                reject(new Error("Bad table or column"));
            }

            let sql: string = `
                select distinct ${column} as distinct
                from ${table}
            `;

            if (ordered) {
                sql += ` order by ${column}`;
            }

            this.executeQuery(sql)
            .then((results) => {

                resolve(results.rows.map((i) => { return i.distinct; }));

            })
            .catch((error) => {

                reject(error);

            });

        });

    }


    /*

        Private methods

    */

    // Checks for SQL injection patterns

    private _validSQL(sql: string): boolean {

        return sql.indexOf(";") === -1;

    }
}