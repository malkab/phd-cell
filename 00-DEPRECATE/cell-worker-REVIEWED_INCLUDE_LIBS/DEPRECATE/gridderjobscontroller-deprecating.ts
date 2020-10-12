

    /*

        Enters the recieve message loop

    */

    public processMessages(channel: string, message: any): void {

        console.log(`Message from worker:`);
        message = JSON.parse(message);
        console.log(message);

        // Just to decompose the key
        const co: CellObject = new CellObject("dummy", {});
        const key = co.decomposeKey(message.object);

        this._libCellFactory.get(key.type, key.id)
        .then((gridderSubJob: GridderSubJob) => {

            this.log(gridderSubJob, message.status, message.payload);


            // ------------------
            // IAggArea processing
            // ------------------

            if (gridderSubJob.gridderJob.variable.lineage.operation === "IAggArea") {

                // Final results
                if (message.status === EGridderLogStatus.FINALRESULTS ||
                    message.status === EGridderLogStatus.NOGEOMSFOUND) {

                    this.log(gridderSubJob, EGridderLogStatus.RECIEVEDATCONTROLLER, message.payload);

                    // Do if there are results
                    if (message.payload.results != null) {

                        // Set cell data and set the cell in database
                        gridderSubJob.cell.data = message.payload.results;
                        this._cellEditor.set(gridderSubJob.cell);

                        this.log(gridderSubJob, EGridderLogStatus.CELLSUPDATED,
                            { branchesupdated: message.payload.results.length, message: `Total new branches: ${message.payload.results.length}` });

                        // Check zoom level of this cell and check if the job is over
                        // If not, issue new GridderSubJobs
                        const rZoom = gridderSubJob.cell.zoom;
                        const gsjZL = gridderSubJob.gridderJob.zoomLevels;
                        const zlPosition = gsjZL.indexOf(rZoom);

                        // There are still cells to be processed
                        if (zlPosition < (gsjZL.length - 1)) {

                            // Check if results is a single branch with a 1 (100%) coverage

                            const val: any = Object.values(message.payload.results)[0];

                            if (val[0][val[0].length - 1] === 1) {

                                this.log(gridderSubJob, EGridderLogStatus.AREAHUNDREDPERCENT);

                                for (let i = zlPosition + 1 ; i < gsjZL.length ; i++) {

                                    let newCells: Cell[] = gridderSubJob.cell.getSubCells(gsjZL[i]);

                                    newCells.map(cell => {
                                        cell.data = message.payload.results;

                                        this._cellEditor.set(cell);
                                    });

                                    this.log(gridderSubJob, EGridderLogStatus.AREAHUNDREDPERCENTNEWCELLS, { newcells: newCells.length });

                                }

                            } else {

                                // Result is not a 100% coverage

                                const newCells: Cell[] = gridderSubJob.cell.getSubCells(gsjZL[zlPosition + 1]);

                                for (let c of newCells) {
                                    this._publishGridderSubJob(
                                        this._createNewGridderSubJob(c, gridderSubJob.gridderJob));
                                }

                                this.log(gridderSubJob, EGridderLogStatus.NEWSUBCELLS,
                                    { newcells: newCells.length, message: `${newCells.length} new cell subjobs added` });

                            }

                        } else {

                            this.log(gridderSubJob, EGridderLogStatus.NONEWSUBCELLS,
                                { message: `No new cell subjobs added` });

                        }

                    } else {

                        this.log(gridderSubJob, EGridderLogStatus.NORESULTS,
                            { message: "No new branches" });

                    }

                    this.log(gridderSubJob, EGridderLogStatus.FINISHED,
                        { message: "SubJob finished" });

                }

            }



            // ------------------
            // IPointsAvgValue processing
            // ------------------

            if (gridderSubJob.gridderJob.variable.lineage.operation === "IPointsAvgValue") {

                // Final results
                if (message.status === EGridderLogStatus.FINALRESULTS ||
                    message.status === EGridderLogStatus.NOGEOMSFOUND) {

                    this.log(gridderSubJob, EGridderLogStatus.RECIEVEDATCONTROLLER, message.payload);

                    // Do if there are results
                    if (message.payload.results != null) {

                        // Set cell data and set the cell in database
                        gridderSubJob.cell.data = message.payload.results;

                        this._cellEditor.set(gridderSubJob.cell);

                        this.log(gridderSubJob, EGridderLogStatus.CELLSUPDATED,
                            { branchesupdated: message.payload.results.length, message: `Total new branches: ${message.payload.results.length}` });

                        // Check zoom level of this cell and check if the job is over
                        // If not, issue new GridderSubJobs
                        const rZoom = gridderSubJob.cell.zoom;
                        const gsjZL = gridderSubJob.gridderJob.zoomLevels;
                        const zlPosition = gsjZL.indexOf(rZoom);

                        // There are still cells to be processed
                        if (zlPosition < (gsjZL.length - 1)) {

                            const newCells: Cell[] = gridderSubJob.cell.getSubCells(gsjZL[zlPosition + 1]);

                            for (let c of newCells) {

                                this._publishGridderSubJob(
                                    this._createNewGridderSubJob(c, gridderSubJob.gridderJob));

                            }

                            this.log(gridderSubJob, EGridderLogStatus.NEWSUBCELLS,
                                { newcells: newCells.length, message: `${newCells.length} new cell subjobs added` });

                        } else {

                            this.log(gridderSubJob, EGridderLogStatus.NONEWSUBCELLS,
                                { message: `No new cell subjobs added` });

                        }

                    } else {

                        this.log(gridderSubJob, EGridderLogStatus.NORESULTS,
                            { message: "No new branches" });

                    }

                    this.log(gridderSubJob, EGridderLogStatus.FINISHED,
                        { message: "SubJob finished" });

                }

            }




            // ------------------
            // IPointsSumValue processing
            // ------------------

            if (gridderSubJob.gridderJob.variable.lineage.operation === "IPointsSumValue") {

                // Final results
                if (message.status === EGridderLogStatus.FINALRESULTS ||
                    message.status === EGridderLogStatus.NOGEOMSFOUND) {

                    this.log(gridderSubJob, EGridderLogStatus.RECIEVEDATCONTROLLER, message.payload);

                    // Do if there are results
                    if (message.payload.results != null) {

                        // Set cell data and set the cell in database
                        gridderSubJob.cell.data = message.payload.results;

                        this._cellEditor.set(gridderSubJob.cell);

                        this.log(gridderSubJob, EGridderLogStatus.CELLSUPDATED,
                            { branchesupdated: message.payload.results.length, message: `Total new branches: ${message.payload.results.length}` });

                        // Check zoom level of this cell and check if the job is over
                        // If not, issue new GridderSubJobs
                        const rZoom = gridderSubJob.cell.zoom;
                        const gsjZL = gridderSubJob.gridderJob.zoomLevels;
                        const zlPosition = gsjZL.indexOf(rZoom);

                        // There are still cells to be processed
                        if (zlPosition < (gsjZL.length - 1)) {

                            const newCells: Cell[] = gridderSubJob.cell.getSubCells(gsjZL[zlPosition + 1]);

                            for (let c of newCells) {

                                this._publishGridderSubJob(
                                    this._createNewGridderSubJob(c, gridderSubJob.gridderJob));

                            }

                            this.log(gridderSubJob, EGridderLogStatus.NEWSUBCELLS,
                                { newcells: newCells.length, message: `${newCells.length} new cell subjobs added` });

                        } else {

                            this.log(gridderSubJob, EGridderLogStatus.NONEWSUBCELLS,
                                { message: `No new cell subjobs added` });

                        }

                    } else {

                        this.log(gridderSubJob, EGridderLogStatus.NORESULTS,
                            { message: "No new branches" });

                    }

                    this.log(gridderSubJob, EGridderLogStatus.FINISHED,
                        { message: "SubJob finished" });

                }

            }

        })
        .catch((error) => {
            console.log(`Error at process message: ${this._queueRecieve}, ${message}`);
            console.log(error);

            throw error;
        });


    }













}