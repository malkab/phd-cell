/*

  Color management.

*/

/*

  Constructor.

*/
ColorRamp = function(id, ramp) {
  this.id = id;
  this.ramp = ramp;
}


/*

  Creates color ramp.

  colors: Source array of colors.

*/
ColorRamp.prototype.getColorRamp = function(clusters) {
  if(this.ramp.length<clusters) {
    return null;
  }

  final = [this.ramp[0]];
  step = this.ramp.length/(clusters-1);

  for(var i=1; i<clusters-1; i++) {
    final.push(this.ramp[Math.floor(i*step)])
  }

  final.push(this.ramp[this.ramp.length-1]);

  return final;
}


// Module exports
module.exports = {
  ColorRamp: ColorRamp
}