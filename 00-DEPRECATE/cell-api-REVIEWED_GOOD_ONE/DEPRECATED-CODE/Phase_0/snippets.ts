
// import * as cell from "./lib/cell";
// import Bbox from "./lib/bbox";
// import Coordinate from "./lib/coordinate";


    // private cell: cell.CellJS;

            // // Configure Cell instance
        // this.cell = new cell.CellJS();

        // // Hard coded connection
        // this.cell.cellDsCreatePool("localhost", 7800);







                    // amqp.connect("amqp://rabbitmq", (err: any, conn: any) => {
            //     conn.createChannel((err: any, ch: any) => {
            //         console.log("RabbitMQ channel created.");
            //     });
            // });







                    // Get cells
        // Bounds must be expressed in EPSG:4326

        this.router.get("/cells/:gridid/:zoom/:xmin/:ymin/:xmax/:ymax",
        (req, res, next) => {
            // const bbox: Bbox = new Bbox(req.params.epsg,
            //                     new Coordinate("4326", req.params.xmin,
            //                         req.params.ymin),
            //                     new Coordinate("4326", req.params.xmax,
            //                         req.params.ymax));

            // console.log(req.params);

            // this.cell.getCells(req.params.gridid, req.params.zoom, bbox)
            //     .then((cells: any) => {
            //         // const out = {
            //         //     ncells: cells.rows[0].cells_json.features.length,
            //         //     geojson: cells.rows[0].cells_json,
            //         // };

            //         console.log(cells);

            //         const out: any = {
            //             cellCount: cells.rowCount,
            //             gridId: req.params.gridid,
            //             zoom: req.params.zoom,
            //             bbox: bbox,
            //             cells : cells.rows
            //         };

            return res.json({
                mode: process.env.NODE_ENV,
                test: process.env.TEST
            });
        });