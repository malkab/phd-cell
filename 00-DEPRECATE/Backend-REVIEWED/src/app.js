// app.js
// This is the main application

// Call the packages we need
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

// Read configuration file
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));


// Cell main object
const cell = require("./cell/cellserver")({
    user: config.CELLDBUSER,
    database: config.CELLDB,
    password: config.CELLDBPASSWORD,
    host: config.CELLDBHOST,
    port: config.CELLDBPORT,
    client_encoding: config.CLIENTENCODING,
    poolSize: config.CONNPOOLMAX, // max connections
    idleTimeoutMillis: config.PGTIMEOUT
  });



// The Express app
const app = express();
app.use(cors());


// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Log to the console
app.use(morgan(":date[iso] :method :url :status :response-time ms - :res[content-length] :remote-addr"));


// Logging events
cell.events.on("datasourcesLoaded", (datasources) => {
  console.log("Datasources loaded:");

  datasources.forEach((d) => {
    console.log("  ".concat(d.id));
  });

  // Load color ramps
  cell.loadColorRamps();
});

cell.events.on("layersLoaded", (layers) => {
  console.log("Layers loaded:");

  layers.forEach((l) => {
    console.log("  ".concat(l.type, ": ", l.name, " (", l.id, ")"));
  });
});

cell.events.on("colorRampsLoaded", (colorRamps) => {
  console.log("Color ramps loaded:");

  for(var k in colorRamps) {
    c = colorRamps[k];
    console.log("  ".concat(c.id, " (", c.ramp.length, " colors)"));
  }

  // Now load layers
  cell.loadLayers();
})


// Cell server initialization
cell.loadDatasources().catch((error) => { console.log("Error: ".concat(error)) });





/*

  API REST

*/

/*

  Layers info

  id: optional comma-separated list of layers ID to retrieve

*/
app.get("/layers", (req, res) => {
  var out = [];

  cell.layers.forEach((d) => {
    out.push(d.catalog());
  });

  if(req.query.id) {
    var id = req.query.id.split(",");
    var final = out.filter((d) => { return id.indexOf(d.id)>-1 });
  } else {
    var final = out;
  }

  res.status(200).send({ layers: final });
});


/*

  Handshake

*/
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to Cell" })
});


/*

  Renders a layer.

  layer: Layer ID.
  zoom: Map zoom.
  x: Tile x.
  y: Tile y.
  clusters: Clusters.
  colors: Color ramp name.

*/
app.get("/render/:layer/:zoom/:x/:y/:format", (req, res) => {
  var o = cell.getLayer(req.params.layer);

  cell.redis.get(req.url)
  .then((img) => {
    if(!img) {

      //Check if image is in cache
      switch(o.type) {
        case "indicator":
          o.render(parseInt(req.params.zoom), parseInt(req.params.x),
            parseInt(req.params.y), parseInt(req.query.clusters), req.query.colors, req.params.format, req.query.filter)
          .then((buffer) => {
            cell.redis.set(req.url, buffer.toString("hex"));
            res.writeHead(200, {"Content-Type": "image/"+req.params.format});
            res.end(buffer, "binary");
          })
          break;

        case "postgis":
          o.render(parseInt(req.params.zoom), parseInt(req.params.x),
            parseInt(req.params.y), req.params.format, req.query.filter)
          .then((buffer) => {
            cell.redis.set(req.url, buffer.toString("hex"));
            res.writeHead(200, {"Content-Type": "image/"+req.params.format});
            res.end(buffer, "binary");
          })
          break;
      }
    } else {
      res.writeHead(200, {"Content-Type": "image/"+req.params.format});
      res.end(new Buffer(img, "hex"), "binary");
    }
  })
});


/*

  Antigüedad de edificaciones

  Options:
    older: older limit
    newer: newer limit
    box: comma separated box limits
*/
app.get("/ant", (req, res) => {

  var o = cell.getLayer("antiguedad_edificaciones");

  var query = "select pu002, count(pu002) as n from (".concat(o.query, ") f where pu002>1000");
  var conditions = [];

  if ("older" in req.query) conditions.push(" pu002>".concat(req.query.older));
  if ("newer" in req.query) conditions.push(" pu002<".concat(req.query.newer));

  if ("box" in req.query) {
    box = req.query.box.split(",");

    conditions.push("st_intersects(st_transform(st_makeenvelope("
      .concat(box[0], ",", box[1], ",", box[2], ",", box[3], 
      ",4326), 25830), geom)"));
  };

  if (conditions != []) {
    for(var i=0;i<conditions.length;i++) {
      query = query.concat(" and ", conditions[i]);
    }
  };

  query = query.concat(" group by pu002 order by pu002;");

  o.datasource.query(query)
  .then((results) => {
    console.log(results);
    res.status(200).send({ message: results });
  });  

});


// What this module exports
module.exports = app;