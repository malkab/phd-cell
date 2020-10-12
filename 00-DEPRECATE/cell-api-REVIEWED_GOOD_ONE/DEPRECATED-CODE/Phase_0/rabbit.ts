/*

    Class for interfacing with RabbitMQ

*/

import * as amqp from "amqplib";


export class CellRabbit {
    // Connection
    private conn: amqp.Connection;
    private channel: amqp.Channel;


    // Constructor
    constructor(url: string) {
        amqp.connect(url)
        .then((conn: amqp.Connection) => {
            // Create connection
            this.conn = conn;

            return this.conn.createChannel();
        })
        .error((err: any) => {
            console.log("Error");
        })
        .then((ch: any) => {
            console.log("RabbitMQ channel created.");
            this.channel = ch;
        })
        .error((err: any) => {
            console.log("Error");
        })
        .then(() => {
            return this.channel.assertQueue("works", { durable: false });
        })
        .then(() => {
            console.log("Queue works created.");
        })
        .error((err: any) => {
            console.log("Error creating queue works");
        })
        .then(() => {
            return this.channel.assertQueue("logs", { durable: false });
        })
        .then(() => {
            console.log("Queue logs created.");
        })
        .error((err: any) => {
            console.log("Error creating queue logs");
        })
        .then(() => {
            // Start listening to the logs
            console.log("Waiting for messages in logs.");

            this.channel.consume("logs", (msg) => {
                console.log(" [x] Received %s", msg.content.toString());
            }, { noAck: true });
        });
    }


    // Sends a message to queue works
    public sendJob(message: any): any {
        this.channel.sendToQueue("works", new Buffer(JSON.stringify(message)));
    }
}
