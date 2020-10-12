import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as cors from "cors";
import * as morgan from "morgan";

import { CellAPI, ICellAPI } from "./lib/cellapi";
import { CellObject } from "./lib/libcellbackend/libcell/cellobject";
import { CellError } from "./lib/libcellbackend/libcell/cellerror";
import { Catalog } from "./lib/libcellbackend/libcell/catalog";
import { GridderJob } from "./lib/libcellbackend/libcell/gridderjob";


/*

    Environment

*/

const apiId: string = `api-${process.env.DOCKER_HOST}-${process.env.HOSTNAME}`;

console.log(`
-----------------------------
Starting CellAPI ID:    ${apiId}
Build:                  ${process.env.VERSION}
Mode:                   ${process.env.NODE_ENV}
Node memory:            ${process.env.NODE_MEMORY}
-----------------------------
`);



// Server class

class HttpServer {
    public app: express.Application;
    public router: express.Router;
    private _cellAPI: CellAPI;


    // Bootstrap

    public static bootstrap(): HttpServer {
        return new HttpServer();
    }


    // Server initialization.

    constructor() {
        this.app = express();

        // Configure express and logging stuff
        this.ExpressConfiguration();

        // Configure routes
        this.apiRoutes();

        // Initialializing the CellAPI
        const iCellAPI: ICellAPI = {

            id: apiId,
            cellDsConnection: {
                db: process.env.CELLDS_DB,
                description: null,
                host: process.env.CELLDS_HOST,
                longdescription: null,
                name: null,
                pass: process.env.CELLDS_PASS,
                port: +process.env.CELLDS_PORT,
                user: process.env.CELLDS_USER
            },
            pgPoolSize: +process.env.POOL_SIZE,
            redisUrl: process.env.REDIS_URL,
            redisPort: +process.env.REDIS_PORT,
            redisPassword: process.env.REDIS_PASS,
            redisTimeOut: +process.env.REDIS_TIMEOUT,
            redisQueueApiWorker: process.env.REDIS_QUEUE_API_WORKER,
            redisQueueWorkerApi: process.env.REDIS_QUEUE_WORKER_API,
            workersHeartbeat: +process.env.WORKERS_HEARTBEAT_MINUTES * 60 * 1000

        };

        this._cellAPI = new CellAPI(iCellAPI);

    }



    /*

        Express configuration.

    */

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

        Routes.

    */

    private apiRoutes() {
        this.router = express.Router();


        /*

            Returns server status

        */

        this.router.get("/admin/status", (req, res, next) => {

            return res.json({
                mode: process.env.NODE_ENV,
                build: process.env.VERSION,
                nodeid: apiId,
                nodememory: process.env.NODE_MEMORY
            });

        });



        /*

            Returns active workers

        */

        this.router.get("/admin/workers", (req, res, next) => {

            this._cellAPI.getWorkers()
            .then((workers: any) => {

                return res.json({
                    workers: workers,
                    time: new Date().getTime()
                });

            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            Testbed.

        */

        this.router.get("/admin/testbed", (req, res, next) => {
            return res.json({
                out: this._cellAPI.testbed()
            });
        });


        /*

            Sets a CellDS object.

        */

        this.router.post("/admin/set/:type/:id", (req, res, next) => {

            const body: any = req.body;
            const type: string = req.params.type;
            const id: string = req.params.id;

            this._cellAPI.set(type, id, body)
            .then((cellobject: CellObject) => {
                return res.json({
                    id: cellobject.id, type: cellobject.type,
                    cellobject: cellobject.persist
                });
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            List a type of CellObject

        */

        this.router.get("/admin/list/:type", (req, res, next) => {

            const type: string = req.params.type;


            this._cellAPI.list(type)
            .then((list: any[]) => {

                return res.json({
                    list: list
                });

            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            Gets a CellDS object.

        */

        this.router.get("/admin/get/:type/:id", (req, res, next) => {

            const type: string = req.params.type;
            const id: string = req.params.id;

            this._cellAPI.get(type, id)
            .then((cellobject: CellObject) => {
                return res.json({
                    id: cellobject.id, type: cellobject.type,
                    cellobject: cellobject.persist
                });
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            Deletes a CellDS object.

        */

        this.router.get("/admin/del/:type/:id", (req, res, next) => {

            const type: string = req.params.type;
            const id: string = req.params.id;

            this._cellAPI.del(type, id)
            .then((cellobject: CellObject) => {

                return res.json({
                    id: cellobject.id, type: cellobject.type
                });

            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            Builds a catalog

        */

        this.router.get("/admin/buildcatalog/:id", (req, res, next) => {

            const id: string = req.params.id;

            this._cellAPI.buildCatalog(id)
            .then((catalog: Catalog) => {
                return res.json({
                    id: catalog.id, type: catalog.type,
                    cellobject: catalog.persist
                });
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            Starts a GridderJob

        */

        this.router.get("/admin/startgridderjob/:id", (req, res, next) => {

            const id: string = req.params.id;

            this._cellAPI.startGridderJob(id)
            .then((gridderJob: GridderJob) => {
                return res.json({
                    id: gridderJob.id, type: gridderJob.type,
                    cellobject: gridderJob.persist
                });
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });


        /*

            Gets info of a GridderJob

        */

        this.router.get("/admin/gridderjobinfo/:id", (req, res, next) => {

            const id: string = req.params.id;

            this._cellAPI.infoGridderJob(id)
            .then((info: any) => {
                return res.json(info);
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });



        /*

            Stops a GridderJob

        */

        this.router.get("/admin/stopgridderjob/:id", (req, res, next) => {

            const id: string = req.params.id;

            this._cellAPI.stopGridderJob(id)
            .then((gridderJob: GridderJob) => {
                return res.json({
                    id: gridderJob.id, type: gridderJob.type,
                    cellobject: gridderJob.persist
                });
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });



        /*

            Get cells

        */

        this.router.post("/cells", (req, res, next) => {

            const body: any = req.body;

            this._cellAPI.getCells(body)
            .then((c: any) => {
                return res.json(c);
            })
            .catch((error: CellError) => {
                console.log(error.explanation);
                return res.status(500).send({ error: error.message });
            });

        });




        // /*

        //     Get variable statistics

        // */

        // this.router.get("/admin/varstats/:id", (req, res, next) => {

        //     const id: string = req.params.id;

        //     this._cellAPI.varstats(id)
        //     .then((out) => {
        //         return res.json(out);
        //     })
        //     .catch((error: CellError) => {
        //         console.log(error.explanation);
        //         return res.status(500).send({ error: error.message });
        //     });

        // });

        // Routes definitions ends here

        this.app.use("/api/", this.router);

    }

}




// Initialize

const port: number = +process.env.PORT || 8080;
let httpserver = HttpServer.bootstrap();
let app = httpserver.app;
app.set("port", port);

// Now initialize server from App
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);





/**
 * Helpers
 */

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    console.log("Listening on " + bind);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

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
