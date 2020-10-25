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
  name varchar(150),
  description text,
  application_name varchar(64),
  db varchar(64),
  host varchar(64),
  max_pool_size integer,
  min_pool_size integer,
  pass varchar(64),
  port integer,
  db_user varchar(64)
);

/**

  Variable

*/
create table cell_meta.variable(
  variable_id varchar(64) primary key,
  name varchar(150),
  description text
);

/**

  Version

*/
create table cell_meta.cell_version(
  cell_version varchar(64),
  cell_build varchar(64)
);

/**

  GridderTasks

*/
create table cell_meta.gridder_task(
  gridder_task_id varchar(64) primary key,
  gridder_task_type varchar(64),
  name varchar(150),
  description text,
  pg_connection_id varchar(64),
  source_table varchar(150),
  name_template varchar(300),
  description_template text,
  additional_params jsonb
);

commit;
