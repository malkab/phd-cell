import { CellError, ECellErrorCode } from "../libcellbackend/libcell/cellerror";
import { GridderSubJob } from "../libcellbackend/libcell/griddersubjob";
import { CellWorker } from "../cellworker";
import { Variable } from "../libcellbackend/libcell/variable";
import { Cell } from "../libcellbackend/libcell/cell";
import { mean, round } from "mathjs";
import { Persistence } from "../libpersistence/persistence";
import { Bbox } from "../libcellbackend/libcell/bbox";
import { Coordinate } from "../libcellbackend/libcell/coordinate";
import { RedisLogger } from "../libcellbackend/redislogger";



/*

    This is the base class for aggregation operators
    It contains common facilities to create aggregation operators data flows

*/


export class AggOperator {

    /*

        Protected members

    */

    // This is the parent CellWorker, used for communications with the rest of the worker system

    protected _cellWorker: CellWorker;

    // The persistence of the CellWorker

    protected _persistence: Persistence;

    // The logger of the CellWorker

    protected _logger: RedisLogger;



    /*

        Constructor, recieves the parent CellWorker for using
        its persistence and logging capabilities

    */

    constructor(cellWorker: CellWorker, persistence: Persistence, 
        logger: RedisLogger) {

        this._cellWorker = cellWorker;

        this._persistence = persistence;

        this._logger = logger;

    }



    /*

        Processing, always recieves a GridderSubJob
        Must be implemented at child classes

    */

    public process(gridderSubJob: GridderSubJob): void {

        throw new CellError(
            ECellErrorCode.CELLDSERROR,
            "Error: AggOperator.process must be reimplemented in child objects"
        );

    }



    /*

        Protected methods

    */


    /*

        Aggregate colliding geoms values by lineage. This function expects 
        the rows has already been catalog processed with this._applyCatalogs 
        or whatever

        The result is a hashmap with the following structure:

        {
            "catalog0keyA::catalog1keyB::": [ list of values with this lineage ],
            "catalog0keyC::catalog1keyC::": [ list of values with this lineage ]
        }

        variable: Variable: The variable

        geoms: any[]: The colliding geoms

    */

    protected _aggregateLineage(variable: Variable, geoms: any[]): 
    { [ key: string ]: number[] } {

        // First, check if there is any lineage

        if ("columns" in variable.lineage.params) {

            // Get lineage columns

            const columns: any[] = variable.lineage.params.columns;

            // The output results

            let out: { [ key: string ]: number[] } = {};

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

                out[key].push(+g.value);

            }

            return out

        } else {

            // There was no lineage, so return a single category with
            // all values

            return { "values": geoms.map((x) => { return x.value })};

        }

    }




    /*

        Calculates the avg of a list of numbers, optionally rounded.

        It is used with the this._calculateValue function, so it accepts
        an any[] array with the arguments:

        args[0]: number[] : The number series to calculate

        args[1]: number : Optional rounding

        returns: number : The average

    */

    protected _avg(values: number[], r?: number): number {

        let avg: number = mean(values);

        if (r != null) {

            avg = <number>round(avg, r);

        }

        return avg;

    }



    /*

        Takes a lineage aggregation dictionary set in the form:

        { 
            'catalog0key::catalog1key::': numeric_value, 
            'catalog0key::catalog1key::': numeric_value 
        }

        and outputs a cell data value suitable to write at cellds.data table
        

        variable: Variable: The variable

        lineageResults: any: The aforementioned lineageResults

        returns: any: Cell data format

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

            groupData.push(lineageResults[k][0]);

            // Push this lineage group to the full set

            groups.push(groupData);

        }

        // Set variable minihash to composed groups

        data[variable.miniHash] = groups;

        return data;

    }




    /*

        Gets a set of cells and a set of point geometries and distributes
        the points inside each cell

        cells: Cell[]: The set of cells to index the points into

        geoms: any[]: A set of point rows

        returns 

    */

    protected _pointsInCells(cells: Cell[], points: any[]): any[] {

        // Prepare a output structure

        let out: any[] = [];

        // Check each cell against each geometry

        for ( let c of cells ) {

            // The list of geoms colliding in this cell

            let collisions: any[] = [];

            // Get cell bounds

            const bounds: Bbox = c.bbox;

            for ( let g of points ) {

                const coord: Coordinate = new Coordinate(
                    c.grid.epsg, 
                    g.geom.coordinates[0],
                    g.geom.coordinates[1]);

                // If there is a collision, add to the list

                if (bounds.coordinateInBbox(coord)) {
                    
                    collisions.push(g);

                }

            }

            // Add final list of collisions to the out structure

            out.push(collisions);

        }

        return out;

    }



    /*

        Takes data, aggregate them based on lineage, 
        and apply to each aggregated family a function to
        calculate the final value

        variable: Variable: The variable

        geoms: any[]: The data package

        f: function: The calculation function

    */

    protected _calculateValue(
        variable: Variable,
        geoms: any[],
        f: (values: number[], ...args: any[]) => number,
        ...args: any[]
    ): void {

        const aggregation = this._aggregateLineage(variable, geoms);

        let values: { [ key: string ]: number } = {};

        for (let a of Object.keys(aggregation)) {

            values[a] = f(aggregation[a], args);

        }

        return this._composeCellData(variable, values);

    }

}