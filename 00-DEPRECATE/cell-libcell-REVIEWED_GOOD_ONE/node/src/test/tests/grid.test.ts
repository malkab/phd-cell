import "mocha";

import { expect } from "chai";

import { Grid, Coordinate, ZoomLevel } from "../../lib/index";



describe("Grids", function() {

    it("Tests grids", function() {

        const c: Grid = new Grid(
            
            "eu-grid",

            "A grid based on the official EU one",

            "This is another description, long one",

            new Coordinate("3035", 2700000, 1500000),

            [

                new ZoomLevel("100 km", 100000),
                new ZoomLevel("50 km", 50000 ),
                new ZoomLevel("10 km", 10000 ),
                new ZoomLevel("5 km", 5000 ),
                new ZoomLevel("1 km", 1000 ),
                new ZoomLevel("500 m", 500 ),
                new ZoomLevel("250 m", 250 ),
                new ZoomLevel("125 m", 125 ),
                new ZoomLevel("25 m", 25 ),
                new ZoomLevel("5 m", 5)

            ]

        );

        const persistence: any = {

            name: c.name,

            description: c.description,

            longdescription: c.longDescription,

            origin: {

                epsg: c.origin.epsg,

                x: c.origin.x,

                y: c.origin.y

            }

        };

        persistence.zoomlevels = [];


        for (const i of c.zoomLevels) {

            persistence.zoomlevels.push({
                
                name: i.name, 
                
                size: i.size

            });

        }

        expect(persistence).to.deep.equal(

            {
                name: "eu-grid",
                description: "A grid based on the official EU one",
                longdescription: "This is another description, long one",
                origin: {
                    epsg: "3035",
                    x: 2700000,
                    y: 1500000
                },
                zoomlevels: [
                    { name: "100 km", size: 100000},
                    { name: "50 km", size: 50000},
                    { name: "10 km", size: 10000},
                    { name: "5 km", size: 5000},
                    { name: "1 km", size: 1000},
                    { name: "500 m", size: 500},
                    { name: "250 m", size: 250},
                    { name: "125 m", size: 125},
                    { name: "25 m", size: 25},
                    { name: "5 m", size: 5}
                ]
            }

        );

    });

});
