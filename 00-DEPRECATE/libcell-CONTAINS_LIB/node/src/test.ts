/*

    Tests for debug

*/

import { Grid, IGrid } from "./libcell/grid";
import { Cell } from "./libcell/cell";


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

const cell: Cell = new Cell(grid, 0, 1, 2, {});

console.log(cell.ewkt);

console.log(grid.numChildCells(0, 2));

// const cells: Cell[] = cell.getSubCells(2);

// const lCells = cells.map((c) => {
//     return [ c.zoom, c.x, c.y ];
// });

// console.log(lCells);
