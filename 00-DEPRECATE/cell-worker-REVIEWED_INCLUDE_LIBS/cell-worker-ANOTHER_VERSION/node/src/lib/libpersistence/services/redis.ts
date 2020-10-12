/*

    Generic Redis services

    The goal of this class is just to provide Redis services
    but not to contain any application logic, making it
    reusable

*/

import * as redis from "redis";



// Class
export class Redis {

    // Members
    private _url: string;
    private _port: number;
    private _pass: string;
    private _client: redis.RedisClient;


    /*

        Getters & setters

    */

    get client(): redis.RedisClient {

        return this._client;

    }


    // Constructor
    constructor(url: string, port: number, password: string, errorCallback: any, db?: number) {

        this._url = url;
        this._pass = password;
        this._port = port;

        this._client = redis.createClient(this._url, { password: password, db: db, port: port });

        this._client.on("error", function(err: Error) {
            errorCallback(err);
        });

    }


    /*

        Kills the client.

    */
    public quit(): void {
        this._client.quit();
    }


    /*

        Sets a key to a stringified JSON with an optional timeout
        and the option to not set the timeout if the key is
        already persistent.

        key: a string
        json: the JSON to stringify
        returns: a Promise with the key
        timeout: the timeout in seconds
        setTimeOutIfPersistent: true sets the time out even if
            the key is persistent, false otherwise

    */
    public setJSON(key: string, json: any, timeout?: number,
        forceTimeout?: boolean): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            // Check if timeout is set
            if (!timeout) {

                this._client.set(key, JSON.stringify(json),
                (error, result) => {

                    if (error) { reject(error); }

                    resolve(true);

                });

            } else {

                this._client.ttl(key, (error, ttl) => {

                    if (error) { reject(error); }

                    if (ttl === -1 && !forceTimeout) {

                        this._client.set(key, JSON.stringify(json),
                        (error, result) => {
                            if (error) { reject(error); }

                            resolve(true);
                        });

                    } else {

                        this._client.setex(key, timeout, JSON.stringify(json),
                        (error, result) => {

                            if (error) { reject(error); }

                            resolve(true);

                        });

                    }

                });

            }

        });

    }


    /*

        Get keys.

        key: a string with the key pattern
        returns: a Promise with an array with keys

    */

    public keys(key: string): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            this._client.keys(key, (err: any, reply: string[]) => {

                // Check for error
                if (err) {
                    reject(err);
                }

                resolve(reply);

            });

        });

    }


    /*

        Gets a key that is treated as a JSON.

        key: the key to retrieve
        returns: an object

    */

    public getJSON(key: string): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this._client.get(key, (err: any, reply: string) => {

                // Check for error
                if (err) {
                    reject(err);
                }

                resolve(JSON.parse(reply));

            });

        });

    }


    /*

        Waits for a BRPOP

        key: the list to BRPOP
        timeout: optional, defaults to 0

    */

    public brpop(key: string[], timeout: number): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            // Deep copy key and add timeout
            let keys: any[] = [];
            key.map((x) => { keys.push(x); });
            keys.push(timeout);

            this._client.brpop(keys,
            (err, message) => {

                if (err) {
                    reject(err);
                }

                resolve(message);

            });

        });

    }



    /*

        Performs a RPUSH

    */

    public rpush(key: string, object: any): Promise<number> {

        return new Promise<number> ((resolve, reject) => {

            this._client.rpush( key, object, (err, message) => {

                if (err) { reject(err); }

                resolve(message);

            });

        });

    }


    /*

        Performs a LPUSH

    */

    public lpush(key: string, object: any): Promise<number> {

        return new Promise<number> ((resolve, reject) => {

            this._client.lpush( key, object, (err, message) => {

                if (err) { reject(err); }

                resolve(message);

            });

        });

    }


    /*

        Deletes a key

    */

    public del(key: string): Promise<number> {

        return new Promise<number> ((resolve, reject) => {

            this._client.del(key, (err, value) => {

                if (err) { reject(err); }

                resolve(value);

            });

        });

    }


    /*

        Subscribes to a channel

    */

    public subscribeJSON(channel: string, callback: any): redis.RedisClient {

        this._client.subscribe(channel);

        this._client.on("message",
            (queue: string, message: string) => {

                callback(queue, JSON.parse(message));

            }
        );

        return this._client;

    }


    /*

        Publish to a channel

    */

    public publishJSON(channel: string, message: any) {

        this._client.publish(channel, JSON.stringify(message));

    }


    /*

        LRANGE: gets a range within a list

    */

    public lrange(key: string, first: number, last: number): Promise<string[]> {

        return new Promise<string[]>((resolve, reject) => {

            this._client.lrange(key, first, last, (err, value) => {

                if (err) { reject (err); }

                resolve(value);

            });

        });

    }



    /*

        INCR: increases a numeric key by 1

    */

    public incr(key: string): Promise<number> {

        return new Promise<number>((resolve, reject) => {

            this._client.incr(key, (err, value) => {

                if (err) { reject (err); }

                resolve(value);

            });

        });

    }



    /*

        HINCRBY: increases a tag in a hash by an amount

    */

    public async hincrby(key: string, hash: string, amount: number):
    Promise<number> {

        return new Promise<number>((resolve, reject) => {

            this._client.hincrby(key, hash, amount, (err, value) => {

                if (err) { reject (err); }

                resolve(value);

            });

        });

    }



    /*

        HINCRBY: increases a tag in a hash by an amount

    */

    public async hset(key: string, hash: string, value: string):
    Promise<number> {

        return new Promise<number>((resolve, reject) => {

            this._client.hset(key, hash, value, (err, val) => {

                if (err) { reject (err); }

                resolve(val);

            });

        });

    }



    /*

        HGETALL: get a hash map from Redis

    */

    public async hgetall(key: string): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            this._client.hgetall(key, (err, val) => {

                if (err) { reject (err); }

                resolve(val);

            });

        });

    }

}
