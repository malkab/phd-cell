/*

  PostGIS layer.

*/

const layer = require("./layer");
const mapnik = require("../mapnik");
const tms = require("../tms");
const q = require("q");



/*

  Constructor.

  options: Creation options.

*/
PostgisLayer = function(options, cell) {
  Layer.call(this, options);

  // This is the Mapnik datasources collection for 
  // unqueried and queried access
  this.mapnikDs = {};

  // Datasource
  this.datasource = cell.datasources.filter(
    (d) => { return d.id==this.datasource })[0];

  // The unqueried Mapnik datasource
  var m = new mapnik.Mapnik();

  this.mapnikDs["unqueried"] = m.getDatasource(
      this.datasource.getMapnikDs(this.srid, this.query));

  this.cell = cell;
}


// Inheritance
PostgisLayer.prototype = Object.create(Layer.prototype);


/*

  Render.

*/
PostgisLayer.prototype.render = function(zoom, x, y, format, filter) {
  return q.Promise((resolve, reject) => {

    var t = new Tms(256);
    var m = new mapnik.Mapnik();
    var ds;

    // Apply filter
    if(filter) {
      // Check if already exists the queried datasource
      if (filter in this.mapnikDs) {
        ds = this.mapnikDs[filter];
      } else {
        // Create the new queried Mapnik datasource
        var query = "select * from (".concat(this.query, ") foo where ", filter);

        this.mapnikDs[filter] = m.getDatasource(
          this.datasource.getMapnikDs(this.srid, query));

        ds = this.mapnikDs[filter];
      }
    } else {
      // No filter, unqueried DS
      ds = this.mapnikDs["unqueried"];
    };

    m.render(this.srid, "+init=epsg:3857",
      ds, 256, 256,
      this.style, t.getTileBounds(zoom, x, y), format)
    .then((buffer) => {
      resolve(buffer);
    })
  })
}


/*

  Module exports.

*/
module.exports = {
  PostgisLayer: PostgisLayer
}