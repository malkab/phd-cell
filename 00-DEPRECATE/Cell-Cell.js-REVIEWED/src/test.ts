import * as celljs from "./libcelljs";

let cell = new celljs.CellJS();
let coordsTranslator = cell.getTranslator("3035", "4326");

/**
 * From 3035 to 4326, translator
 */

console.log(
`

---
From 3035 to 4326
---`
);

console.log(coordsTranslator.forward([2, 5]));

console.log("Must be ~ (-29.0868319043563 12.9936251461887)");


/**
 * From 4326 to 3035, translator
 */

console.log(
`

---
From 4326 to 3035
---`
);

console.log(coordsTranslator.inverse([-29.0868319043563, 12.9936251461887]));

console.log("Must be ~ (2, 5)");


/**
 * From 4326 to 3035, coordinates
 */

console.log(
`

---
4326 coordinate to 3035 and back, coordinates
---`
);

let coords0 = new celljs.Coordinate("4326", -29.0868319043563, 12.9936251461887);
let coords1 = coords0.reproject("3035");
let coords2 = coords1.reproject("4326");

console.log(coords1);
console.log("Must be ~ (2, 5)");
console.log();
console.log(coords2);
console.log("Must be ~ (-29.0868319043563 12.9936251461887)");


/**
 * From 4326 to 3035, coordinates
 */

console.log(
`

---
3035 coordinate to 4326 and back, bbox
---`
);

let bbox0 = new celljs.Bbox("3035", new celljs.Coordinate("3035", 0, 0),
    new celljs.Coordinate("4326", 0, 37));
let bbox1 = bbox0.reproject("4326");
let bbox2 = bbox1.reproject("3035");

console.log(bbox0);
console.log();
console.log(bbox1);
console.log();
console.log(bbox2);
console.log();



CONTINUE CREATING THE CELLDS TEST DATABASE AND CREATE A FUNCTION TO READ GRID VALUES AND THEN ONE TO RETURN CELLS IN A GIVEN BBOX




/**
 * Close everything
 */

cell.cellDsCreatePool("mmalonso.fgh.us.es", 7000);

// cell.cellDsQuery("select data from data.data limit 3;");

cell.cellDsClosePool();
