/*

    Cell imports

*/

import { AggOperator } from "./aggoperator";

import { GridderSubJob, EGridderSubJobProcessingType }
    from "../libcellbackend/libcell/griddersubjob";

import { Variable } 
    from "../libcellbackend/libcell/variable";

import { Cell }
    from "../libcellbackend/libcell/cell";

import { EGridderLogStatus }
    from "../libcellbackend/egridderlogstatus";

import { CellError, ECellErrorCode }
    from "../libcellbackend/libcell/cellerror";

import { GridderJob }
    from "../libcellbackend/libcell/gridderjob";

import { ILoggerMessage }
    from "../libcellbackend/redislogger";

import { PostGIS }
    from "../libpersistence/services/postgis";

import { Coordinate }
    from "../libcellbackend/libcell/coordinate";

import { EWorkerStatus } from "../cellworker";


/*

    Third-parties import

*/

import { QueryResult } from "pg";

import { mean, round } from "mathjs";




/**
 * 
 * Class for evaluating [[GridderSubJob]] of type
 * IPointsAvgInvDistInterpolationOperator.
 * 
 * This operator performs an average value calculation of inside points 
 * when the side of the cell is above the **resolutionThreshold** 
 * parameter. When below, it performs an inverse distance interpolation 
 * of the nearest **nConvolution** points nearer to the cell center and 
 * within **searchDistance**.
 *
*/


export class IPointsAvgInvDistInterpolationOperator extends AggOperator {
     
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

                // Drill down taking into account the GridderJob 
                // threshold if the returned cell wasn't null

                if (cell) {
                
                    return this._drillDown(gridderSubJob, gridderSubJob.gridderJob.processingThresholdZoomLevel);

                } else {

                    resolve(null);

                }

            })
            .then((gridderSubJobs: GridderSubJob[]) => {

                resolve(gridderSubJobs);

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error processing gridderSubJob ${gridderSubJob.id} for cell ${gridderSubJob.cell.asString} using IPointsAvgInvDistInterpolationOperator aggregator`));

            })

        });

    }



    /**
     *
     * This is the cell processing unit. Should not be called but inside the process method.
     *
     * This strictly calculates the cell value, takes no decision on doing anything else.
     * 
     * This function returns **null** if the cell has no value defined for it.
     * 
     * TODO: Workflow reporting must be an issue resolved exclusively at the AggOperator class
     * for having a cohesive workflow.
     *
     * @param {GridderSubJob} gridderSubJob: The GridderSubJob to calculate the cell for.
     * @returns {Promise<Cell>}: The cell with the calculated value.
     * 
     */

    protected _calculateCell(gridderSubJob: GridderSubJob): Promise<Cell> {

        return new Promise<Cell>((resolve, reject) => {

            // Get variable, gridder job, variable lineage params,
            // and cell, just to reduce verbosity

            const variable: Variable = gridderSubJob.gridderJob.variable;
            const cell: Cell = gridderSubJob.cell;
            const varParams: any = variable.lineage.params;

            // The geoms 

            let geoms: any[] = gridderSubJob.data;

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

            // Determine if going to do the average or the interpolation 
            // based on cell size

            if (cell.sideSize > varParams.resolutionthreshold) {

                // Get inside geoms

                const insideGeoms: any[] = this._getInsideOutsidePoints(cell, geoms)[0];

                // Calculate cell value based on the lineage keys of 
                // catalogs and calculates the cell data value, but only
                // if there are matching geometries

                if (insideGeoms.length > 0 ) {

                    cell.data = this._calculateValue(variable, 
                        insideGeoms, this._avg, varParams);

                } else {

                    cell.data = null;

                }

            } else {

                const closestsGeoms: any[] = 
                    this._sortByDistanceToCentroid(cell, geoms).slice(0, 
                    varParams.nconvolution);

                // Calculate cell value based on the lineage keys of 
                // catalogs and calculates the cell data value, but only
                // if there are matching geometries

                if (closestsGeoms.length > 0 ) {

                    cell.data = this._calculateValue(variable, 
                        closestsGeoms, this._inverseDistanceInterpolation, 
                        varParams);

                } else {

                    cell.data = null;

                }

            }

            // Report

            this._cellWorker.logger.log(gridderSubJob, <ILoggerMessage>{

                code: EGridderLogStatus.AGGREGATIONDONE,
                payload: null,
                posterid: this._cellWorker.id

            });

            // Write cell if data is not null

            if (cell.data) {

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

            } else {

                resolve(null);

            }

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
            };

            cell.offset = variable.lineage.params.searchdistance;

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
     * TODO: This function is too monolithic. It should be divided in
     * more atomic steps. For example, checking if we are at the last
     * zoom level is an universal step and should be taken into account
     * at AggOperator.
     * 
     * @param gridderSubJob     The **GridderSubJob** being processed.
     * @param threshold         The threshold to consider an in-memory 
     *                          or a Redis drill down process.
     * 
     * @returns                 The set of new **GridderSubJob** to 
     *                          spawn.
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



    /**
     * 
     * Returns the child [[GridderSubJobs]] to be spawned from this one
     * via drill down.
     * 
     * @param gridderSubJob         The current [[GridderSubJob]].
     * @param targetZoom            The target zoom to consider.
     * @param processingType        The type of processing to be 
     *                              selected. Currently it seems to be
     *                              **unused**.
     * 
     * @returns                     The set of new child 
     *                              [[GridderSubJob]] to be spawned.
     * 
     */


    protected _childSubJobs(gridderSubJob: GridderSubJob, 
        targetZoom: number, 
        processingType: EGridderSubJobProcessingType): GridderSubJob[] 
    {

        // Get potential sub cells

        const subCells: Cell[] = 
            gridderSubJob.cell.getSubCells(targetZoom);

        // To store colliding geoms for each sub cell

        let collidingGeoms: any[] = [];

        // Process each subcell

        for (let sc of subCells) {

            // To store colliding geoms for this cell

            // Get points inside the target distance of cell

            let cGeoms: any[] = this._h_pointsAtDistanceOfCell(
                gridderSubJob, sc, 
                gridderSubJob.gridderJob.variable.lineage.params.searchdistance);

            collidingGeoms.push(cGeoms);

        }

        // Create new GridderSubJobs

        let outSubJobs: GridderSubJob[] = [];

        // TODO: This may pretty well be generalized at AggOperator

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


    /**
     *
     * Get a set of geoms and a cell and returns two arrays: 
     * 
     * - first one, array of geoms that are inside the cell;
     * 
     * - second one, array of geoms that are outside the cell. 
     *
     * @param {Cell} cell
     * @param {any[]} geoms
     * @returns {[ any[], any[] ]}
     * 
     */

    private _getInsideOutsidePoints(cell: Cell, geoms: any[]): [ any[], any[] ] {

        // For the outside points

        let out: any[] = [];

        // Check num of points inside the cell

        const geomsInside: any = geoms.filter((p: any) => {

            let i: boolean = cell.coordinateInCell(
                new Coordinate(
                    cell.grid.epsg, 
                    p.geom.coordinates[0],
                    p.geom.coordinates[1])
            );

            if(!i) { out.push(p) };

            return i;

        })

        return [ geomsInside, out ];

    }


    /**
     *
     * Calculates distances from the points in the geoms dataset to the center of the cell and return the geoms sorted by this distance.
     *
     * @param {Cell} cell: The cell to check.
     * @param {any[]} geoms: The geoms to sort.
     * @returns {any[]}: The geoms, sorted.
     * 
     */

    private _sortByDistanceToCentroid(cell:Cell, geoms: any[]): any[] {

        const center: Coordinate = cell.center;

        geoms.forEach((x: any) => {

            x.distance = center.euclideanDistanceFromXY([
                x.geom.coordinates[0],
                x.geom.coordinates[1],
            ]);

        });

        geoms.sort((x: any, y: any): number => {

            return x.distance - y.distance;

        });

        return geoms;

    }


    /**
     * 
     * Calculates the inverse weighted distance of the set of geoms 
     * **geoms**.
     * 
     * The additional params **fParams** for this function must follow 
     * the minimum following prototype:
     * 
     * ```JSON
     * {
     *      inversedistanceweightingpower: 1.4,
     *      round: 1
     * }
     * ```
     * 
     * Being **inversedistanceweightingpower** the power for the inverse 
     * distance friction and **round** the number of decimals to round 
     * to.
     * 
     * @param geoms     The set of geoms participating in the 
     *                  calculation.
     * @param fParams   Additional params needed for the computation, in
     *                  the form of an object.
     * @returns         The inverse weighted distance to the focal point.
     */

    private _inverseDistanceInterpolation(geoms: any[], fParams: any): number {

        const power: number = fParams.inversedistanceweightingpower;

        const decimals: number = fParams.round;

        let up: number = 0;

        let down: number = 0;

        for(let g of geoms) {

            up = up + (g.value / Math.pow(g.distance, power));

            down = down + (1 / Math.pow(g.distance, power));

        }

        let res: number = <number>round(<number>(up / down), decimals);

        return res;

    }

}