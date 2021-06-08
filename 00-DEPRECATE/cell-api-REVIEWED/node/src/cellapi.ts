import { KeeperRedisService } from "@malkab/keeper-redis-service";

import { KeeperPgService } from "@malkab/keeper-pg-service";

import { KeeperRestApi } from "@malkab/keeper-api";

import { keeperRegisterLibCellClasses } from "@malkab/cell-libcell-keeper";

import { RxPg } from "@malkab/rxpg";

import { Catalog, Grid, DataItem } from "@malkab/cell-libcell";

import * as rxo from "rxjs/operators";

import * as rx from "rxjs";

import { Router } from "express";

import { isArray } from "lodash";

import * as fs from "fs";



/**
 * 
 * This class encapsulates Cell API functionality.
 * 
 */

export class CellApi {

    /**
     * 
     * The KeeperRestApi, that needs to be exposed in the API.
     * 
     */

    get keeperRestApi(): KeeperRestApi {

        return this._keeperRestApi;

    }

    private _keeperRestApi: KeeperRestApi;



    /**
     * 
     * The PG connection.
     * 
     */

    private _pg: RxPg;



    /*

        Constructor. Initializes Keeper and the PG connection.

    */

    constructor() {

        /*

            Keeper setup

        */

        // The KeeperRestApi instance

        this._keeperRestApi = new KeeperRestApi();


        // Read config

        const config: {

          redis: {
        
            password: string;
            host: string;
          
          },
        
          postgresql: {
        
            host: string;
            password: string;
        
          }

        } = JSON.parse(fs.readFileSync('/assets/config.json', 'utf8'));

        console.log("Config read");

        console.log("D: ", config);



        // Declare services

        const r00: KeeperRedisService = new KeeperRedisService(
          
          "r00", 
          config.redis.password, 
          config.redis.host
          
        );

        const p00: KeeperPgService = new KeeperPgService(
          
          "p00",
          config.postgresql.host,
          "meta.celldsobject", 
          "cellds", 
          5432,
          "postgres",
          config.postgresql.password 
          
        );

        this._keeperRestApi.keeper.registerService(r00);

        this._keeperRestApi.keeper.registerService(p00);

        this._keeperRestApi.keeper.registerPersistenceChain([ "r00", "p00"]);

        keeperRegisterLibCellClasses(this._keeperRestApi.keeper as any);

        console.log("Keeper registered classes: ", this._keeperRestApi.keeper.registeredClasses);



        /*

            Setup database connection.

        */

        this._pg = new RxPg(

          config.postgresql.host,
          5432,
          "postgres",
          config.postgresql.password,
          "cellds",
          50
        )

    }



    /**
     * 
     * Builds a catalog.
     * 
     */

    private _buildCatalog(

        catalog: string,
        table: string,
        column: string
        
    ): rx.Observable<boolean> {

        const c: Catalog = new Catalog(catalog);

        const sql = `
            select distinct ${column} as value
            from ${table}
            order by ${column};`;

        return this._pg.executeQuery$(sql)
        .pipe(

            rxo.catchError((error) => {

                return rx.throwError(error);

            }),

            rxo.concatMap((x: any): rx.Observable<boolean> => {

                const res: string[] = x.rows.map((x: any) => {

                    return x.value;

                })

                c.build(res);

                return this.keeperRestApi.keeper.set$(c);

            })
        
        )

    }



  /**
   * 
   * Executes a JSON Path on data.data for testing purposes.
   * 
   */

  private _testJsonPath(
      
    jsonPath: string, 
    zoomLevel: number = 0
      
  ): rx.Observable<any> {

    // Process the JSON Path

    return this._cellJsonPathToSql(jsonPath)
    .pipe(

      rxo.concatMap((n) => {

        // The final SQL
        
        let sql: string = `
          select 
            ${n} as data
          from data.data
          where
            zoom=${zoomLevel} and
            ${n} is not null`;
    
        return this._pg.executeQuery$(sql);

      })

    )
      
  }



  /**
   * 
   * Takes a Cell JSON Path and returns an SQL-ready
   * data retrieval condition.
   *  
   */

  private _cellJsonPathToSql(
    
    jsonPath: string
    
  ): rx.Observable<string> {

    const catalogs: any = [];

    let searchIndex: number = 0;


    // Scan looking for catalog entries

    while(jsonPath.indexOf("{{", searchIndex) > -1) {

      // Start and end of catalog marks

      const start: number = jsonPath.indexOf("{{", searchIndex);

      const end: number = jsonPath.indexOf("}}", searchIndex);

      // Check for non existent close mark

      if (end === -1) {

        throw Error(`Malformed JSON Path ${jsonPath}.`);

      }

      // Analyze catalog entry

      const catalog: string = jsonPath.substr(
          start, 
          (end-start) + 2
      );

      const catalogSeparator: number = catalog.indexOf("::");

      // Check if not catalog separator

      if (catalogSeparator === -1) {

        throw Error(`Malformed JSON Path ${jsonPath}.`);

      }

      // Decompose catalog entry

      const catalogName: string = catalog.substring(

        2,
        catalogSeparator
        
      );

      const catalogKey: string = catalog.substring(

        catalogSeparator + 2,
        catalog.length - 2
    
      );

      // Store catalog

      catalogs.push({

        start: start,
        end: end,
        catalogName: catalogName,
        catalogKey: catalogKey

      });

      // Advance the index

      searchIndex = end + 2;

    }

    const catalogNames: string[] = catalogs.map((x: any) => `Catalog::${x.catalogName}`);


    // Process

    // Get catalogs

    return this.keeperRestApi.keeper.get$(catalogNames)
    .pipe(

      rxo.catchError((error) => {

        return rx.throwError(error);

      }),

      rxo.concatMap((n) => {

        // To hold the processing of the jsonPath

        let jsonPathFinal: string;


        // Were there catalogs?

        if (n !== undefined) {

          n = (isArray(n) ? n : [n]) as any;

          jsonPathFinal = 
              jsonPath.substring(0, catalogs[0].start);

          catalogs.map((x: any, i: number) => {

          const catalogValue: string = n[i].forward[x.catalogKey];

          if (i < catalogs.length - 1) {
              
            const intermediateString: string = 
              jsonPath.substring(

                x.end + 2, catalogs[i+1].start

              );

            jsonPathFinal = `${jsonPathFinal}"${catalogValue}"${intermediateString}`;

          } else {

            jsonPathFinal = `${jsonPathFinal}"${catalogValue}"`

          }
          
        })

        const finalString: string = jsonPath
          .substring(catalogs[catalogs.length - 1].end + 2);

        jsonPathFinal = `${jsonPathFinal}${finalString}`;

        } else {

          jsonPathFinal = jsonPath; 

        }


        // Aggregator

        const aggSeparator: number = jsonPathFinal.indexOf("||");
        
        let final: string = "";


        if (aggSeparator > -1) {

          const jsonPathPath: string = jsonPathFinal
            .substring(0, aggSeparator);

          const aggregator: string = jsonPathFinal
            .substring(aggSeparator + 2);

          if (aggregator === "sum") {

            final = `jsonSum(jsonb_path_query_array(data, '${jsonPathPath}'))`;

          }

          if (aggregator === "avg") {

            final = `jsonAvg(jsonb_path_query_array(data, '${jsonPathPath}'))`;

          }

        } else {

          final = `jsonb_path_query_array(data, '${jsonPathFinal}')`;

        }

        return rx.of(final);

      })

    )

  }



  /**
   * 
   * Returns an observable to get cell data from the database based on a
   * set of DataItems.
   * 
   */


  private _getCells(

    {

      // Name of the grid

      gridName,

      // Corners

      lowerLeftX,
      lowerLeftY,
      
      upperRightX,
      upperRightY,

      // Target zoom

      zoom,

      // A boolean flag: on true, retrieves DataItems with an and,
      // suitable for ML, on false, retrieves with an or

      complete_vector,

      // An array with the names of the DataItems

      dataItemsNames

    }:

    {

      gridName: string,

      lowerLeftX: number,
      lowerLeftY: number,
      
      upperRightX: number,
      upperRightY: number,

      zoom: number,

      complete_vector: boolean,

      dataItemsNames: string[]

    }

  ): rx.Observable<any> {

    // Get DataItems Keeper keys

    const dataItemsKeys: string[] = dataItemsNames.map((x: any) => `DataItem::${x}`);


    // Some handy data references

    let grid: Grid;

    let dataItems: DataItem[];


    // Retrieve DataItems paths and grid

    return this._keeperRestApi.keeper.getm$(
      [ `Grid::${gridName}` ].concat(dataItemsKeys)
    )
    .pipe(

      rxo.concatMap((n) => {

        // The grid...

        grid = n[0];

        // ... and the DataItems

        dataItems = n.slice(1);

        // Get all Observables to process the DataItem's paths

        const o: any = dataItems.map(
          
          (x: any) => {
            
            return this._cellJsonPathToSql(x.path);

          }
          
        );

        // Retrieve them all...

        return rx.zip(...o);

      }),

      rxo.concatMap(

        (n) => { 
          
          // Start building the big SQL

          let sql: string = `
            with cell_coords as (

              select
                x, y
              from
                cell__getbboxcoverage(
        
                  '${grid.name}',
                  ${zoom},
                  st_makeenvelope(
                    ${lowerLeftX}, ${lowerLeftY},
                    ${upperRightX}, ${upperRightY},
                    ${grid.epsg}
                  )
      
                )
            )
            select 
            
              row_number() over () as id,
              a.x, a.y,
              jsonb_build_array(
          `;

          // Add the processed JSON Path here for combining them into a
          // JSON array that will be the data vector

          n.map((x: any) => {

            sql = sql + `${x},`;

          })

          sql = `${sql.slice(0, -1)}) as v

            from 

              data.data a inner join
              cell_coords b on
              a.x = b.x and a.y = b.y

            where

              zoom = ${zoom} and
              (
          `;

          // Add JSON Path conditions taking into account the 
          // complete_vector flag

          let booleanOp: string = complete_vector ?
            "and" : "or";

          n.map((x: any) => {

            sql = sql + `${x} is not null ${booleanOp} `;

          })

          sql = sql.slice(0, sql.lastIndexOf(` ${booleanOp}`));

          sql = `${sql});`;


          // Return an observable that will retrieve from the database

          return this._pg.executeQuery$(sql);

        }

      )

    )
 
  };
    


  /**
   * 
   * The router.
   * 
   */

  public router(): Router {

    // The router
    
    const router = Router();



    /*  

      Status test

    */

    router.get("/status", (req, res, next) => {

      return res.status(200).json({ status: "ok" });

    });



      /*

          Creates and builds a catalog

          /admin/catalogbuild/

      */

      router.post("/catalogbuild/:id", (req, res, next) => {

          const body: any = req.body;
          const id: string = req.params.id;

          try {

              this._buildCatalog(id, body.table, body.column)
              .subscribe(

                  (n: boolean) => res.status(200).json(n),

                  (error) => {

                      console.log(`Error: cannot build catalog ${id}`);
                      
                      console.log(error);

                      return res.status(500).send({ error: error.message });

                  }

              );

          } catch (error) {

              return res.status(500).send({ error: error.message });

          }

      });



      /*

          Tests a JSON path on data.

      */

      router.post("/jsonpathtest/", (req, res, next) => {

          const jsonPath: string = req.body.jsonpath;
          const zoomLevel: number = 
              req.body.zoomlevel ? +req.body.zoomlevel : 0;


          try {

              this._testJsonPath(jsonPath, zoomLevel)
              .subscribe(

                  (n: any) => res.status(200).json(n.rows),

                  (error) => {

                      console.log(`Error: cannot test JSON path ${jsonPath}`);
                      
                      console.log(error);

                      return res.status(500).send({ error: error.message });

                  }

              );

          } catch (error) {

              return res.status(500).send({ error: error.message });

          }

      });



      /*

        Get cells for a set of DataItems.

      */

      router.post("/cells/", (req, res, next) => {

        const body: any = req.body;

        this._getCells({

          complete_vector: body.complete_vector,
          dataItemsNames: body.dataItems,
          gridName: body.grid,

          lowerLeftX: body.lowerLeftX,
          lowerLeftY: body.lowerLeftY,

          upperRightX: body.upperRightX,
          upperRightY: body.upperRightY,

          zoom: body.zoom

        })
        .subscribe(
          
          (n) => {

            return res.status(200).send(n.rows);

          },

          (error) => {

            return res.status(500).send({ error: error.message });

          }

        );

      });



      // Return the router

      return router;

  }

}
