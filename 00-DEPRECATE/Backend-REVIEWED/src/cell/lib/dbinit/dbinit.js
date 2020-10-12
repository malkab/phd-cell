/*

    Initializes the metadata database.

*/

"use strict";

// Modules
const pg = require("pg-promise")();
const path = require("path");

// Helper to access SQL files
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pg.QueryFile(fullPath, {minify: true});
}

// Initializing function
function init(host, port, postgres_password, cellmetadata_user_password) {
    console.log("Initializing metadata database...");

    // Connection to postgres database
    var cnPostgres = {
        host: host,
        port: port,
        database: "postgres",
        user: "postgres",
        password: postgres_password,
        poolSize: 5,
        poolIdleTimeout: 10000
    };

    // Connection to the metadata database
    var cnMetadata = {
        host: host,
        port: port,
        database: "cellmetadata",
        user: "cellmetadatauser",
        password: cellmetadata_user_password,
        poolSize: 5,
        poolIdleTimeout: 10000
    };

    // Create
    var createUserFile = sql("sql/00-Create_user.sql");
    var createDbFile = sql("sql/10-Create_DB.sql");
    var schemaFile = sql("sql/20-Schema-DDL.sql");

    // Initialize connection to postgres db
    var db = pg(cnPostgres);

    db.none(createUserFile, [cellmetadata_user_password])
        .then(() => {
            return db.none(createDbFile) 
        })
        .then(() => {
            var db = pg(cnMetadata);
            return db.none(schemaFile)
        })
        .then(success => { 
            console.log("Schema created successfully...");
            pg.end();
        })
        .catch(error => { 
            console.log(error.code, error.toString()); 
            pg.end();
        })
}


// Module exports
module.exports = {
    init: init
}