/**

  Vectors

*/
create table cell_meta.vector(
  vector_id varchar(64) primary key,
  name varchar(150),
  title varchar(300),
  description text,
  pg_connection_id varchar(64),
  source_table varchar(64),
  -- These are the names of existing Catalogs to use
  catalog_names varchar(64)[],
  -- These are the mappings of the field names to the above Catalogs
  catalog_field_names varchar(64)[],
  -- All variables must be of the same PgConnection and table
  variable_names varchar(64)[]
);
