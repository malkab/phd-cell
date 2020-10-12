/*

  Cell WMS layer object.

  options: Layer options.

*/

layer = require("./layer");


/*

  Constructor

  options: creation options, check metadata database for details.

*/
WmsLayer = function(options) {
  Layer.call(this, options);
}

WmsLayer.prototype = Object.create(Layer.prototype);



/*

  WMS catalog for the API REST.

  returns: WMS catalog info.

*/
WmsLayer.prototype.catalog = function() {
  out = Layer.prototype.catalog.call(this);

  out.service_root = this.service_root;
  out.layers = this.layers;

  return out;
}


/*

  Module exports.

*/
module.exports = {
  WmsLayer: WmsLayer
}