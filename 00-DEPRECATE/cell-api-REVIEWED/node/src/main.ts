/*

    -----------------------------------------

    This is the main testing server. This file is used to set up an
    Express server API endpoint to test the library being developed at
    lib.
    
    -----------------------------------------

    No section of this file will be documented by TypeDoc, document the
    API at the src/README.md. The libraries at lib will be documented,
    however.

*/

import * as express from "express";

import * as bodyParser from "body-parser";

import * as cors from "cors";

import * as morgan from "morgan";

import * as http from "http";

import { CellApi } from "./cellapi";



/*

    The Cell API instance.

*/

const cellApi: CellApi = new CellApi();



/*

    The Express class, the entry point.

*/

class HttpServer {

    /* 
    
        Express bootstraping

    */

    public app: express.Application;
    
    public router: express.Router = express.Router();

    public static bootstrap(): HttpServer {
        return new HttpServer();
    }

    constructor() {
        this.app = express();

        // Configure express and logging stuff
        this.ExpressConfiguration();

        // Configure routes
        this.apiRoutes();

    }

    private ExpressConfiguration() {

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        //cors settings
        this.app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
            res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
            next();
        });
        this.app.use(cors());

        // morgan settings
        this.app.use(morgan("dev"));

        // catch 404 and forward to error handler
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });

    }



    /*

        ----------------------------------

        Routes go here

        ----------------------------------

    */

    private apiRoutes() {

        /*

            Status test

        */

        this.router.get("/status", (req, res, next) => {

            return res.status(200).json({ status: "ok" });

        });
        
        /*
        
            Add routers here

        */

        this.app.use("/api/", this.router);

        this.app.use("/cell/", cellApi.router());

        this.app.use("/k/", cellApi.keeperRestApi.router());

    }

}



/*

    Express start up

*/

const port: number = 8080;

let httpserver = HttpServer.bootstrap();

let app = httpserver.app;

app.set("port", port);

const server = http.createServer(app);

server.listen(port);

server.on("error", onError);

server.on("listening", onListening);



/*

    Some helper functions

*/

function onListening() {

    var addr = server.address();

    var bind = typeof addr === 
        "string" ? "pipe " + addr : "port " + addr.port;
    
    console.log("Listening on " + bind);

}

function onError(error: any) {

    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port ===
        "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages

    switch (error.code) {

        case "EACCES":

            console.error(bind + " requires elevated privileges");

            process.exit(1);

            break;
        

        case "EADDRINUSE":

            console.error(bind + " is already in use");

            process.exit(1);

            break;


        default:

            throw error;
    
    }

}
