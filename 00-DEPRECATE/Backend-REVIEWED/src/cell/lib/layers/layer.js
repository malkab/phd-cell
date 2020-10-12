/*

  Cell base Layer object.

*/


/*

  Constructor

  options: Options object, see metadata database for details.

*/
Layer = function(options) {
  Object.assign(this, options);
  Object.assign(this, options.definition);
  delete this.definition;
}


/*

  Base catalog for the REST API. NOTE: when inheriting, there is no method overriding.

  returns: common catalog for all layer types
*/
Layer.prototype.catalog = function() {
  var out = {
    id: this.id,
    name: this.name,
    short_description: this.short_description,
    long_description: this.long_description,
    type: this.type
  }

  return out;
}


module.exports = {
  Layer: Layer
}