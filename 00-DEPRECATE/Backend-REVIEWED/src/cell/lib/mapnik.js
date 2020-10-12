/*

  Mapnik renderer.

*/


// Modules
const mapnik = require("mapnik");
const eventEmitter = require("events");
const q = require("q");
class mapnikEvents extends eventEmitter {};


// Mapnik initialization
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

console.log("Mapnik renderer initialized:");

mapnik.datasources().forEach((d) => {
  console.log("  Format: ".concat(d));
});

mapnik.fonts().forEach((d) => {
  console.log("  Font: ".concat(d));
});



/*

  Constructor

*/
Mapnik = function() {
  this.events = new mapnikEvents();
}


/*

  Returns a datasource.

  options: Initialization options.

*/
Mapnik.prototype.getDatasource = function(options) {
  return new mapnik.Datasource(options);
}


/*

  Returns an XML style with intervals and colors. Clusters and colors
  must have the same size.

  clusters: Clusters.
  colors: Colors.
  dataColumn: Data column.

*/
Mapnik.prototype.getXmlIntervals = function(clusters, colors, dataColumn) {
  var style = "<Map><Style name='Style'>"

  for(var i=0; i<clusters.length-1; i++) {
    style += "<Rule><PolygonSymbolizer fill='".concat(
    colors[i], "'/><Filter>[", dataColumn, "] &gt;= ", clusters[i], " and [", dataColumn, "] &lt; ", clusters[i+1], "</Filter></Rule>");
  }

  style += "</Style></Map>";

  return style;
}


/*

  Renders an image.

  layerSrs (string): Layer PROJ4 projection string.
  mapSrs (string): Map PROJ4 projection string.
  datasource (datasource.Datasource): Layer datasource.
  width (integer): Image width.
  height (integer): Image height.
  style (string): XML style.
  bounds (float array): Float array [minx, miny, maxx, maxy].
  imageFormat (string): Mapnik image format (png).

*/
Mapnik.prototype.render = function(layerSrs, mapSrs, datasource, width, height, style, bounds, imageFormat) {
  return q.Promise((resolve, reject) => {
    var s = new mapnik.Layer("layer", layerSrs);
    s.datasource = datasource;
    s.styles = ["Style"];

    var map = new mapnik.Map(width, height);
    map.srs = mapSrs;
    map.fromStringSync(style);
    map.add_layer(s);
    map.extent = bounds;

    var im = new mapnik.Image(width, height);

    map.render(im, (err, im) => {
      if (err) reject(err);
      try {
        im.encode(imageFormat, (err, buffer) => {
          if (err) reject(err);

          resolve(buffer);
        })
      }
      catch(err) {
        console.log("Cannot encode image: ".concat(layerSrs, mapSrs, datasource, width, height, style, bounds, imageFormat));

        reject(err);
      }
    })
  })
}


// Module export
module.exports = {
  Mapnik: Mapnik
}