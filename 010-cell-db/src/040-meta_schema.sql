/**

  Define objects tables at cell_meta for ORM.

*/
begin;

/**

  catalog

*/
create table cell_meta.catalog(
  catalog_id varchar(64) primary key,
  name varchar(150),
  title varchar(300),
  description text,
  pg_connection_id varchar(64),
  source_table varchar(150),
  source_field varchar(150),
  forward jsonb,
  backward jsonb
);

create index catalog_forward_gin
on cell_meta.catalog
using gin(forward);

create index catalog_backward_gin
on cell_meta.catalog
using gin(backward);

/**

  pg_connection

*/
create table cell_meta.pg_connection(
  pg_connection_id varchar(64) primary key,
  application_name varchar(64),
  db varchar(64),
  host varchar(64),
  max_pool_size integer,
  min_pool_size integer,
  pass varchar(64),
  port integer,
  db_user varchar(64),
  name varchar(150),
  title varchar(300),
  description text
);

/**

  Variable

*/
create table cell_meta.variable(
  variable_id varchar(64) primary key,
  name varchar(150),
  title varchar(300),
  description text,
  pg_connection_id varchar(64),
  -- Name of the table and field
  source_table varchar(150),
  source_field varchar(150)
);

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

/**

  Version

*/
create table cell_meta.cell_version(
  cell_version varchar(64),
  cell_build varchar(64)
);

commit;
