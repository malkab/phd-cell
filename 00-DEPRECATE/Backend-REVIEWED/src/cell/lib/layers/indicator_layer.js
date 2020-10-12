/*

  Cell indicator layer object.

*/

const layer = require("./layer");
const mapnik = require("../mapnik");
const q = require("q");
const data = require("../data");
const tms = require("../tms");



/*

  Constructor.

  options: Creation options.
  cell: Cell parent object.

*/
IndicatorLayer = function(options, cell, clusters, colors) {
  Layer.call(this, options);

  // Mapnik renderer
  // this.mapnik = new Mapnik();

  // Data services
  this.data = new Data();

  // Color ramps
  this.cell = cell;

  // Alpha data pool
  this.alphaDatasource = cell.datasources.filter((d) =>
    { return this.alpha_datasource==d.id })[0];

  // Geom data pool
  this.geomDatasource = cell.datasources.filter((d) =>
    { return this.geom_datasource==d.id })[0];

  // Load Mapnik datasources >> THIS IS CRAP!!!
  this.mapnikDs = {};
  this.styles = {};
  var grids = ["250", "125", "62_5", "31_25"];
  var m = new mapnik.Mapnik();

  for(var i in grids) {
    mds = this.geomDatasource.getMapnikDs(this.srid,
    this.geom_query.replace("##RES##", grids[i]));

    this.mapnikDs[grids[i]] = m.getDatasource(mds);
  }

  // Even more craps
  // Styles
  // CRAP
  var clusters = 28;

  this.getData("250")
  .then((data) => {
    qu = this.data.quantiles(data, clusters);
    co = colors.getColorRamp(clusters-1);
    xml = m.getXmlIntervals(qu, co, this.value_column);

    this.styles["250"] = xml;

    console.log("Created style for ".concat(this.id, " grid ", "250"));
  })

  this.getData("125")
  .then((data) => {

    qu = this.data.quantiles(data, clusters);
    co = colors.getColorRamp(clusters-1);
    xml = m.getXmlIntervals(qu, co, this.value_column);

    this.styles["125"] = xml;

    console.log("Created style for ".concat(this.id, " grid ", "125"));
  })

  this.getData("62_5")
  .then((data) => {

    qu = this.data.quantiles(data, clusters);
    co = colors.getColorRamp(clusters-1);
    xml = m.getXmlIntervals(qu, co, this.value_column);

    this.styles["62_5"] = xml;

    console.log("Created style for ".concat(this.id, " grid ", "62_5"));
  })

  this.getData("31_25")
  .then((data) => {

    qu = this.data.quantiles(data, clusters);
    co = colors.getColorRamp(clusters-1);
    xml = m.getXmlIntervals(qu, co, this.value_column);

    this.styles["31_25"] = xml;

    console.log("Created style for ".concat(this.id, " grid ", "31_25"));
  })

}


// Inheritance
IndicatorLayer.prototype = Object.create(Layer.prototype);


/*

  Render.

  zoom: Map zoom.
  x: Tile x.
  y: Tile y.
  clusters: Clusters.
  colors: Colors.
  grids: Grids.

*/
IndicatorLayer.prototype.render = function(zoom, x, y, clusters, colors, format, filter) {
  return q.Promise((resolve, reject) => {
      var t = new Tms(256);
      var m = new mapnik.Mapnik();

      g = this.getGridSize(zoom, this.grids);
      var ds;

      if(filter) {
        filterDsName = filter+g;

        //if (filterDsName in this.mapnikDs) {
        if(false) {
          // Check if the datasource already exists
          ds = this.mapnikDs[filterDsName];
        } else {
          // Create a new queried Mapnik datasource
          var query = "select * from (".concat(this.geom_query.replace("##RES##", g), ") foo where ", filter);

          var mds = this.geomDatasource.getMapnikDs(this.srid, query);
          this.mapnikDs[filterDsName] = m.getDatasource(mds);

          ds = this.mapnikDs[filterDsName];
        }
      } else {
        // No filter, unqueried DS
        ds = this.mapnikDs[g];
      }

      m.render(this.srid, "+init=epsg:3857",
        ds, 256, 256,
        this.styles[g], t.getTileBounds(zoom, x, y), format)
      .then((buffer) => { resolve(buffer); })
      .catch((err) => { reject(err); });
    });

// End of function
}


/*

  Returns grid size based on zoom.

  zoom: Current map zoom.

*/
IndicatorLayer.prototype.getGridSize = function(zoom, grids) {
  var z = "250";

  for(i in grids) {
    if (i<zoom) {
      z = grids[i];
    }
  }

  return z;
}


/*

  Retrieves data series from database based on zoom.

  zoom: Current grid zoom.
  grids: Grids definition.
  return: A Promise with the data.

*/
IndicatorLayer.prototype.getData = function(gridName) {
  return q.Promise((resolve, reject) => {
    this.alphaDatasource.query(this.alpha_query.replace("##RES##", gridName))
    .then((results) => {
      resolve(results[0].data);
    },
    (error) => { reject(error); })
  })
}


/*

  Indicator catalog for the API REST.

  returns: Indicator catalog info.

*/
IndicatorLayer.prototype.catalog = function() {
  return Layer.prototype.catalog.call(this);
}


/*

  Module exports.

*/
module.exports = {
  IndicatorLayer: IndicatorLayer
}