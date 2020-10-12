/*

    Persistence control class

*/

import { PostGIS } from "./services/postgis";
import { Redis } from "./services/redis";
import { QueryResult } from "pg";
import { RedisClient } from "redis";
import { resolve } from "path";


export class Persistence {

    /*

        Private members

    */

    private _pgHost: string;
    private _pgPort: number;
    private _pgUser: string;
    private _pgPass: string;
    private _pgDb: string;
    private _pgTable: string;
    private _pgKeyColumn: string;
    private _pgDataColumn: string;
    private _pgMaxConnections: number;

    private _redisUrl: string;
    private _redisPass: string;

    private _postgis: PostGIS = null;
    private _redis: Redis = null;



    /*

        Getters and setters

    */

    get redisUrl(): string {
        return this._redisUrl;
    }

    get redisPass(): string {
        return this._redisPass;
    }



    /*

        Public functions

    */

    /*

        Setup PostgreSQL client

    */

    public initPg(pgHost: string, pgPort: number, pgUser: string, pgPass: string,
    pgDb: string, pgTable: string, pgKeyColumn: string, pgDataColumn: string, pgMaxConnections: number): Persistence {

        this._pgHost = pgHost;
        this._pgPort = pgPort;
        this._pgUser = pgUser;
        this._pgPass = pgPass;
        this._pgDb = pgDb;

        // Prevent SQL injection

        if (
            pgTable.indexOf(";") === -1 &&
            pgKeyColumn.indexOf(";") === -1 &&
            pgDataColumn.indexOf(";") === -1
        ) {
            this._pgTable = pgTable;
            this._pgKeyColumn = pgKeyColumn;
            this._pgDataColumn = pgDataColumn;
        } else {
            throw new Error("Invalid table or column names");
        }

        this._postgis = new PostGIS(pgHost, pgPort, pgUser, pgPass, pgDb);
        this._postgis.initPool(pgMaxConnections);

        return this;

    }




    /*

        Setup Redis client

    */

    public initRedis(redisUrl: string, redisPort: number, redisPass: string, errorCallback: any, redisDb?: number): Persistence {

        this._redisUrl = redisUrl;
        this._redisPass = redisPass;

        this._redis = new Redis(redisUrl, redisPort, redisPass, errorCallback, redisDb);

        return this;

    }


    /*

        Get keys in Redis

    */

    public redisKeys(keys: string): Promise<string[]> {

        return this._redis.keys(keys);

    }


    /*

        Uses the Redis client to subscribe to a message channel

    */

    public redisSubscribeJSON(channel: string, callback: any): RedisClient {

        this._redis.subscribeJSON(channel, callback);

        return this._redis.client;

    }

    /*

        Sets a key to both Redis and PostGIS

    */

    public set(key: string, value: any,
        timeout?: number, forceTimeout?: boolean
    ): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            this.pgSet(key, value)
            .then((success) => {
                return this.redisSet(key, value, timeout, forceTimeout);
            })
            .then((sucess) => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Gets a key with Redis cache enabled

    */

    public get(key: string): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this.redisGet(key)
            .then((success) => {

                if (success) {

                    resolve(success);

                } else {

                    this.pgGet(key)
                    .then((success) => {

                        resolve(success);

                    })
                    .catch((error) => {
                        reject(error);
                    });

                }

            })
            .catch((error) => {

                reject(error);

            });

        });

    }


    /*

        Gets a list of keys

        getKeySet([key0, key1, ... , keyn])

        UNFINISHED, FINISH AND TEST

    */

    public getKeySet(keys: string[]): Promise<any[]> {

        return new Promise<any[]>((resolve, reject) => {

            const promises: Promise<any>[] = [];

            for (let i in keys) {

                promises.push(this.get(i));

            }

            Promise.all(promises)
            .then((values) => {
                resolve(values);
            })
            .catch((error) => {

                reject(error);

            });

        });

    }


    /*

        Gets a key from Redis

    */

    public redisGet(key: string): Promise<any> {

        return this._redis.getJSON(key);

    }


    /*

        Get a family of Redis keys in JSON.

        Returns a hashmap of key: value with the JSON object.

        Example: redisGetKeys("GridderJob:*")

    */

    public redisGetKeys(key: string): Promise<{ [ key: string ]: any }> {

        return new Promise<{ [ key: string ]: any }>((resolve, reject) => {

            const out: { [ key: string ]: any } = {};
            const promises: Promise<any>[] = [];

            // Get keys

            this.redisKeys(key)
            .then((keys: string[]) => {

                // Iterate keys and get their values

                for (let i of keys) {

                    promises.push(this._redis.getJSON(i));

                }

                Promise.all(promises)
                .then((values) => {

                    for (let i in keys) {

                        out[keys[i]] = values[i];

                    }

                    resolve(out);

                })
                .catch((error) => {

                    reject(error);

                });

            });

        });

    }

    /*

        Gets a key from PostGIS

    */

    public pgGet(key: string): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            const sql: string = `
                select ${this._pgDataColumn} as data
                from ${this._pgTable}
                where ${this._pgKeyColumn} = $1;`;

            this._postgis.executeParamQuery(sql, [ key ])
            .then((success) => {

                if (success.rowCount > 0) {

                    resolve(success.rows[0].data);

                } else {

                    reject(new Error(`No ${key} key`));

                }

            });

        });

    }


    /*

        Sets a key in PostGIS

    */

    public pgSet(key: string, value: any): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            const sql: string = `
                insert into ${this._pgTable}
                    (${this._pgKeyColumn}, ${this._pgDataColumn})
                values ($1, $2)
                on conflict (${this._pgKeyColumn})
                do update set ${this._pgDataColumn} = $2
                returning *;`;

            this._postgis.executeParamQuery(sql, [ key, value ])
            .then((success) => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Sets a key in Redis

    */

    public redisSet(key: string, value: any,
        timeout?: number, forceTimeout?: boolean
    ): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            this._redis.setJSON(key, value, timeout, forceTimeout)
            .then((success) => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Close connections

    */

    public close(): void {

        if (this._redis) { this._redis.client.quit(); }
        if (this._postgis) { this._postgis.closePool(); }

    }


    /*

        Returns a set of keys based on a Redis-like term

    */

    public getKeyList(keyExpression: string): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            const keyEx: string = keyExpression.replace("*", "%");

            const sql: string = `
                select ${this._pgKeyColumn} as key
                from ${this._pgTable}
                where ${this._pgKeyColumn} like $1;
            `;

            this._postgis.executeParamQuery(sql, [ keyEx ])
            .then((result) => {

                resolve(result.rows.map((i) => { return i.key; }));

            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Returns a dictionary key: value of a set of keys based on a Redis-like term

    */

    public getKeys(keyExpression: string): Promise<{ [ key: string ]: any }> {

        return new Promise<{ [ key: string ]: any }>((resolve, reject) => {

            const out: { [ key: string ]: any } = {};

            this.getKeyList(keyExpression)
            .then((keys: string[]) => {

                const promises: Promise<any>[] = [];

                for (let k of keys) { promises.push(this.get(k)); }

                Promise.all(promises)
                .then((values) => {
                    for (let k in keys) {
                        out[keys[k]] = values[k];
                    }

                    resolve(out);
                })
                .catch((error) => {
                    reject(error);
                });

            });

        });

    }


    /*

        Deletes a key

    */

    public del(key: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            this.pgDel(key)
            .then((success) => {

                return this.redisDel(key);

            })
            .then((success) => {

                resolve(true);

            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Deletes a key in PostGIS

    */

    public pgDel(key: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            const sql: string = `
                delete from ${this._pgTable}
                where ${this._pgKeyColumn} = $1;`;

            this._postgis.executeParamQuery(sql, [ key ])
            .then((success) => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Sets a key in Redis

    */

    public async redisDel(key: string): Promise<number> {

        // try {

        //     return await this._redis.del(key);

        // } catch (error) {

        //     throw(error);

        // }

        return new Promise<number>((resolve, reject) => {

            this._redis.del(key)
            .then((success) => {
                resolve(success);
            })
            .catch((error) => {
                reject(error);
            });

        });

    }


    /*

        Waits for a message in queue

    */

    public redisPullJSON(queueKey: string[], timeout: number): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this._redis.brpop(queueKey, timeout)
            .then((result) => {

                if (result) {

                    resolve(JSON.parse(result[1]));

                } else {

                    resolve(result);

                }

            })
            .catch((error) => { reject(error); });

        });

    }


    /*

        Pushes a message into a queue

        Returns: a promise with the number of elements in the queue

    */

    public redisPushJSON(queueKey: string, message: any): Promise<number> {

        return new Promise<number>((resolve, reject) => {
            this._redis.lpush(queueKey, JSON.stringify(message))
            .then((result) => { resolve(result); })
            .catch((error) => { reject(error); });
        });

    }



    /*

        Passes a param query to the PostgreSQL

    */

    public pgExecuteParamQuery(sql: string, params: any[]): Promise<QueryResult> {

        return this._postgis.executeParamQuery(sql, params);

    }


    /*

        Executes arbitrary query on the PostgreSQL

    */

    public pgExecuteQuery(sql: string): Promise<QueryResult> {

        return this._postgis.executeQuery(sql);

    }


    /*

        Publishes a message on a Redis PUB/SUB channel

    */

    public redisPublishJSON(channel: string, message: any): void {

        this._redis.publishJSON(channel, message);

    }



    /*

        Performs a rpush Redis command

    */

    public redisRPush(key: string, value: string): Promise<number> {

        return this._redis.rpush(key, value);

    }



    /*

        Gets the a full list from Redis

    */

    public redisLRANGE(key: string, low: number, high: number): Promise<string[]> {

        return this._redis.lrange(key, low, high);

    }


    /*

        Increases a Redis numeric key by a value of 1

    */

    public redisIncr(key: string): Promise<number> {

        return this._redis.incr(key);

    }



    /*

        Increases a tag in a hash by an amount

    */

    public async redisHINCRBY(key: string, hash: string, amount: number): Promise<number> {

        return this._redis.hincrby(key, hash, amount);

    }



    /*

        Sets a tag in a hash

    */

    public async redisHSET(key: string, hash: string, value: string): Promise<number> {

        return this._redis.hset(key, hash, value);

    }



    /*

        Gets a hashmap from the underlying Redis

    */

    public async redisHGETALL(key: string): Promise<any> {

        return this._redis.hgetall(key);

    }

}