/*

    This class manages communication from and to workers

*/

import { Persistence } from "./libpersistence/persistence";
import { IMessage } from "./libcellbackend/message";
import { CellError, ECellErrorCode } from "./libcellbackend/libcell/cellerror";



export class Workers {

    /*

        Private members

    */

    // Message queues
    private _queueApiWorker: string;
    private _queueWorkerApi: string;

    // Persistence API - Worker
    private _persistenceApiWorker: Persistence;

    // Persistence Worker - API
    private _persistenceWorkerApi: Persistence;

    // Heartbeat
    private _heartBeat: number;

    // General persistence
    private _persistence: Persistence;



    /*

        Getters & Setters

    */

    get heartBeat(): number {

        return this._heartBeat;

    }


    /*

        Constructor

    */

    constructor(
        heartBeat: number,
        queueApiWorker: string, 
        queueWorkerApi: string,
        persistence: Persistence,
        redisUrl: string, 
        redisPort: number, 
        redisPass: string, 
        errorCallback: any
    ) {

        this._heartBeat = heartBeat;

        this._queueApiWorker = queueApiWorker;
        this._queueWorkerApi = queueWorkerApi;

        this._persistenceApiWorker = new Persistence();
        this._persistenceWorkerApi = new Persistence();
        this._persistence = persistence;

        this._persistenceApiWorker.initRedis(redisUrl, redisPort, 
            redisPass, errorCallback);

        this._persistenceWorkerApi.initRedis(redisUrl, redisPort,
            redisPass, errorCallback);

    }



    /*

        Public members

    */

    // Starts the worker-API message loop

    public workerApiLoop(): void {

        this._persistenceWorkerApi.redisPullJSON(
            [ this._queueWorkerApi ], 0
        )
        .then((message: any) => {

            console.log("Message from worker");
            console.log(message);

            this.workerApiLoop();

        });

    }



    // Sends a message to the workers

    public sendWorkerMessage(message: IMessage): void {

        this._persistenceApiWorker.redisPushJSON(
            this._queueApiWorker,
            message
        );

    }



    /*

        Gets worker activity information from persistence

    */

    public getWorkers(): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            // Get worker activity keys

            this._persistence.getKeys("worker-activity:%")
            .then((workers) => {

                // Set a structure for output

                const out: any = {
                    alive: [],
                    dead: []
                }

                // Iterate workers

                for (let a in workers) {

                    // Get worker from dict

                    const worker = workers[a];

                    // Get current time

                    const time: number = new Date().getTime();

                    // Check worker for aliveness likeness based on 
                    // time after last heartbeat

                    if ( time - worker.time > this._heartBeat ) {

                        // It's dead!

                        // Get last heartbeat
                        worker.last_activity = new Date(worker.time);

                        out.dead.push(worker);

                    } else {

                        // It's alive!
                        // Translate status

                        // Get last heartbeat
                        worker.last_activity = new Date(worker.time);

                        if (worker.typeCode === 100) {

                            worker.status = "IDLE";

                        } else {

                            worker.status = "ACTIVE";

                        }

                        out.alive.push(worker);

                    }

                }

                // Resolve

                resolve(out);
                
            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    "Error retrieving workers status",
                    error));

            });

        })
    }


}