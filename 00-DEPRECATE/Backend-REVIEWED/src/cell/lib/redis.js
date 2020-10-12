/*

  Promified Redis cache proxy.

*/

const redis = require("redis");
const q = require("q");



/*

  Constructor.

  host: Redis host.

*/
Redis = function(host) {
  this.rclient = redis.createClient({host: host});
}


/*

  Get key.

  key: Key to retrieve.
  return: Q.Promise with value.

*/
Redis.prototype.get = function(key) {
  return q.Promise((resolve, reject) => {
    this.rclient.get(key, (err, value) => {
      if(err) reject(err);
      resolve(value);
    })
  })
}


/*

  Set key.

  key: Key to store.
  value: Value to store.

*/
Redis.prototype.set = function(key, value) {
  this.rclient.set(key, value);
}




// Module exports
module.exports = {
  Redis: Redis
}