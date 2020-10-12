import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as http from "http";
import * as cors from "cors";
import * as morgan from "morgan";
import { IPostGIS } from "./lib/postgis";
import { CellGridderController } from "./lib/cellgriddercontroller";





/*

    Environment.

*/

if (process.env.NODE_ENV === "development") {
    console.log("Running CellGridder Controller API in dev mode");
} else {
    console.log("Running CellGridder Controller API in production mode");
}





// Server class

class HttpServer {
    public app: express.Application;
    public router: express.Router;
    private _cellGridderController: CellGridderController;


    // Bootstrap.

    public static bootstrap(): HttpServer {
        return new HttpServer();
    }


    // Server initialization.

    constructor() {
        this.app = express();

        //configure express and logging stuff
        this.ExpressConfiguration();

        //configure routes
        this.apiRoutes();


        // CellGridderController object
        this._cellGridderController =
            new CellGridderController(
                process.env.SQL_SCRIPTS_PATH,
                process.env.RABBIT_URL,
                process.env.DB_STATUS_NAME,
                +process.env.POOL_SIZE,
                process.env.DB_STATUS_DDL_SCRIPT,
                process.env.DB_CELLDS_DDL_SCRIPT,
                this.getStatusDbConnectionConfig());


        // Initial initialization of DB Status
        this._cellGridderController.createDbStatus()
        .then(output => {
            console.log(output.description);
        })
        .catch(output => {
            console.error(output.description);
            console.error(output.payload);
        });
    }





    /**
     *
     * Some helper functions
     *
     */

    private getStatusDbConnectionConfig(): IPostGIS {
        return {
            user: process.env.DB_STATUS_USER,
            password: process.env.DB_STATUS_PASS,
            host: process.env.DB_STATUS_HOST,
            port: +process.env.DB_STATUS_PORT,
            database: process.env.DB_STATUS_DB
        };
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

            Returns server status.

        */

        this.router.get("/status", (req, res, next) => {
            return res.json({
                mode: process.env.NODE_ENV
            });
        });


        /*

            Deletes the DBStatus database.

        */

        this.router.get("/deletedbstatus", (req, res, next) => {

            this._cellGridderController.deleteDbStatus()
            .then(output => {
                console.log(output.description);
                return res.json(output);
            })
            .catch(output => {
                console.log(output);
                return res.json(output);
            });

        });


        /*

            Creates DBStatus.

        */

        this.router.get("/createdbstatus", (req, res, next) => {
            this._cellGridderController.createDbStatus()
            .then(output => {
                console.log(output.description);
                return res.json(output);
            })
            .catch(output => {
                console.log(output);
                return res.json(output);
            });
        });


        /*

            Starts a job.

            Needs a JSON payload described at the IJob interface.

        */

        this.router.post("/publishjob", (req, res, next) => {
            this._cellGridderController.publishJob(req.body)
            .then(output => {
                console.log(output.description);
                return res.json({
                    output: output
                });
            })
            .catch(output => {
                console.log(output);
                return res.json({
                    output: output
                });
            });
        });


        /*

            Returns jobs.

        */

        this.router.get("/jobs/:status?", (req, res, next) => {
            this._cellGridderController.getJobs(req.params.status)
            .then(output => {
                console.log(output.description);
                return res.json({
                    output: output
                });
            })
            .catch(output => {
                console.log(output);
                return res.json({
                    output: output
                });
            });
        });



                  /**
         *
         * TEST ZONE
         *
         */



        // /*

        //     Creates a CellDS database.

        // */

        // this.router.post("/createcellds", (req, res, next) => {
        //     const config: PoolConfig = {
        //         host: req.body.dataSource.host,
        //         port: req.body.dataSource.port,
        //         user: req.body.dataSource.user,
        //         password: req.body.dataSource.pass,
        //         database: req.body.dataSource.db
        //     };

        //     this._cellGridderController.createCellDs(config, req.body.cellDsName)
        //     .then(output => {
        //         console.log(output.description);
        //         return res.json({
        //             output: output
        //         });
        //     })
        //     .catch(output => {
        //         console.log(output);
        //         return res.json({
        //             output: output
        //         });
        //     });
        // });


        /*

            Creates a grid in a CellDS database

        */

        this.router.post("/creategrid", (req, res, next) => {
            this._cellGridderController.createGrid(req.body)
            .then(output => {
                console.log(output.description);
                return res.json({
                    output: output
                });
            })
            .catch(output => {
                console.log(output);
                return res.json({
                    output: output
                });
            });
        });


 

        // this.router.get("/test", (req, res, next) => {

        //     this._cellGridderController.getCellsInArea(null, null, null);

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
