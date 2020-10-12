/*

  PostgreSQL data source.

*/

const pg = require("pg-promise")();
const q = require("q");



/*

  Constructor.

  options: Connection options.

*/
Datasource = function(options){
  Object.assign(this, options);
  Object.assign(this, options.definition);
  delete this.definition;

  this.pool = pg({
    user: this.dbuser,
    database: this.db,
    password: this.dbpass,
    host: this.host,
    port: this.port,
    client_encoding: "UTF8",
    poolSize: 1,
    idleTimeoutMillis: 30000
  });
}


/*

  Launch query.

  query: Query to execute.
  returns: A Q.Promise(rows).

*/
Datasource.prototype.query = function(query) {
  return q.Promise((resolve, reject) => {
    this.pool.query(query)
    .then(
      (results) => {
        resolve(results);
      })
    .catch((error) => { reject(error); });
  })
}


/*

  Returns a Mapnik PostGIS datasource init options based on this datasource.

  srid: SRID init string.
  table: Table.

*/
Datasource.prototype.getMapnikDs = function(srid, table) {
  mds = {
    "dbname": this.db,
    "srid": srid,
    "user": this.dbuser,
    "type": "postgis",
    "table": "(".concat(table, ") foo"),
    "host": this.host,
    "port": this.port,
    "password": this.dbpass,
    "initial_size": this.minpool,
    "max_size": this.maxpool,
    "cursor_size": 10000,
    "connect_timeout": 60000
  };

  return mds;
}


// Module export
module.exports = {
  Datasource: Datasource
}