/*

  TMS calculations object.

*/

/*

  Constructor.

  tileSize: Tile size (defaults to 256).

*/
Tms = function(tileSize) {
  this.srid = {
      "4326": "EPSG:4326 WGS84 Geographics",
      "3857": "EPSG:3857 Google Mercator"
  }

  this.tileSize = tileSize ? tileSize : 256;
  this.originShift = Math.PI*6378137.0;
  this.initialResolution = 2*Math.PI*6378137.0/this.tileSize;
}


/*

  Returns bounds for a tile in 3857.

  zoom: Zoom.
  x: X.
  y: Y.

*/
Tms.prototype.getTileBounds = function(zoom, x, y) {
  length = 2*Math.PI*6378137.0/Math.pow(2, zoom);

  return [
    (x*length)-this.originShift,
    -((y*length)+length-this.originShift),
    (x*length)+length-this.originShift,
    -((y*length)-this.originShift)];
}



// Module exports
module.exports = {
  Tms: Tms
}




//
//
// /*
//
//   Coordinate object.
//
//   srid: Coordinate SRID.
//   x: X.
//   y: Y.
//
// */
// Coordinate = function(srid, x, y) {
//   this.srid = srid;
//   this.x = x;
//   this.y = y;
// }
//
//
// /*
//
//   Tile object.
//
//   zoom: Zoom level.
//   x: X.
//   y: Y.
//
// */
// Tile = function(zoom, x, y) {
//   this.zoom = zoom;
//   this.x = x;
//   this.y = y;
// }
//
//
// Tile.prototype.length = function() {
//   return 2*Math.PI*6378137/Math.pow(2, this.zoom);
// }
//
//
// Tile.prototype.bounds = function(originShift) {
//   length = this.length();
//
//   minxy = new Coordinate(3857, (this.x*length)-this.originShift,
//                                (this.y*length)-this.originShift);
//   maxxy = new Coordinate(3857, (this.x*length)+length-this.originShift,
//                                (this.y*length)+length-this.originShift);
//
//   return [minxy.x, -maxxy.y, maxxy.x, -minxy.y];
// }