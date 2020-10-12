/*

    Structure to define message between components
    to be send via Redis

*/

// Message types

export enum EMessageType {

    // Workers emit a heartbeat
    WORKERHEARTBEAT = 100,

    // API request a GridderJob to start
    APISTARTGRIDDERJOB = 200,

    // Process GridderSubJob
    PROCESSGRIDDERSUBJOB = 500

}


// Message interface

export interface IMessage {

    typeCode: EMessageType;             // The type code
    idPoster: string;                   // The message poster's ID
    payload: any;                       // Message payload
    time: number;                       // Issue time

}