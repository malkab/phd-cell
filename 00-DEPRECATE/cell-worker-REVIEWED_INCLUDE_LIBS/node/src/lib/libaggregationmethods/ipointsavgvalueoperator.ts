import { AggOperator } from "./aggoperator";
import { GridderSubJob } from "../libcellbackend/libcell/griddersubjob";
import { Variable } from "../libcellbackend/libcell/variable";
import { Cell } from "../libcellbackend/libcell/cell";
import { EGridderLogStatus } from "../libcellbackend/egridderlogstatus";
import { CellError, ECellErrorCode } from "../libcellbackend/libcell/cellerror";
import { GridderJob } from "../libcellbackend/libcell/gridderjob";
import { RedisDataPackage } from "../libcellbackend/redisdatapackage";
import { ILoggerMessage } from "../libcellbackend/redislogger";




/*

    Class for evaluating gridder sub jobs of type IPointsAvgValue

*/


export class IPointsAvgValueOperator extends AggOperator {

    // Performs calculations

    public process(gridderSubJob: GridderSubJob): Promise<Cell[]> {

        return new Promise<Cell[]>((resolve, reject) => {

            // Get variable, gridder job, and cell, just to reduce verbosity

            const gridderJob: GridderJob = gridderSubJob.gridderJob;
            const variable: Variable = gridderSubJob.gridderJob.variable;
            const cell: Cell = gridderSubJob.cell;

            // The geoms to be extracted from the data package for cell
            // calculation

            let geoms: any;

            // The data package to process this sub job

            const dataPackage: RedisDataPackage = new RedisDataPackage(gridderSubJob, this._persistence);

            // Out variable

            let out: Cell[] = [];

            // Report calculations start
            
            this._logger.log(gridderSubJob, <ILoggerMessage> {

                code: EGridderLogStatus.CALCULATIONSTART,
                payload: null,
                posterid: this._cellWorker.id
    
            });

            // Get colliding points by pulling the data package contents

            dataPackage.pullDataPackage()
            .then((g) => {

                // Store geoms in global var

                geoms = g;

                // Check if geoms is empty, sometimes produced because
                // a worker crashed

                if (geoms.length === 0) {

                    // Delete bad subjob here

                    this._cellWorker.libCellFactory.del(
                        "GridderSubJob", gridderSubJob.id);

                    dataPackage.deleteDataPackage();

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        "Empty geoms data package, deleting sub job",
                        null));

                }
            
                // Report

                this._logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.GEOMSFOUND,
                    payload: { numgeoms: geoms.length },
                    posterid: this._cellWorker.id
        
                });

                // Create groups of rows based on the lineage keys of catalogs

                cell.data = this._calculateValue(variable, geoms, this._avg, 
                    variable.lineage.params.round);

                // Report

                this._logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.AGGREGATIONDONE,
                    payload: null,
                    posterid: this._cellWorker.id
        
                });

                // Write cell

                return this._cellWorker.cellEditor.set(cell);

            })
            .then((cell: Cell) => {

                // Report

                this._logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.CALCULATIONEND,
                    payload: null,
                    posterid: this._cellWorker.id
        
                });

                this._logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.POSTPROCESSINGSTART,
                    payload: null,
                    posterid: this._cellWorker.id
        
                });

                this._logger.log(gridderSubJob, <ILoggerMessage> {

                    code: EGridderLogStatus.CELLUPDATED,
                    payload: null,
                    posterid: this._cellWorker.id
        
                });


                // Check if additional GridderSubJobs are to be queued

                const zl: number[] = gridderJob.zoomLevels;
                const lastZoom: number = zl[zl.length - 1];
                const currentZoomIndex: number = zl.indexOf(cell.zoom);

                // Promises to store all subcells data packages and 
                // gridder jobs because the parent datapackage must not 
                // be deleted before all childs are in place

                let childPromises: Promise<any>[] = []

                // If not in the last zoom, drill down

                if (!(cell.zoom === lastZoom)) {

                    // Get potential sub cells

                    const subCells: Cell[] =
                        cell.getSubCells(zl[currentZoomIndex+1]);

                    // Reindex points inside sub cells

                    const collisions: any[] = 
                        this._pointsInCells(subCells, geoms);

                    // Review reindexation

                    for (let i in subCells) {

                        // Check if there are geoms for this cell

                        if (collisions[i].length > 0) {

                            // Add colliding cell to output

                            out.push(subCells[i]);

                            // Create the new gridder sub job

                            const subJob: GridderSubJob = this._cellWorker.createNewGridderSubJob(subCells[i], gridderJob);

                            // Store the promise

                            childPromises.push(
                                this._cellWorker.publishGridderSubJob(
                                    subJob));

                            // Load subcell data into Redis

                            let cellDataPackage: RedisDataPackage = 
                                new RedisDataPackage(subJob, this._persistence);

                            childPromises.push(cellDataPackage.pushDataPackage(collisions[i]));

                        }

                    }

                    // Wait to process all child data packages and subjobs

                    Promise.all(childPromises)
                    .then((results) => {

                        // Delete the original data package and
                        // the sub job

                        this._cellWorker.libCellFactory.del(
                            "GridderSubJob", gridderSubJob.id);

                        dataPackage.deleteDataPackage();

                        // Report

                        this._logger.log(gridderSubJob, <ILoggerMessage> {

                            code: EGridderLogStatus.NEWSUBCELLS,
                            payload: { subcells: out.length},
                            posterid: this._cellWorker.id
                
                        });

                        this._logger.log(gridderSubJob, <ILoggerMessage> {

                            code: EGridderLogStatus.POSTPROCESSINGEND,
                            payload: null,
                            posterid: this._cellWorker.id
                
                        });

                        this._logger.log(gridderSubJob, <ILoggerMessage> {

                            code: EGridderLogStatus.WORKEREND,
                            payload: null,
                            posterid: this._cellWorker.id
                
                        });

                        resolve(out);

                    })
                    .catch((error) => {

                        reject(new CellError(ECellErrorCode.DATAERROR, "Error processing cell",
                            error));

                    })

                } else {

                    // No new cells and finish

                    this._logger.log(gridderSubJob, <ILoggerMessage> {

                        code: EGridderLogStatus.NONEWSUBCELLS,
                        payload: null,
                        posterid: this._cellWorker.id
            
                    });

                    this._logger.log(gridderSubJob, <ILoggerMessage> {

                        code: EGridderLogStatus.POSTPROCESSINGEND,
                        payload: null,
                        posterid: this._cellWorker.id
            
                    });
                    
                    this._logger.log(gridderSubJob, <ILoggerMessage> {

                        code: EGridderLogStatus.WORKEREND,
                        payload: null,
                        posterid: this._cellWorker.id
            
                    });                    

                    // Delete the original data package and
                    // the sub job

                    this._cellWorker.libCellFactory.del(
                        "GridderSubJob", gridderSubJob.id);

                    dataPackage.deleteDataPackage();

                    resolve([]);

                }

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error getting data package ${dataPackage.dataPackageKey}`,
                    error));

            })

        })

    }

}