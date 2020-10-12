/*

  Cell Mapbox layer object.

  options: Layer options.

*/

layer = require("./layer");

// Constructor
MapboxLayer = function(options) {
  Layer.call(this, options);
}

MapboxLayer.prototype = Object.create(Layer.prototype);


/*

  Mapbox catalog for the API REST.

  returns: Mapbox catalog info.

*/
MapboxLayer.prototype.catalog = function() {
  out = Layer.prototype.catalog.call(this);

  out.style = this.style;
  out.access_token = this.access_token;

  return out;
}


/*

  Module exports.

*/
module.exports = {
  MapboxLayer: MapboxLayer
}