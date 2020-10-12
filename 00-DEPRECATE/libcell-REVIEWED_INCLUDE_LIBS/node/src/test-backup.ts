// /*

//     Tests for debug

// */

// import { Grid, IGrid } from "./REWORK-DEPRECATE/grid";
// import { Cell } from "./REWORK-DEPRECATE/cell";
// import { Coordinate } from "./libcell/coordinate";
// import { Polygon } from "./libcell/polygon";
// // import proj4 from "proj4";





// // const init: IGrid = {
// //     "name": "eu-grid",
// //     "description": "A grid based on the official EU one",
// //     "longdescription": "This is another description, long one",
// //     "origin": {
// //         "epsg": "3035",
// //         "x": 2700000,
// //         "y": 1500000
// //     },
// //     "zoomlevels": [
// //         {"name": "100 km", "size": 100000},
// //         {"name": "50 km", "size": 50000},
// //         {"name": "10 km", "size": 10000},
// //         {"name": "5 km", "size": 5000},
// //         {"name": "1 km", "size": 1000},
// //         {"name": "500 m", "size": 500},
// //         {"name": "250 m", "size": 250},
// //         {"name": "125 m", "size": 125},
// //         {"name": "25 m", "size": 25},
// //         {"name": "5 m", "size": 5}
// //     ]
// // };

// // const grid: Grid = new Grid("eu-grid", init);

// // const cell: Cell = new Cell(grid, 9, 3, 2, {});

// // console.log(cell.ewkt);

// // console.log("JJJeeee");

// // console.log(grid.numChildCells(0, 2));

// // const cells: Cell[] = cell.getSubCells(2);

// // const lCells = cells.map((c) => {
// //     return [ c.zoom, c.x, c.y ];
// // });

// // console.log(lCells);

// import * as turf from "@turf/turf";

// // console.log("Poly: ", poly);

// // console.log(turf.area(cell.turfPolygon)/1000000);

// // console.log(100000*100000/1000000);

// // console.log(proj4("EPSG:3857", "EPSG:4326", [1000,-1000]));

// // const source = proj4.Proj("EPSG:3857");
// // const dest = proj4.Proj("EPSG:4326");

// // console.log(

// //   proj4.transform(source, dest, [0,0])

// // );

// // const c: Coordinate = new Coordinate("3035", 10, -0.1);

// // console.log(c.reprojectFromProj4Defs("+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", "4326"));

// const feature = 
// {
//   "type": "Feature",
//   "geometry": {
//     "type": "Polygon",
//     "coordinates": [
//       [
//         [-4.8677361061998, 37.2157820120898],
//         [-5.06411087945221, 38.1041673785345],
//         [-3.94443852436891, 38.27559520024],
//         [-3.76176611777859, 37.3846358279934],
//         [-4.8677361061998, 37.2157820120898]
//       ]
//     ]
//   }
// };

// console.log("D cell", cell.polygon.area / (100000*100000));

// console.log("D factor escala", cell.scaleFactor);

// console.log("cell GeoJSON", cell.geojson.geometry.coordinates);

// const p: Polygon = new Polygon();

// p.fromGeoJson(feature);

// console.log("D area", p.area/1000000);

// // console.log("Inter area", cell.intersectPolygon(p).area/1000000);

// // console.log("Ratio", cell.intersectPolygon(p).area / cell.polygon.area * 100);


// // {
// //   "type": "Polygon",
// //   "coordinates": [
// //     [
// //       [-7.45496380770691, 37.8693486510201],
// //       [-7.38891912729576, 36.9901151826415],
// //       [-6.87836419449556, 36.5690086521214],
// //       [-6.00008228197909, 36.7267803720435],
// //       [-5.57741407255978, 36.9763041192108],
// //       [-5.63600909083989, 37.4693442350986],
// //       [-5.69611106240388, 37.8688354969182],
// //       [-6.31734824918119, 38.1622475668352],
// //       [-6.82711114459024, 38.131349693795],
// //       [-6.82711114459024, 38.131349693795],
// //       [-7.45496380770691, 37.8693486510201]
// //     ]
// //   ]
// // };

// // const inter = turf.intersect(p, cell.turfPolygon3857);

// // console.log(cell.turfPolygon.geometry.coordinates);

// // console.log(inter.geometry.coordinates);

// // console.log("inter area ", turf.area(inter));

// // console.log("cell area", turf.area(cell.turfPolygon));

// // console.log("Ratio", turf.area(inter)/turf.area(cell.turfPolygon)*100);

// // console.log("cell", cell.ewkt);

