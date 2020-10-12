
        // /*

        //     Deletes the DBStatus database.

        // */

        // this.router.get("/deletedbstatus", (req, res, next) => {

        //     this._cellGridderController.deleteDbStatus()
        //     .then(output => {
        //         console.log(output.description);
        //         return res.json(output);
        //     })
        //     .catch(output => {
        //         console.log(output);
        //         return res.json(output);
        //     });

        // });


        // /*

        //     Creates DBStatus.

        // */

        // this.router.get("/createdbstatus", (req, res, next) => {
        //     this._cellGridderController.createDbStatus()
        //     .then(output => {
        //         console.log(output.description);
        //         return res.json(output);
        //     })
        //     .catch(output => {
        //         console.log(output);
        //         return res.json(output);
        //     });
        // });


        // /*

        //     Starts a job.

        //     Needs a JSON payload described at the IJob interface.

        // */

        // this.router.post("/publishjob", (req, res, next) => {
        //     this._cellGridderController.publishJob(req.body)
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


        // /*

        //     Returns jobs.

        // */

        // this.router.get("/jobs/:status?", (req, res, next) => {
        //     this._cellGridderController.getJobs(req.params.status)
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



        //           /**
        //  *
        //  * TEST ZONE
        //  *
        //  */



        // // /*

        // //     Creates a CellDS database.

        // // */

        // // this.router.post("/createcellds", (req, res, next) => {
        // //     const config: PoolConfig = {
        // //         host: req.body.dataSource.host,
        // //         port: req.body.dataSource.port,
        // //         user: req.body.dataSource.user,
        // //         password: req.body.dataSource.pass,
        // //         database: req.body.dataSource.db
        // //     };

        // //     this._cellGridderController.createCellDs(config, req.body.cellDsName)
        // //     .then(output => {
        // //         console.log(output.description);
        // //         return res.json({
        // //             output: output
        // //         });
        // //     })
        // //     .catch(output => {
        // //         console.log(output);
        // //         return res.json({
        // //             output: output
        // //         });
        // //     });
        // // });


        // /*

        //     Creates a grid in a CellDS database

        // */

        // this.router.post("/creategrid", (req, res, next) => {
        //     this._cellGridderController.createGrid(req.body)
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




        // // this.router.get("/test", (req, res, next) => {

        // //     this._cellGridderController.getCellsInArea(null, null, null);

        // // });