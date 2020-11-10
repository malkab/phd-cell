/**

  Define objects tables at cell_meta for ORM.

*/
begin;

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

  Version

*/
create table cell_meta.cell_version(
  cell_version varchar(64),
  cell_build varchar(64)
);

/**

  GridderTasks. GridderTasks are at the top of the hierarchy of data structure.
  GridderTasks generate one or more variables with optionally catalogs entries.

*/
create table cell_meta.gridder_task(
  gridder_task_id varchar(64) primary key,
  gridder_task_type varchar(64),
  -- This is the name of the specific GridderTask
  name varchar(150),
  -- This is the description of the specific GridderTask
  description text,
  source_table varchar(150),
  geom_field varchar(150),
  additional_params jsonb
);

/**

  Variable. Variables are created by GridderTasks, that can create one or many
  of them, and also create catalog entries.

*/
create table cell_meta.variable(
  gridder_task_id varchar(64) references cell_meta.gridder_task(gridder_task_id),
  variable_id varchar(64),
  key varchar(64) unique,
  name varchar(150),
  description text,
  primary key (gridder_task_id, variable_id)
);

/**

  Catalog. The catalog is a set of key / values for discrete variables to use
  short keys instead of long ones.

*/
create table cell_meta.catalog(
  gridder_task_id varchar(64),
  variable_id varchar(64),
  key varchar(64),
  value varchar(500),
  primary key (gridder_task_id, variable_id, key)
);

alter table cell_meta.catalog
add constraint catalog_variable_fkey
foreign key (gridder_task_id, variable_id) references
cell_meta.variable(gridder_task_id, variable_id);

/**

  GridderJob: the application of GridderTask to an area and between two zoom
  levels.

*/
create table cell_meta.gridder_job(
  gridder_job_id varchar(64) primary key,
  gridder_task_id varchar(64) references cell_meta.gridder_task(gridder_task_id),
  max_zoom_level integer,
  min_zoom_level integer,
  sql_area_retrieval text,
  area geometry(polygon, 4326)
);

/**

  GridderCell: a job from a GridderJob on a given cell.

*/
create table cell_meta.gridder_cell(
  gridder_cell_id varchar(64) primary key,
  gridder_job_id varchar(64) references cell_meta.gridder_job(gridder_job_id),
  cell cell__cell
);

commit;
