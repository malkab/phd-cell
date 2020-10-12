/*

  Main Cell object.

*/

// Modules include
const pg = require("pg-promise")();
const wmsLayer = require("./lib/layers/wms_layer");
const mapboxLayer = require("./lib/layers/mapbox_layer");
const indicatorLayer = require("./lib/layers/indicator_layer");
const postgisLayer = require("./lib/layers/postgis_layer");
const datasource = require("./lib/datasource");
const redis = require("./lib/redis");
const color = require("./lib/color");
const q = require("q");
const eventEmitter = require("events");
class CellEvents extends eventEmitter {};


// Constructor
Cell = function(options) {
  Object.assign(this, options);

  // Layers
  this.layers = [];

  // Datasources
  this.datasources = [];

  // Color ramps
  this.colorRamps = {};

  // Redis client
  this.redis = new redis.Redis("redis");

  // Pool
  this.pool = pg(options);

  // Event emitter
  this.events = new CellEvents();
}


/*

  Load color ramps.

  return: Q.Promise(colors)

*/
Cell.prototype.loadColorRamps = function() {
  return q.Promise((resolve, reject) => {
    this.pool.query("select * from app.color_ramp;")
    .then(
      (results) => {
        results.forEach((c) => {
          this.colorRamps[c.id] = new color.ColorRamp(c.id, c.definition.colors);
        });

        this.events.emit("colorRampsLoaded", this.colorRamps);

        resolve(this.colorRamps);
      },
      (error) => { reject(error); })
  })
}


/*

  Load layers.

  return: Q.Promise(layers)
  events: layersLoaded(layers)

*/
Cell.prototype.loadLayers = function() {
  return q.Promise((resolve, reject) => {
    this.pool.query("select * from app.layer order by initial_order, name;")
    .then(
      (results) => {
        results.forEach((d) => {
            console.log(d);
            switch(d.type) {
              case "wms":
                this.layers.push(new WmsLayer(d));
                break;

              case "mapbox":
                this.layers.push(new MapboxLayer(d));
                break;

              case "indicator":
                this.layers.push(new IndicatorLayer(d, this, 28,
                  this.colorRamps["blue-orange-red"]));
                break;

              case "postgis":
                this.layers.push(new PostgisLayer(d, this));
                break;
          }
      });

      this.events.emit("layersLoaded", this.layers);

      resolve(this.layers);
    },
    (error) => { reject(error); })
  })
}


/*

  Load datasources.

  return: Q.Promise(datasources)
  events: datasourcesLoaded(datasources)

*/
Cell.prototype.loadDatasources = function() {
  return q.Promise((resolve, reject) => {
    this.pool.query("select * from app.datasource order by id;")
    .then(
      (results) => {
        results.forEach((d) => {
          this.datasources.push(new datasource.Datasource(d));
        });

        this.events.emit("datasourcesLoaded", this.datasources);

        resolve(this.datasources);
      })
      .catch((error) => { reject(error); });
  })
}


/*

  Gets a layer by ID.

  id: Layer's ID to retrieve.

*/
Cell.prototype.getLayer = function(id) {
  return this.layers.filter((d) => { return d.id==id; })[0];
}


/*

  Module exports definition

*/
module.exports = function(options) { return new Cell(options) };