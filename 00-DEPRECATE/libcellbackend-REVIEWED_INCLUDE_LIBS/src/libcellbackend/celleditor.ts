/*

    This class controls editions in the cell data storage data.data

*/

import { Persistence } from "../libpersistence/persistence";
import { Cell } from "./libcell/cell";
import { CellError, ECellErrorCode } from "./libcell/cellerror";
import { Bbox, IBbox } from "./libcell/bbox";
import { LibCellFactory } from "./libcellfactory";
import { Grid } from "./libcell/grid";
import { QueryResult } from "pg";



/*

    Cell request interface

*/

export interface ICellRequest {

    gridid: string;
    bbox: IBbox;
    zoom: number;
    path?: any;

}


/*

    Cell data return interface
    Used when the clients asks for cell data with api/cells and a
    ICellRequest

*/

export interface ICellResponse {

    zoom: number;
    ncells: number;
    gridid: string;
    cells: any[][];

}



export class CellEditor {

    /*

        Private members

    */

    // CellDS interface
    private _persistence: Persistence;

    // Main LibCellFactory
    private _libCellFactory: LibCellFactory;


    /*

        Constructor

    */

    constructor(persistence: Persistence, libCellFactory: LibCellFactory) {

        this._persistence = persistence;
        this._libCellFactory = libCellFactory;

    }


    /*

        Sets a cell

    */

    public set(cell: Cell): Promise<Cell> {

        return new Promise<Cell>((resolve, reject) => {

            const sql: string = `
                select cell__setcell(
                    ($1, $2, $3, $4, $5, $6)::cell__cell
                );
            `;

            this._persistence.pgExecuteParamQuery(sql,
                [ cell.grid.id, cell.grid.epsg, cell.zoom, cell.x, cell.y,
                  JSON.stringify(cell.data) ] )
            .then((result) => {
                resolve(cell);
            })
            .catch((error) => {
                reject(new CellError(ECellErrorCode.DATAERROR,
                    `Error encoding cell: zoom: ${cell.zoom}, x: ${cell.x}, y: ${cell.y}, data: ${JSON.stringify(cell.data)}`, error));
            });

        });

    }


    /*

        Get cells

    */

    public get(request: ICellRequest): Promise<ICellResponse> {

        return new Promise<ICellResponse>((resolve, reject) => {

            console.log("request", request);

            this._libCellFactory.get("Grid", request.gridid)
            .then((grid: Grid) => {

                // Create Bbox from request
                const bbox: Bbox = new Bbox(request.bbox);

                // Check if BBox and grid EPSG matches
                if (grid.epsg !== bbox.epsg) {

                    reject(new CellError(ECellErrorCode.DATAERROR,
                        `Requested bbox EPSG ${request.bbox.epsg} must equal requested grid EPSG ${grid.epsg}`));

                }

                // Get cells at square of bbox
                const squareCells: {
                    lowerLeft: Cell,
                    upperRight: Cell
                } = grid.getSquareCellsInBbox(bbox, request.zoom);

                console.log("Request path:", request.path, Object.keys(request.path));

                // Ask to the DB
                let sql: string = `
                    select
                        x, y,
                    `;

                if (! request.path) {

                    sql += " data";

                } else {

                    // Get only relevant data
                    for (let p of Object.keys(request.path)) {

                        sql += `data -> '${p}' as data_${p},`;

                    }

                }

                sql = sql.slice(0, -1);

                sql += `
                    from
                        data.data
                    where
                        grid_id=$1 and
                        zoom=$2 and
                        x between $3 and $4 and
                        y between $5 and $6
                `;

                // Filter with variables in path
                for (let p of Object.keys(request.path)) {

                    sql += ` and data -> '${p}' is not null`;

                }

                console.log(sql);


                return this._persistence.pgExecuteParamQuery(sql,
                    [ grid.id, request.zoom,
                      squareCells.lowerLeft.x,
                      squareCells.upperRight.x,
                      squareCells.lowerLeft.y,
                      squareCells.upperRight.y,
                ]);

            })
            .then((cells: QueryResult) => {

                //const cellsOut: any[][] =

                // Process filters and variable sets
                cells.rows.map((c) => {

                    let data: any = {};

                    console.log(c);

                    for (let v of request.path) {

                        console.log("Request path: ", v);

                        for (let i of v) {

                            console.log("Processing item: ", i);
                        console.log("Variable data: ", c.data[v[0]]);

                        const varData = c.data[v[0]];

                        for (let p of varData) {

                            console.log("Variable path: ", p);

                        }

                        data[v[0]] = c.data[v[0]];

                    }
                }

                    return [ +c.x, +c.y, data ];

                });

                resolve({
                    gridid: request.gridid,
                    ncells: cells.rowCount,
                    zoom: request.zoom,
                    cells: [] // cellsOut
                });

            })
            .catch((error) => {

                reject(new CellError(ECellErrorCode.DATAERROR, `Error retrieving cells for request ${request}`, error));

            });

        });

    }

}