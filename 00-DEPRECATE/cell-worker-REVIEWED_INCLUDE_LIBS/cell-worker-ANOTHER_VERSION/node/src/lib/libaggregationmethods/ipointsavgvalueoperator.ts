/*

    Imports

*/

import { AggOperator } from "./aggoperator";

import { GridderSubJob, EGridderSubJobProcessingType }
    from "../libcellbackend/libcell/griddersubjob";

import { Variable } from "../libcellbackend/libcell/variable";

import { Cell } from "../libcellbackend/libcell/cell";

import { EGridderLogStatus }
    from "../libcellbackend/egridderlogstatus";

import { CellError, ECellErrorCode }
    from "../libcellbackend/libcell/cellerror";

import { GridderJob } from "../libcellbackend/libcell/gridderjob";

import { ILoggerMessage } from "../libcellbackend/redislogger";

import { PostGIS } from "../libpersistence/services/postgis";

import { QueryResult } from "pg";

import { Coordinate } from "../libcellbackend/libcell/coordinate";

import { mean, round } from "mathjs";

import { EWorkerStatus } from "../cellworker";




/**

    Class for evaluating gridder sub jobs of type IPointsAvgValue.

*/


export class IPointsAvgValueOperator extends AggOperator {
     
    /**
     *
     * Performs the final calculation of the cell for the GridderSubJob
     * and also check for new sub jobs to be generated.
     * 
     * TODO: Use the variable threshold to decide for a drill down method or another
     *
     * @param {GridderSubJob} gridderSubJob The GridderSubJob to calculate the cell value for
     * @returns {Promise<GridderSubJob[]>} The set of child GridderSubJob to continue the drill down
     */

    public process(gridderSubJob: GridderSubJob): Promise<GridderSubJob[]> {

        // // VERY IMPORTANT!!! Don't forget to set here the worker's
        // // status to BUSY

        // this._cellWorker.status = EWorkerStatus.BUSY;

        return new Promise<GridderSubJob[]>((resolve, reject) => {

            // Calculate cell

            this._calculateCell(gridderSubJob)
            .then((cell) => {

                // Drill down taking into account the GridderJob threshold

                return this._drillDown(gridderSubJob, gridderSubJob.gridderJob.processingThresholdZoomLevel);

            })
            .then((gridderSubJobs: GridderSubJob[]) => {

                resolve(gridderSubJobs);

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error processing gridderSubJob ${gridderSubJob.id} for cell ${gridderSubJob.cell.asString} using IPointsAvgValueOperator aggregator`));

            })

        });

    }



    /*

        This is the cell processing unit. Should not be called but inside
        the process method.

        This strictly calculates the cell value, takes no decision on 
        doing anything else.

    */

    protected _calculateCell(gridderSubJob: GridderSubJob): Promise<Cell> {

        return new Promise<Cell>((resolve, reject) => {

            // Get variable, gridder job, and cell, just to reduce verbosity

            const variable: Variable = gridderSubJob.gridderJob.variable;
            const cell: Cell = gridderSubJob.cell;

            // The geoms to be extracted from the data package for cell
            // calculation

            let geoms: any = gridderSubJob.data;

            // Report calculations start

            this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                code: EGridderLogStatus.CALCULATIONSTART,
                payload: null,
                posterid: this._cellWorker.id

            });

            // Check if geoms is empty, sometimes produced because
            // a worker crashed

            if (geoms.length === 0) {

                // Delete bad subjob here

                this._cellWorker.libCellFactory.del(
                    "GridderSubJob", gridderSubJob.id);

                reject(new CellError(ECellErrorCode.DATAERROR,
                    "Empty geoms data package, deleting sub job",
                    null));

            }

            // Report

            this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                code: EGridderLogStatus.GEOMSFOUND,
                payload: { numgeoms: geoms.length },
                posterid: this._cellWorker.id

            });

            // Create groups of rows based on the lineage keys of catalogs
            // and calculates the cell data value

            cell.data = this._calculateValue(variable, geoms, this._avg,
                variable.lineage.params);

            // Report

            this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                code: EGridderLogStatus.AGGREGATIONDONE,
                payload: null,
                posterid: this._cellWorker.id

            });

            // Write cell

            this._cellWorker.cellEditor.set(cell)
                .then((cell: Cell) => {

                    // Report

                    this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                        code: EGridderLogStatus.CALCULATIONEND,
                        payload: null,
                        posterid: this._cellWorker.id

                    });

                    this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                        code: EGridderLogStatus.POSTPROCESSINGSTART,
                        payload: null,
                        posterid: this._cellWorker.id

                    });

                    this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                        code: EGridderLogStatus.CELLUPDATED,
                        payload: null,
                        posterid: this._cellWorker.id

                    });

                    resolve(cell);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error processing cell for GridderSubJob ${gridderSubJob.id}`,
                        error));

                })

        })

    }



    /**
     * 
     * Goes to the source database and get data collidind with the given cell and variable.
     * This function **DOES NOT** process the geoms in any way.
     *
     * @param {GridderJob} gridderJob The GridderJob to process.
     * @returns {Promise<any>} A promise that evaluates in the geoms with their thematic values colliding with the GridderJob dirty area.
     * 
     */
    
    public initialCollidingGeoms(gridderJob: GridderJob): Promise<any> {

        // Placeholders

        const variable: Variable = gridderJob.variable;
        const cell: Cell = gridderJob.dirtyArea;

        return new Promise<any>((resolve, reject) => {

            // A placeholder PostGIS connection to connect to
            // source declared here so it can be later closed
            // once the only query to be executed is processed

            let sourcePg: PostGIS;

            // Get all geoms at cell

            // Compose SQL to get initial geoms

            let sql: string = "select ";

            // Check if there are lineage columns

            if ("columns" in variable.lineage.params) {

                for (let c of variable.lineage.params.columns) {

                    sql += `${c.name}, `;

                }
            }

            sql += `st_asgeojson(st_intersection(${variable.lineage.params.geom}, st_geomfromewkt('${cell.ewkt}'))) as geom, st_area(${variable.lineage.params.geom}) as area, ${variable.lineage.params.value} as value
            from ${variable.table}
            where st_intersects(${variable.lineage.params.geom}, 
                st_geomfromewkt('${cell.ewkt}'))`;

            // Create a PostGIS to connect to source data

            sourcePg = this._postgisFromPgConnection(variable.pgConnection, 1);

            sourcePg.executeQuery(sql)
                .then((geoms: QueryResult) => {

                    // Close pool

                    sourcePg.closePool();

                    // Apply catalogs to the QueryResult, if any

                    return this._applyCatalogs(variable, geoms);

                })
                .then((geoms: QueryResult) => {

                    // Parse geoms JSON

                    for (let g of geoms.rows) {

                        g.geom = JSON.parse(g.geom);

                    }

                    resolve(geoms.rows);

                })
                .catch((error) => {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Error retrieving geometries for Variable ${variable.id} and Cell (${cell.grid.id}/${cell.zoom}/${cell.x}/${cell.y})`,
                        error));

                })

        })

    }



    /**
     * This function performs a drill down, that is, creating
     * new GridderSubJobs that are stored at Redis or in memory 
     * for other workers to take care of it. Should not be called but 
     * inside the process method.
     * 
     * @protected
     * @param {GridderSubJob} gridderSubJob The **GridderSubJob** being processed.
     * @param {number} threshold The threshold to consider an in-memory or a Redis drill down process.
     * @returns {Promise<GridderSubJob[]>} The set of new **GridderSubJob** to spawn.
     */
    protected _drillDown(gridderSubJob: GridderSubJob, thresholdZoomLevel: number): Promise<GridderSubJob[]> {

        return new Promise<GridderSubJob[]>((resolve, reject) => {

            // For readibility

            const gridderJob: GridderJob = gridderSubJob.gridderJob;
            const cell: Cell = gridderSubJob.cell;
            const zl: number[] = gridderJob.zoomLevels;
            const lastZoom: number = zl[zl.length - 1];
            const currentZoomIndex: number = zl.indexOf(gridderSubJob.cell.zoom);

            // If not in the last zoom, drill down

            if (!(cell.zoom === lastZoom)) {

                // Prepare child sub jobs, setting by now the 
                // EGridderSubJobProcessingType to null until a decision
                // is made if processing will be in memory or REDIS
                // based

                let childSubJobs: GridderSubJob[] =
                    this._childSubJobs(gridderSubJob, 
                        currentZoomIndex + 1,
                        null);

                // Log creation of new sub jobs

                this._cellWorker.logger.log(
                    gridderSubJob,
                    <ILoggerMessage>{

                        code: EGridderLogStatus.NEWSUBCELLS,
                        payload: childSubJobs.length,
                        posterid: this._cellWorker.id

                    });

                this._cellWorker.logger.log(
                    gridderSubJob,
                    <ILoggerMessage>{

                        code: EGridderLogStatus.NEWSUBCELLSINMEMORY,
                        payload: childSubJobs.length,
                        posterid: this._cellWorker.id

                    });

                this._cellWorker.logger.log(
                    gridderSubJob,
                    <ILoggerMessage>{

                        code: EGridderLogStatus.POSTPROCESSINGEND,
                        payload: null,
                        posterid: this._cellWorker.id

                    });

                this._cellWorker.logger.log(
                    gridderSubJob,
                    <ILoggerMessage>{

                        code: EGridderLogStatus.WORKEREND,
                        payload: null,
                        posterid: this._cellWorker.id

                    });


                // Decide between in-memory or Redis

                if ((gridderSubJob.cell.zoom < thresholdZoomLevel)) {

                    // Conventional drill down

                    for (let sj of childSubJobs) {

                        sj.processingType = EGridderSubJobProcessingType.REDIS;

                    }

                    // Send it again to the CellWorker class that initiates
                    // the process method

                    resolve(childSubJobs);

                } else {

                    // Drill down IN MEMORY

                    for (let sj of childSubJobs) {

                        // Set the processing type to INMEMORY

                        sj.processingType = EGridderSubJobProcessingType.INMEMORY;

                        this.process(sj);

                    }

                    resolve([]);

                }

            } else {

                // No new cells and finish

                this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                    code: EGridderLogStatus.NONEWSUBCELLS,
                    payload: null,
                    posterid: this._cellWorker.id

                });

                this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                    code: EGridderLogStatus.POSTPROCESSINGEND,
                    payload: null,
                    posterid: this._cellWorker.id

                });

                this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                    code: EGridderLogStatus.WORKEREND,
                    payload: null,
                    posterid: this._cellWorker.id

                });

                resolve([]);

            }

        })

    }



    /*

        Return child sub jobs

    */

    protected _childSubJobs(gridderSubJob: GridderSubJob, targetZoom: number, processingType: EGridderSubJobProcessingType): GridderSubJob[] {

        // Get potential sub cells

        const subCells: Cell[] = gridderSubJob.cell.getSubCells(targetZoom);

        // To store colliding geoms for each sub cell

        let collidingGeoms: any[] = [];

        for (let sc of subCells) {

            // To store colliding geoms for this cell

            let cGeoms: any[] = [];

            // Check point geometries by inclusion into the sub cell

            for (let g of gridderSubJob.data) {

                let c: Coordinate = new Coordinate(sc.grid.epsg, 0, 0);
                c.fromGeoJSON(g.geom);

                if (sc.bbox.coordinateInBbox(c)) {

                    cGeoms.push(g);

                };

            }

            collidingGeoms.push(cGeoms);

        }

        // Create new GridderSubJobs

        let outSubJobs: GridderSubJob[] = [];

        for (let i in subCells) {

            // Check if there are data

            if (collidingGeoms[i].length > 0) {

                outSubJobs.push(gridderSubJob.gridderJob.getNewGridderSubJob(subCells[i], collidingGeoms[i], processingType));

            }

        }

        return outSubJobs;

    }



    /**
     *
     * Calculates the avg of a list of numbers, optionally rounded.
     * 
     * It is used with the [[_calculateValue]] function.
     * 
     * The additional parameters for this function are fully included in
     * the lineage.params dataset, but it must confort to this 
     * prototype:
     * 
     * ```JSON
     * {
     *      round: 1;
     * }
     * ```
     * 
     * where **round** is the rounding factor.
     *
     * @param geoms     List of geoms to perform the average on.
     * @param fParams   List of additional parameters to perform the 
     *                  computation.
     * 
     * @returns         The average.
     * 
     */

    private _avg(geoms: any[], fParams: any): number {

        let r: number = fParams.round;

        let values: number[] = geoms.map((x) => {

            return x.value;
            
        });

        let avg: number = <number>mean(values);

        avg = <number>round(<number>avg, r);

        return avg;

    }   

}