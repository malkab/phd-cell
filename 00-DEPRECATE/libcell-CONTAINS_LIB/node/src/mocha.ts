import { expect } from "chai";
import "mocha";

import { CellObject, ICellObject } from "./libcell/cellobject";
import { ZoomLevel, IZoomLevel } from "./libcell/zoomlevel";
import { Coordinate, ICoordinate } from "./libcell/coordinate";
import { Grid, IGrid } from "./libcell/grid";
import { PgConnection, IPgConnection } from "./libcell/pgconnection";
import { Catalog, ICatalog } from "./libcell/catalog";
import { Variable, IVariable } from "./libcell/variable";
import { GridderJob, IGridderJob } from "./libcell/gridderjob";
import { Cell } from "./libcell/cell";
import { Bbox } from "./libcell/bbox";


// Mocha tests

// CellObjectd

describe("CellObject", () => {

    const init: ICellObject = {
        description: "Description",
        longdescription: "Long description",
        name: "Name"
    };

    let a: CellObject = new CellObject("id", init);

    it("Return type", () => {
        expect(a.type).to.deep.equal("CellObject");
    });

    it("Bad init", () => {
        expect(() => { let a: CellObject = new CellObject(null, null); } ).throws(Error, "Unable to create CellObject: no id");
    });

    it("Persistance", () => {
        expect(a.persist).to.deep.equal(init);
    });

    it("Redis key", () => {
        expect(a.key).to.equal("CellObject:id");
    });

    it("decomposeKey", () => {
        expect(a.decomposeKey("CellObject:id")).to.deep.equal({ type: "CellObject", id: "id" });
    });

});


// ZoomLevel

describe("ZoomLevel", () => {

    let zl: ZoomLevel = new ZoomLevel("100 km", 100000);

    it("Get name", () => {
        expect(zl.name).to.equal("100 km");
    });

    it("Persistance", () => {
        expect(zl.persist).to.deep.equal(<IZoomLevel>{
            name: "100 km",
            size: 100000
        });
    });

});


// Coordinate

describe("Coordinate", () => {

    let c: Coordinate = new Coordinate("3035", 17000, 20000);

    it("Get name", () => {
        expect(c.epsg).to.equal("3035");
    });

    it("Wrong definition EPSG", () => {
        expect(() => {
            let a: Coordinate = new Coordinate(null, 0, 0);
        }).throws(Error, "Error initializing coordinate (null, 0, 0)");
    });

    it("Wrong definition x", () => {
        expect(() => {
            let a: Coordinate = new Coordinate("3035", null, 0);
        }).throws(Error, "Error initializing coordinate (3035, null, 0)");
    });

    it("Wrong definition y", () => {
        expect(() => {
            let a: Coordinate = new Coordinate("3035", 0, null);
        }).throws(Error, "Error initializing coordinate (3035, 0, null)");
    });

    it("Persistance", () => {
        expect(c.persist).to.deep.equal(<ICoordinate>{
            epsg: "3035",
            x: 17000,
            y: 20000
        });
    });

});


// Grid

describe("Grid", () => {

    const init: IGrid = {
        "description": "A grid based on the official EU one",
        "longdescription": "This is another description, long one",
        "name": "eu-grid",
        "origin": {
          "epsg": "3035",
          "x": 2700000,
          "y": 1500000
        },
        "zoomlevels": [
          {
            "name": "100 km",
            "size": 100000
          },
          {
            "name": "50 km",
            "size": 50000
          },
          {
              "name": "25 km",
              "size": 25000
          }
        ]
    };

    let a: Grid = new Grid("eu-grid", init);

    it("Get type", () => {
        expect(a.type).to.deep.equal("Grid");
    });

    it("Origin", () => {
        expect(a.origin).to.deep.equal(new Coordinate("3035", 2700000, 1500000));
    });

    it("Persistance", () => {
        expect(a.persist).to.deep.equal(init);
    });

    it("Cell return", () => {

        const r: Cell = a.coordinateInCell(new Coordinate("3035", 10, 10),
        0);

        expect([ r.zoom, r.x, r.y ]).to.deep.equal([0, -27, -15]);

        const rc: Cell [] = a.getBboxCellCoverage(
            new Bbox({ epsg: "3035", maxx: 110000, maxy: 110000,
                       minx: 10, miny: 10}),
            0
        );

        const cells = rc.map((c) => {
            return [ c.zoom, c.x, c.y ];
        });

        expect(cells).to.deep.equal([
            [ 0, -27, -15 ],
            [ 0, -27, -14 ],
            [ 0, -26, -15 ],
            [ 0, -26, -14 ] ]);

    });

});


// Cell

describe("Cell", () => {

    const init: IGrid = {
        "description": "A grid based on the official EU one",
        "longdescription": "This is another description, long one",
        "name": "eu-grid",
        "origin": {
          "epsg": "3035",
          "x": 2700000,
          "y": 1500000
        },
        "zoomlevels": [
          {
            "name": "100 km",
            "size": 100000
          },
          {
            "name": "50 km",
            "size": 50000
          },
          {
              "name": "25 km",
              "size": 25000
          }
        ]
    };

    const grid: Grid = new Grid("eu-grid", init);

    const cell: Cell = new Cell(grid, 0, 1, 0, {});

    it("Subcells", () => {

        const cells: Cell[] = cell.getSubCells(2);

        const lCells = cells.map((c) => {
            return [ c.zoom, c.x, c.y ];
        });

        expect(lCells).to.deep.equal([
            [ 2, 4, 0 ],
            [ 2, 4, 1 ],
            [ 2, 4, 2 ],
            [ 2, 4, 3 ],

            [ 2, 5, 0 ],
            [ 2, 5, 1 ],
            [ 2, 5, 2 ],
            [ 2, 5, 3 ],

            [ 2, 6, 0 ],
            [ 2, 6, 1 ],
            [ 2, 6, 2 ],
            [ 2, 6, 3 ],

            [ 2, 7, 0 ],
            [ 2, 7, 1 ],
            [ 2, 7, 2 ],
            [ 2, 7, 3 ]

        ]);

    });

});


// PgConnection

describe("PgConnection", () => {

    const init: IPgConnection = {
        db: "data",
        description: "Description",
        host: "host",
        longdescription: "Long description",
        name: "source",
        pass: "pass",
        port: 5432,
        user: "postgres"
    };

    let a: PgConnection = new PgConnection("source", init);

    it("Database", () => {
        expect(a.db).to.deep.equal("data");
    });

    it("Persistance", () => {
        expect(a.persist).to.deep.equal(init);
    });

});




// Catalog

describe("Catalog", () => {

    const init: ICatalog = {
        column: "column",
        description: "Description",
        longdescription: "Long description",
        name: "Name",
        pgconnectionid: "source",
        table: "table"
    };

    let a: Catalog = new Catalog("catalogMunicipios", init);

    let connection: PgConnection = new PgConnection("source",
    {
        db: "testdata",
        host: "host",
        pass: "pass",
        port: 5432,
        user: "postgres"
    });

    a.pgConnection = connection;

    let i: ICatalog = init;
    i.forward = {};
    i.backward = {};


    it("type", () => {

        expect(a.type).to.deep.equal("Catalog");

    });

    it("Persistance", () => {

        expect(a.persist).to.deep.equal(i);

    });

    it("build catalog: forward", () => {

        a.build(["Sevilla", "Granada", "Cádiz", "Huelva"]);

        expect(a.forward).to.deep.equal(
            { "Sevilla": "6", "Huelva": "b", "Granada": "3", "Cádiz": "8" }
        );

    });

    it("build catalog: backward", () => {
        expect(a.backward).to.deep.equal(
            { "b": "Huelva", "3": "Granada", "6": "Sevilla", "8": "Cádiz" }
        );
    });

    const initBuilt: ICatalog = {
        column: "column",
        description: "Description",
        longdescription: "Long description",
        name: "Name",
        pgconnectionid: "source",
        table: "table",
        forward: { "Sevilla": "6", "Huelva": "b", "Granada": "3", "Cádiz": "8" },
        backward: { "b": "Huelva", "3": "Granada", "6": "Sevilla", "8": "Cádiz" }
    };

    let b: Catalog = new Catalog("catalogMunicipios", initBuilt);

    b.build(["Sevilla", "Granada", "Cádiz", "Huelva", "Almería"]);

    it("build catalog: forward", () => {
        expect(b.forward).to.deep.equal(
            { "Sevilla": "6", "Huelva": "b", "Granada": "3", "Cádiz": "8",
              "Almería": "d" }
        );
    });

    it("build catalog: backward", () => {
        expect(b.backward).to.deep.equal(
            { "b": "Huelva", "3": "Granada", "6": "Sevilla", "8": "Cádiz",
              "d": "Almería" }
        );
    });

});




// Variable

describe("Variable", () => {

    it("Basic initialization & members", () => {

        const init: IVariable = {
            "name": "Superficie provincias Andalucía",
            "description": "Desglose de área por provincia de Andalucía",
            "minihash": null,
            "longdescription": "Long description",
                "table": "data.municipio_poly",
                "pgconnectionid": "source",
                "lineage": {
                    "operation": "IAggArea",
                    "params": {
                        "geom": "geom",
                        "columns": [
                            {
                                "name": "provincia",
                                "catalog": "provincias"
                            }
                        ]
                    }
                }
        };

        const connection: PgConnection = new PgConnection("source",
        {
            db: "testdata",
            host: "host",
            pass: "pass",
            port: 5432,
            user: "postgres"
        });

        const a: Variable = new Variable("var", init);
        a.pgConnection = connection;

        expect(a.type).to.deep.equal("Variable");

        expect(a.persist).to.deep.equal(init);

        expect(a.key).to.equal("Variable:var");

    });

});



// GridderJob

describe("GridderJob", () => {

    it("Basic initialization & members", () => {

        const init: IGridderJob = {
            "name": "Superficie provincias Andalucía",
            "description": "Desglose de área por provincia de Andalucía",
            "longdescription": "Long description",
            "gridid": "eu-grid",
            "zoomlevels": [ 0, 1, 2 ],
            "variableid": "areaprovincias",
            "dirtyarea": {
                "epsg": "3035",
                "minx": 2863000,
                "maxx": 2939100,
                "miny": 1715000,
                "maxy": 1771400
            }
        };

        const initGrid: IGrid = {
            "description": "A grid based on the official EU one",
            "longdescription": "This is another description, long one",
            "name": "eu-grid",
            "origin": {
              "epsg": "3035",
              "x": 2700000,
              "y": 1500000
            },
            "zoomlevels": [
              {
                "name": "100 km",
                "size": 100000
              },
              {
                "name": "50 km",
                "size": 50000
              }
            ]
        };

        const initVar: IVariable = {
            "name": "Superficie provincias Andalucía",
            "description": "Desglose de área por provincia de Andalucía",
            "minihash": null,
            "longdescription": "Long description",
                "table": "data.municipio_poly",
                "pgconnectionid": "source",
                "lineage": {
                    "operation": "IAggArea",
                    "params": {
                        "geom": "geom",
                        "columns": [
                            {
                                "name": "provincia",
                                "catalog": "provincias"
                            }
                        ]
                    }
                }
        };

        const connection: PgConnection = new PgConnection("source",
        {
            db: "testdata",
            host: "host",
            pass: "pass",
            port: 5432,
            user: "postgres"
        });

        const variable: Variable = new Variable("areaprovincias", initVar);
        variable.pgConnection = connection;

        const grid: Grid = new Grid("eu-grid", initGrid);
        const a: GridderJob = new GridderJob("job", init);

        a.grid = grid;
        a.variable = variable;

        expect(a.type).to.deep.equal("GridderJob");

        expect(a.persist).to.deep.equal(init);

        expect(a.key).to.equal("GridderJob:job");

    });

});