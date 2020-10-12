/*

    Grid class.

*/

import { Coordinate } from "./coordinate";
import { PostGIS, IPostGIS } from "./postgis";


// Grid definition

export interface GridJsonDefinition {
    // dataSource: IDataSource;
    grid: {
        name: string;
        epsg: string;
        origin: number[];
        zooms: { [level: number]: GridZoom };
    };
}


// GridZoom

export class GridZoom {

    // Members
    private _name: string;
    private _size: number;

    constructor(name: string, size: number) {
        this._name = name;
        this._size = size;
    }

}


// Grid

export class Grid {

    // // Members
    // private _dataSource: DataSource;
    // private _name: string;
    // private _epsg: number;
    // private _origin: Coordinate;
    // private _zooms: { [level: number]: GridZoom };


    // // Constructor
    // constructor(definition: GridJsonDefinition) {
    //     this._dataSource = new DataSource(definition.dataSource);
    //     const def: any = definition.grid;
    //     this._name = def.name;
    //     this._epsg = +def.epsg;
    //     this._origin = new Coordinate(this._epsg, def.origin[0], def.origin[1]);
    //     this._zooms = def.zooms;

    //     return this;
    // }


    // // Write to data source
    // public write(): Promise<IOutput> {

    //     return new Promise((resolve, reject) => {
    //         const postgis: pg.PostGIS = new pg.PostGIS();
    //         const dbConfig: DataSource = new DataSource();
    //         dbConfig.constructFromDefinition(definition.dataSource);

    //         postgis.connect(dbConfig.getPoolConfig(1))
    //         .then(postgis => {
    //             const origin = new Coordinate(+definition.grid.epsg,
    //                 definition.grid.origin[0],
    //                 definition.grid.origin[1]);

    //             const q = `select cell__registergrid($1,
    //                        st_setsrid(st_geomfromgeojson($2), $3),
    //                        $4::jsonb);`;

    //             const v = [ definition.grid.name, origin.pggeojson,
    //                         definition.grid.epsg,
    //                         JSON.stringify(definition.grid.zooms) ];

    //             return postgis.executeParamQuery(q, v);
    //         })
    //         .then(res => {
    //             resolve({
    //                 code: 0,
    //                 success: true,
    //                 description: `Grid ${definition.grid.name} successfully created`,
    //                 payload: res
    //             });
    //         })
    //         .catch(error => {
    //             reject({
    //                 code: 1,
    //                 success: false,
    //                 description: `Error creating grid ${definition.grid.name}`,
    //                 payload: error
    //             });
    //         });
}