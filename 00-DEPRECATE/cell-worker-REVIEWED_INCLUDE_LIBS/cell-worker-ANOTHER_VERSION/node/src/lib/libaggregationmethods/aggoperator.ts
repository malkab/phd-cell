import { CellError, ECellErrorCode } from "../libcellbackend/libcell/cellerror";

import { GridderSubJob, EGridderSubJobProcessingType } from "../libcellbackend/libcell/griddersubjob";

import { CellWorker } from "../cellworker";

import { Variable } from "../libcellbackend/libcell/variable";

import { Cell } from "../libcellbackend/libcell/cell";

import { Persistence } from "../libpersistence/persistence";

import { Bbox } from "../libcellbackend/libcell/bbox";

import { Coordinate } from "../libcellbackend/libcell/coordinate";

import { RedisLogger } from "../libcellbackend/redislogger";

import { GridderJob } from "../libcellbackend/libcell/gridderjob";

import { PostGIS } from "../libpersistence/services/postgis";

import { PgConnection } from "../libcellbackend/libcell/pgconnection";

import { QueryResult } from "pg";

import { Catalog } from "../libcellbackend/libcell/catalog";

import { LibCellFactory } from "../libcellbackend/libcellfactory";




/**
 * 
 * This is the base class for aggregation operators.
 * 
 * It contains common facilities to create aggregation operators data 
 * flows, such as common operations that can be reused among different 
 * aggregation operators.
 * 
 * The protected functions in this class serve thus two main objectives:
 * 
 * - some are meant to control the processing workflow of the gridding
 *   process that must be implemented in each child subclass derived 
 *   from this one;
 * 
 * - others, starting with the prefix **\_h\_**, are helper functions
 *   that holds common functions that may be reused in a broad range of
 *   child AggOperators and thus are worth to be available here. 
 * 
 */

export class AggOperator {

    /*

        Protected members

    */

    // This is the parent CellWorker, used for communications with the rest of the worker system

    protected _cellWorker: CellWorker;






    /*

        Constructor, recieves the parent CellWorker for using
        its persistence and logging capabilities

    */

    constructor(cellWorker: CellWorker) {

        this._cellWorker = cellWorker;

    }



    /*

        Processing, always recieves a GridderSubJob. Must be implemented
        at child classes.

        Must be public to be called from CellWorker.

        This is the main processing entrance when a new GridderSubJob is
        received at the worker.

        TODO: This method should not be this monolithic. For example,
        for all AggOperators entering this method sets the worker into a
        BUSY state, and now this has to be a responsability of all
        derived AggOperator, which is a mess. This mega-method should be
        the entry point for a set of common actions, executed here, and
        other micro-hooks that should be the ones to be implemented in
        derived AggOperators. Do this with all of them in the future.

    */

    public process(gridderSubJob: GridderSubJob): Promise<GridderSubJob[]> {

        throw new CellError(
            ECellErrorCode.CELLDSERROR,
            "Error: AggOperator.process must be reimplemented in child classes"
        );

    }



    /*

        Calculates the initialCollidingGeoms for the first sub job.
        Must be implemented at child classes.

        Must be public to be called from CellWorker.

        This is the main processing entrance when a new GridderJob
        is received at the worker.

    */

    public initialCollidingGeoms(gridderJob: GridderJob): Promise<any> {

        throw new CellError(
            ECellErrorCode.CELLDSERROR,
            "Error: AggOperator.initialCollidingGeoms must be reimplemented in child classes"
        );

    }




    /*

        Protected methods

    */

    /*

        This is the cell processing unit. Should not be called but inside
        the process method.

        This strictly calculates the cell value, takes no decision on 
        doing anything else.

        Must return the cell.

    */

    protected _calculateCell(gridderSubJob: GridderSubJob): Promise<Cell> {

        throw new CellError(
            ECellErrorCode.CELLDSERROR,
            "Error: _calculateCell must be reimplemented in child class"
        );

    }


    /*

        This is the function that takes a GridderSubJob, analyzes if it 
        needs to drill down (and how, in place or conventional), and
        drills down.


    */

    protected _drillDown(gridderSubJob: GridderSubJob, threshold: number): Promise<GridderSubJob[]> {

        throw new CellError(
            ECellErrorCode.CELLDSERROR,
            "Error: _drillDown must be reimplemented in child class"
        );

    }



    /*

        Returns the set of GridderSubJobs that are child of the given
        GridderSubJob in the given target zoom

    */

    protected _childSubJobs(gridderSubJob: GridderSubJob, targetZoom: number, processingType: EGridderSubJobProcessingType): GridderSubJob[] {

        throw new CellError(
            ECellErrorCode.CELLDSERROR,
            "Error: _childSubJobs must be reimplemented in child class"
        );

    }



    /**
     *
     * Aggregate colliding geoms values by lineage. This function expects the rows has already been catalog processed with this._applyCatalogs.
     * 
     * The result is a hashmap with the following structure:
     * 
     * ```JSON
     * {
     *      "catalog0keyA::catalog1keyB::": [ list of geoms with this lineage ],
     *      "catalog0keyC::catalog1keyC::": [ list of geoms with this lineage ]
     * }
     * ```
     *
     * @param {Variable} variable: Variable to control the aggregation.
     * @param {any[]} geoms: The input geoms.
     * 
     * @returns {{ [ key: string ]: any[] }}: The value of aggregated and calculated values.
     */

    protected _aggregateLineage(variable: Variable, geoms: any[]): 
    { [ key: string ]: any[] } {

        // First, check if there is any lineage

        if ("columns" in variable.lineage.params) {

            // Get lineage columns

            const columns: any[] = variable.lineage.params.columns;

            // The output results

            let out: { [ key: string ]: any[] } = {};

            // Iterate over rows

            for (let g of geoms) {

                // Compose a key that is the keys in catalogs of lineage data  
                // separated by ::

                let key: string = "";

                // Iterate columns and construct the lineage key

                for (let c of columns) {

                    key += g[`catalog::${c.catalog}`] + "::"

                }

                // Add the geom value to the lineage key hash map if not already present

                if (!(key in out)) {

                    out[key] = [];

                }

                out[key].push(g);

            }

            return out;

        } else {

            // There was no lineage, so return a single category with
            // all values

            return { "values": geoms.map((x) => { return x })};

        }

    }




    /**
     *
     * Takes a lineage aggregation dictionary set in the form:
     *
     * ```JSON
     * { 
     *     'catalog0key::catalog1key::': numeric_value, 
     *     'catalog0key::catalog1key::': numeric_value 
     * }
     * ```
     *
     * and outputs a cell data value suitable to write at cellds.data 
     * table.
     * 
     *
     * @param variable          The variable
     * @param lineageResults    The aforementioned lineageResults
     *
     * @returns                 Cell data format to inject into 
     *                          cellds.data table
     * 
     */

    protected _composeCellData(variable: Variable, lineageResults: any): any {

        // Create variable for output

        let data: { [ variableKey: string ]: any[] } = {};

        // Create a variable for the lineage groups:
        // [ catalog0key, catalog1key, value]

        let groups: any[] = [];

        // Iterate through results of lineaging

        for (let k of Object.keys(lineageResults)) {

            // Split catalog keys

            let groupData: string[] = k.split("::");

            // Drop last empty one

            groupData.pop();

            // Push as last item the numeric value

            groupData.push(lineageResults[k]);

            // Push this lineage group to the full set

            groups.push(groupData);

        }

        // Set variable minihash to composed groups

        data[variable.miniHash] = groups;

        return data;

    }



    /**
     *
     * Takes data, aggregate them based on lineage, and apply to each 
     * aggregated family a function to calculate the final value.
     *
     * @param variable      The variable to use in the aggregation
     *                      process.
     * @param geoms         The data package.
     * @param f             The calculation function. This function must
     *                      have a compulsory first argument that must 
     *                      be an any[] array of geoms to calculate on 
     *                      and another parameter that is an object with
     *                      any additional parameter needed to do the 
     *                      job. This function must return a number with
     *                      the result of the calculation for the 
     *                      lineaged values.
     * @param fParams       Any additional arguments that the f function
     *                      may need to work, in the form of an object.
     *                      Most of the times is just the [[Variable]]
     *                      definition **lineage.params** dataset.
     *
     * @returns             The cell data format native to cellds 
     *                      data.data table
     */

    protected _calculateValue(
        variable: Variable,
        geoms: any[],
        f: (geoms: any[], params: any) => number,
        fParams: any
    ): any {

        const aggregation = this._aggregateLineage(variable, geoms);

        let values: { [ key: string ]: number } = {};

        for (let a of Object.keys(aggregation)) {

            values[a] = f(aggregation[a], fParams);

        }

        return this._composeCellData(variable, values);

    }



    /*
    
        Returns a Persistence object with PostGIS configured 
        from a PgConnection

        Used frequently to connect the worker to source DBs

    */

    protected _postgisFromPgConnection(pgConnection: PgConnection, maxConn: number): PostGIS {

        const p: PostGIS = new PostGIS(
            pgConnection.host,
            pgConnection.port,
            pgConnection.user,
            pgConnection.pass,
            pgConnection.db
        );

        p.initPool(maxConn);

        return p;

    }



    /*

        Translates catalogs in a colliding geoms results

        The transformation is directly applied to the QueryResult containing
        original lineaged colliding geoms data retrieved from the source DB. For
        each catalog found in the columns section of the variable lineage, a new
        row data item called "catalog::catalogname" will be aggregated with the
        forwarded key in the catalog that matches the given lineage data. This 
        usually is used then by functions like this._aggregateLineage to aggregate
        data by lineage.

        variable: Variable: The variable

        geoms: QueryResult: A colliding geoms extraction (see this._getCollidingGeoms) 

        returns: The query result with the keys of the catalogs applied to the lineage columns

    */

    protected _applyCatalogs(variable: Variable, geoms: any): Promise<QueryResult> {

        return new Promise((resolve, reject) => {

            // First check if there is any lineage
            
            if ("columns" in variable.lineage.params) {

                // Get lineage columns

                const columns: any[] = variable.lineage.params.columns;

                // Get catalog names in columns

                const catNames = columns.map((x) => { return x.catalog });

                // Get a hash map with the catalogs and their keys

                this._cellWorker.libCellFactory.getSetHash("Catalog", catNames)
                .then((catalogs: { [ id: string ]: Catalog }) =>{

                    // Iterate rows

                    for (let g of geoms.rows) {

                        // Iterate columns 

                        for (let c of columns) {

                            // Forward the catalog value for each column into 
                            // the row structure with a "catalog::catalogname" key

                            g[`catalog::${c.catalog}`] = 
                                catalogs[c.catalog].forward[g[c.name]];

                        }

                    }

                    resolve(geoms);

                })
                .catch((error: any) => {

                    reject(new CellError(ECellErrorCode.DATAERROR, "Error applying catalogs", error));

                })

            } else {

                // There are no columns for lineage, so return rows unaffected

                resolve(geoms);

            }

        })
        
    }



    /**
     * 
     * This section holds common helper functions.
     * 
     */


    /**
     * 
     * Points inside a target cell.
     * 
     * **Helper function**. This function takes the set of point data 
     * attached to a [[GridderSubJob]] and a [[Cell]] object to test
     * which points are inside the cell.
     * 
     * @param gridderSubJob     The [[GridderSubJob]] containing the 
     *                          data to be tested. The **must be point
     *                          geoms**. The function doesn't try to 
     *                          guarantee they are.
     * @param cell              The target [[Cell]] to check inclusion
     *                          into.
     * 
     * @returns                 The set of geoms, in the original format
     *                          used inside the data member of a 
     *                          [[GridderSubJob]], that satisfy the 
     *                          inclusion relationship.
     * 
     */

    protected _h_pointsInsideCell(gridderSubJob: GridderSubJob, 
        cell: Cell): any[] 
    {

        // For final results

        const _out: any[] = [];

        // Cycle the geometries

        for (let g of gridderSubJob.data) {

            let c: Coordinate = new Coordinate(cell.grid.epsg, 0, 0);
            c.fromGeoJSON(g.geom);

            if (cell.bbox.coordinateInBbox(c)) {

                _out.push(g);

            };

        }

        return _out;

    }



    /**
     * 
     * Points inside a target distance of a cell.
     * 
     * **Helper function**. This function takes the set of point data 
     * attached to a [[GridderSubJob]] and a [[Cell]] object to test
     * which points are within a certain distance the cell, by using an
     * offset enlarged version of the original cell.
     * 
     * @param gridderSubJob     The [[GridderSubJob]] containing the 
     *                          data to be tested. The **must be point
     *                          geoms**. The function doesn't try to 
     *                          guarantee they are.
     * @param cell              The target [[Cell]] to check inclusion
     *                          into.
     * @param distance          Target distance.
     * 
     * @returns                 The set of geoms, in the original format
     *                          used inside the data member of a 
     *                          [[GridderSubJob]], that satisfy the 
     *                          inclusion relationship.
     * 
     */

    protected _h_pointsAtDistanceOfCell(gridderSubJob: GridderSubJob, 
        cell: Cell, distance: number): any[] 
    {

        // For final results

        const _out: any[] = [];

        // Apply the offset to the cell

        cell.offset = distance;

        // Cycle the geometries

        for (let g of gridderSubJob.data) {

            let c: Coordinate = new Coordinate(cell.grid.epsg, 0, 0);
            c.fromGeoJSON(g.geom);

            if (cell.bbox.coordinateInBbox(c)) {

                _out.push(g);

            };

        }

        return _out;

    }

}