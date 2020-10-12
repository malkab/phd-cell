import * as pg from "pg";
import * as proj4 from "proj4";
import Bbox from "./bbox";


// SRS definitions

proj4.defs([
    [
        "EPSG:3035",
        "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs"
    ]
]);


export class CellJS {

    private pgPool: pg.Pool;
    private pgClient: pg.Client;


    // Returns a coordinate translator

    public getTranslator(fromEPSG: string, toEPSG: string) {
        return proj4(`EPSG:${fromEPSG}`, `EPSG:${toEPSG}`);
    }


    // Connects to CellDS database

    public cellDsCreatePool(host: string, port: number = 5432,
        user: string = "postgres", pass: string = "postgres", database: string = "cellds"): void {
        this.pgPool = new pg.Pool({
            user: user,
            host: host,
            database: database,
            password: pass,
            port: port
        });
    }


    // Closes pool

    public cellDsClosePool() {
        this.pgPool.end();
    }


    // // Return a set of cells in a given zoom

    // public getCells(gridId: string, zoom: number, bbox: Bbox): any {
    //     const sql: string = `
    //         select
    //             grid_id,
    //             epsg,
    //             zoom,
    //             x,
    //             y,
    //             data,
    //             st_asgeojson(st_transform(geom, 4326)) as geom
    //         from
    //             data.data
    //         where
    //             zoom = ${zoom} and
    //             st_intersects(st_transform(geom, 4326),
    //                     st_makeenvelope(${bbox.getMin().x}, ${bbox.getMin().y}, ${bbox.getMax().x}, ${bbox.getMax().y}, 4326));
    //     `;

    //     return this.cellDsQuery(sql);
    // }


    // Return a set of cells in a given zoom
    // Bounds must be in EPSG:4326

    public getCells(gridId: string, zoom: number, bbox: Bbox): any {
        // const sql: string = `
        //     with selection as (
        //         select *
        //         from data.data
        //         where
        //             st_intersects(geom_4326,
        //                 st_makeenvelope(${bbox.getMin().x}, ${bbox.getMin().y}, ${bbox.getMax().x}, ${bbox.getMax().y}, 4326)) and
        //             zoom=${zoom} and
        //             grid_id='${gridId}'
        //     ), cells_json as (
        //         select
        //             jsonb_build_object(
        //                 'type', 'Feature',
        //                 'id', row_number() over (),
        //                 'properties', data,
        //                 'geometry', st_asgeojson(st_transform(geom, 4326))::jsonb
        //             ) as jsonb
        //         from
        //             selection
        //     )
        //     select
        //         jsonb_build_object(
        //             'type', 'FeatureCollection',
        //             'features', array_agg(jsonb)
        //         ) as cells_json
        //     from
        //         cells_json;
        // `;

        const sql: string = `
            select
                x,
                y,
                jsonb_build_object('poblacion', data -> 'poblacion') as data
            from data.data
            where
                st_intersects(geom_4326,
                    st_makeenvelope(${bbox.getMin().x}, ${bbox.getMin().y}, ${bbox.getMax().x}, ${bbox.getMax().y}, 4326)) and
                zoom=${zoom} and
                grid_id='${gridId}';
        `;

        console.log(sql);

        // const sql: string = `
        //     with selection as (
        //         select *
        //         from
        //         cell__getCellsInEnvelope(
        //             '${gridId}', ${zoom}, ${epsg},
        //             ${bbox.getMin().x}, ${bbox.getMin().y},
        //             ${bbox.getMax().x}, ${bbox.getMax().y}
        //         )
        //     ), cells_json as (
        //         select
        //             jsonb_build_object(
        //                 'type', 'Feature',
        //                 'id', row_number() over (),
        //                 'properties', data,
        //                 'geometry', st_asgeojson(st_transform(geom, 4326))::jsonb
        //             ) as jsonb
        //         from
        //             selection
        //     )
        //     select
        //         jsonb_build_object(
        //             'type', 'FeatureCollection',
        //             'features', array_agg(jsonb)
        //         ) as cells_json
        //     from
        //         cells_json;
        // `;

        return this.cellDsQuery(sql);
    }


    // Launch an arbitrary query to the database

    public cellDsQuery(query: string): Promise<any> {
        return this.pgPool.query(query)
            .then(res => { return res; })
            .catch(e => { return e.stack; });
    }

}
