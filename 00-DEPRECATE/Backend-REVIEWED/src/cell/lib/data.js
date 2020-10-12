/*

  Data manipulations.

*/

const quantiles = require("compute-nanquantiles");


/*

  Constructor.

*/
Data = function() {}


/*

  Calculate quantiles.

*/
Data.prototype.quantiles = function(data, clusters) {
  q = quantiles(data, clusters);

  final = [q[0]];
  k = 0;

  // Sanitize clusters
  for(var i=1 ; i<q.length ; i++) {
    if(final[k]!=q[i]) {
      final.push(q[i]);
      k++;
    }
  }

  final[final.length-1] = final[final.length-1]+1;

  return final;
}



// Module export
module.exports = {
  Data: Data
}