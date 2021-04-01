/*

    cellgridlib v0.1

    A library to assist in the gridding process of geographic layers.

    Run as cell_master, cell_master must be the owner of all objects and
    cell_readonly must have select permissions.

*/

\set search_path public

\c cell cell_master

begin;

/*

    Cell type.

*/
drop type if exists cell__cell cascade;

create type cell__cell as (
    grid_id varchar(100),
    epsg integer,
    zoom integer,
    x bigint,
    y bigint,
    data jsonb
);

/*

    The cell_meta schema

*/
create schema cell_meta;

-- Main CellDS objects table
create table cell_meta.grid(
    grid_id varchar(64) primary key,
    name varchar(150),
    description text,
    origin_epsg varchar(10),
    origin_x float,
    origin_y float,
    zoom_levels jsonb[]
);

/*

    The cell_data schema.

*/
-- Schema
create schema cell_data;

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
  additional_params jsonb,
  index_variable_key varchar(64)
);

/**

  Variable. Variables are created by GridderTasks, that can create one or many
  of them, and also create catalog entries.

*/
create table cell_meta.variable(
  gridder_task_id varchar(64) references cell_meta.gridder_task(gridder_task_id),
  variable_key varchar(64) unique,
  name text,
  description text,
  primary key (gridder_task_id, variable_key)
);

-- Avoids the inclusion of a variable that has the same name for the same
-- GridderTask. Since many GridderTasks inject lots of variables with a
-- template, this is considered to be safe since the name should be unique
-- within this GridderTask.
alter table cell_meta.variable
add constraint unique_gridder_task_id_name
unique(gridder_task_id, name);

/**

  Catalog. The catalog is a set of key / values for discrete variables to use
  short keys instead of long ones.

*/
create table cell_meta.catalog(
  gridder_task_id varchar(64),
  variable_key varchar(64),
  key varchar(64),
  value varchar(500),
  primary key (gridder_task_id, variable_key, key)
);

alter table cell_meta.catalog
add constraint catalog_variable_fkey
foreign key (gridder_task_id, variable_key) references
cell_meta.variable(gridder_task_id, variable_key);

alter table cell_meta.catalog
add unique(variable_key, value);

/*

    Main cell_data table

    geom geometry: stores the cell geometry in native grid EPSG
    geom_4326 geometry: stores the cell geometry in 4326 for fast frontend rendering

*/
create table cell_data.data(
    grid_id varchar(100) references cell_meta.grid(grid_id),
    epsg integer,
    zoom integer,
    x bigint,
    y bigint,
    data jsonb,
    geom geometry(POLYGON),
    geom_4326 geometry(POLYGON),
    primary key(grid_id, zoom, x, y)
);

create index cell_data_grid_id_btree
on cell_data.data
using btree(grid_id);

create index cell_data_zoom_btree
on cell_data.data
using btree(zoom);

create index cell_data_x_btree
on cell_data.data
using btree(x);

create index cell_data_y_btree
on cell_data.data
using btree(y);

create index cell_data_data_gin
on cell_data.data
using gin(data);

create index cell_data_geom_gist
on cell_data.data
using gist(geom);

create index cell_data_geom_4326_gist
on cell_data.data
using gist(geom_4326);

/**

  Gets the EPSG of the main grid (the first one).

*/
create or replace function cell__getmaingridepsg()
returns integer as
$$

  select origin_epsg::integer
  from cell_meta.grid
  limit 1;

$$
language sql;

/**

  Gets the grid ID of the main grid (the first one).

*/
create or replace function cell__getmaingridid()
returns varchar as
$$

  select grid_id::varchar
  from cell_meta.grid
  limit 1;

$$
language sql;

/**

  Returns a cell__cell object by providing (zoom, x, y) using the main grid
  data.

*/
create or replace function cell__defaultcell(
  _zoom integer,
  _x integer,
  _y integer
) returns cell__cell as
$$

  select (
    cell__getmaingridid(),
    cell__getmaingridepsg(),
    _zoom, _x, _y, '{}'::jsonb
  )::cell__cell

$$
language sql;

/**

  Returns a bbox from an array of floats in the form
  (lower_left_x, lower_left_y, upper_right_x, upper_right_y)

*/
create or replace function cell__bboxfromcorners(
  _bbox float[]
) returns geometry as
$$

  select
    st_setsrid(st_makebox2d(st_point(_bbox[1], _bbox[2]),
	    st_point(_bbox[3], _bbox[4])), cell__getmaingridepsg());

$$
language sql;

/*

  View to debug JSON output in QGIS.

*/
create or replace view cell_data.data_qgis as
select
    grid_id,
    epsg,
    zoom,
    x, y,
    data::varchar as data,
    geom,
    geom_4326
from
    cell_data.data
order by zoom;

/*

  The library code.

*/

/*

    Returns a grid origin point.

    varchar _grid_hash: Grid ID.

    geometry return: The point of origin.

*/
create or replace function public.cell__getgridorigin(
    _grid_id varchar(100)
) returns geometry as
$$
  select st_setsrid(
    st_makepoint(
      origin_x,
      origin_y
    ), origin_epsg::integer)
  from cell_meta.grid
  where grid_id = _grid_id
$$
language sql;

/*

    Returns the SRS of a grid.

*/
create or replace function cell__getgridsrs(
  _grid_id varchar(20)
) returns integer as
$$

  select
    origin_epsg::integer
  from
    cell_meta.grid
  where
    grid_id = _grid_id

$$
language sql;

/*

    Returns the size of a zoom level in a grid

*/
create or replace function public.cell__getzoomlevelsize(
    _grid_id varchar,
    _zoomlevel integer
) returns float as
$$
    select
        (zoom_levels[_zoomlevel+1] ->> 'size')::float
    from cell_meta.grid
    where grid_id = _grid_id
$$
language sql;

/*

    Returns the geom of a cell__cell in its native GRID.

    cell__cell _cell: The cell to compute the geometry from.

    geometry return: The computed geometry.

*/
create or replace function public.cell__cellgeom(
  _cell cell__cell
) returns geometry as
$$

  select
    st_makeenvelope(
      st_x(gridorigin) + ((_cell).x * gridsize),
      st_y(gridorigin) + ((_cell).y * gridsize),
      st_x(gridorigin) + (((_cell).x + 1) * gridsize),
      st_y(gridorigin) + (((_cell).y + 1) * gridsize),
      (_cell).epsg)
  from
    cell__getgridorigin((_cell).grid_id) as gridorigin,
    cell__getzoomlevelsize((_cell).grid_id, (_cell).zoom) as gridsize;

$$
language sql;

/**

  Returns the cell center.

*/
create or replace function public.cell__cellcenter(
  _cell cell__cell
) returns geometry as
$$

  select st_centroid(cell__cellgeom(_cell));

$$
language sql;

/*

    Returns the geom of a cell__cell in it 4326.

    cell__cell _cell: The cell to compute the geometry from.

    geometry return: The computed geometry.

*/
create or replace function public.cell__cellgeom4326(
  _cell cell__cell
) returns geometry as
$$

  select st_transform(cell__cellgeom(_cell), 4326);

$$
language sql;

/*

    Returns the cell a point is on.

    varchar _grid_id: The grid ID.
    integer _zoom: The zoom to compute the cell.
    geometry _point: The target point.

    cell__cell return: The colliding cell.

*/
create or replace function public.cell__cellonpoint(
    _grid_id varchar(20),
    _zoom integer,
    _point geometry
) returns cell__cell as
$$

    select (
        _grid_id,
        srs,
        _zoom,
        floor((st_x(ppoint)-st_x(gridorigin)) / gridsize),
        floor((st_y(ppoint)-st_y(gridorigin)) / gridsize),
        '{}'::jsonb)::cell__cell
    from
        cell__getgridsrs(_grid_id) as srs,
        st_transform(_point, srs) as ppoint,
        cell__getzoomlevelsize(_grid_id, _zoom) as gridsize,
        cell__getgridorigin(_grid_id) as gridorigin

$$
language sql;

/*

    Returns all cells that covers the BBOX of a geometry.

    varchar _grid_id: The grid ID.
    integer _zoom: The target zoom.
    geometry _geom: The geometry.

    setof cell__cell return: The colliding cells.

*/
create or replace function cell__getbboxcoverage(
    _grid_id varchar(20),
    _zoom integer,
    _geom geometry
) returns setof cell__cell as
$$

    select
        (_grid_id, srid, _zoom, sx, sy, '{}'::jsonb)::cell__cell
    from
        cell__getgridsrs(_grid_id) as srid,
        st_envelope(_geom) as env,
        cell__cellonpoint(_grid_id, _zoom,
            st_setsrid(st_makepoint(st_xmin(env), st_ymin(env)), srid)) as mincell,
        cell__cellonpoint(_grid_id, _zoom,
            st_setsrid(st_makepoint(st_xmax(env), st_ymax(env)), srid)) as maxcell,
        generate_series(mincell.x, maxcell.x) as sx,
        generate_series(mincell.y, maxcell.y) as sy;

$$
language sql;

/*

    Returns all cells that covers a geometry.

    varchar _grid_id: The grid ID.
    integer _zoom: The target zoom.
    geometry _geom: The target geometry.

    setof cell__cell return: The colliding cells.

*/
create or replace function cell__getcoverage(
    _grid_id varchar(20),
    _zoom integer,
    _geom geometry
) returns setof cell__cell as
$$

    select distinct
        (a.*)::cell__cell
    from
        cell__getbboxcoverage(_grid_id, _zoom, _geom) a inner join
        (select _geom as geom) b on
        st_intersects(cell__cellgeom(a), b.geom);

$$
language sql;

/*

    Sets a cell, without overwritting data. New data will be added to the cell.

*/
create or replace function public.cell__setcell(
    _cell cell__cell
) returns void as
$$

    insert into cell_data.data as d
    values (
        (_cell).grid_id,
        (_cell).epsg,
        (_cell).zoom,
        (_cell).x,
        (_cell).y,
        (_cell).data::jsonb,
        cell__cellgeom(_cell),
        cell__cellgeom4326(_cell)
    ) on conflict(grid_id, zoom, x, y) do update
    set data = d.data || (_cell).data
    where d.grid_id=d.grid_id and d.zoom=d.zoom and d.x=d.x and d.y=d.y;

$$
language sql;

/*

    Builds a new JSON branch on an existing JSONB.

    This function makes a new branch to grow in an existing JSONB.
    The first argument is the JSONB to be modified, the second, the
    new branch. Branches must follow the following convention:

        '{"a": {"b": {"c": 343}}}'

    that is, must be a sequence of nested grid_ids, with only a single
    child, up to a final scalar data.

    This function won't overwrite an existing branch.

    jsonb _jsonb: The JSON to write upon.
    jsonb _jsonb_new: The new branch to write.

    jsonb return: The composed JSON.

*/
create or replace function public.cell__buildbranch(
    _jsonb jsonb,
    _jsonb_new jsonb
) returns jsonb as
$$
declare
    _key text;
    _value jsonb;
    _keys text[];
begin

    -- Initialization
    _keys = array[]::text[];

    -- Main loop
    loop

        -- Traverse the structure
        _key = jsonb_object_keys(_jsonb_new);
        _keys = _keys || _key;
        _value = _jsonb_new -> _key;

        -- If route doesn't exist, create it and exit
        if _jsonb #> _keys is null then
            _jsonb = jsonb_set(_jsonb, _keys, _value);
            exit;
        end if;

        -- Iterate to next element
        _jsonb_new = _value;

        -- Safeguard to exit in case final element is reached
        -- and element already existed
        exit when jsonb_typeof(_value)<>'object';

    end loop;

    return _jsonb;

end;
$$
language plpgsql;

/*

    Inserts a new JSON branch on an existing cell.

    This function makes a new branch to grow in a cell's data.
    Argument is a cell with the same definition as the cell intended
    to be modified, whose JSONB data is the definition of the new
    branch.

    This function won't overwrite an existing branch.

    cell__cell _cell: The cell containing the new JSON payload.

*/
create or replace function public.cell__insertbranch(
    _cell cell__cell
) returns void as
$$

    insert into cell_data.data as d
    values(
        (_cell).grid_id,
        (_cell).epsg,
        (_cell).zoom,
        (_cell).x,
        (_cell).y,
        (_cell).data,
        cell__cellgeom(_cell)
    ) on conflict(grid_id, zoom, x, y) do update
    set data = cell__buildbranch(d.data, (_cell).data)
    where d.grid_id=d.grid_id and d.zoom=d.zoom and d.x=d.x and d.y=d.y;

$$
language sql;

/**

  Get all cells that has in its data the given variable keys (_varkeys). The
  presence of the variable keys can be obtained either with AND or OR
  (set _and to true for an AND, false for an OR, defaults to AND). Optionally,
  a zoom (_zoom) filter can be provided to get only the cells at that zoom
  level, or a geometry. Set both to null for no filters.

*/
create or replace function public.cell__getcellsbyvarkeys(
  _varkeys varchar[],
  _and boolean,
  _zoom integer,
  _geom geometry
) returns setof cell_data.data as
$$
declare
  _sql text;
  _jsonb_object_keys text;
  _jsonb_object_values text;
  _where text;
  _x varchar;
  _bool varchar;
begin

  _jsonb_object_keys = '';
  _jsonb_object_values = '';
  _where = '(';

  if _and is true then
    _bool = 'and';
  else
    _bool = 'or';
  end if;

  if _and is null then
    _bool = 'and';
  end if;

  foreach _x in array _varkeys loop

    _jsonb_object_keys = _jsonb_object_keys || format('''%s'',', _x);
    _jsonb_object_values = _jsonb_object_values ||
      format('data ->> ''%s'',', _x);
    _where = _where || format('data @? ''$."%s"''::jsonpath %s ', _x, _bool);

  end loop;

  _jsonb_object_keys = trim(trailing ',' from _jsonb_object_keys);
  _jsonb_object_values = trim(trailing ',' from _jsonb_object_values);
  _where = trim(trailing format(' %s ', _bool) from _where) || ')';

  if _zoom is not null then

    _where = _where || format(' and zoom = %s', _zoom);

  end if;

  if _geom is not null then

    _where = _where || format(' and ''%s''::geometry && geom', _geom);

  end if;

  _sql = format('
    select
      grid_id,
      epsg,
      zoom,
      x,
      y,
      jsonb_object(ARRAY[ %s ], ARRAY[ %s ]),
      geom,
      geom_4326
    from cell_data.data
    where %s
    ', _jsonb_object_keys, _jsonb_object_values, _where);

  return query execute _sql;

end;
$$
language plpgsql;

/**

  Returns all variable keys for a given GridderTask ID as an array of varchars.

*/
create or replace function cell__getvariablekeysbygriddertaskid(
  _griddertaskid varchar(64)
) returns varchar[] as
$$

  select array_agg(variable_key)
  from cell_meta.variable
  where gridder_task_id = $1;

$$
language sql;

/**

  Returns the index variable key for a GridderTask.

*/
create or replace function cell__getindexvariablekeybygriddertaskid(
  _griddertaskid varchar(64)
) returns varchar as
$$

  select index_variable_key
  from cell_meta.gridder_task
  where gridder_task_id = $1;

$$
language sql;

/**

  Drops a Gridder Task and all its dependencies, but not the data from the
  cell vectors (use cell__deletecelldatavectorvars for that):

  - all Variables in cell_meta.variable;
  - the Gridder Task itself at cell_meta.gridder_task.

  If the Gridder Task referenced by the ID exists, the function will
  return the ID. If not, will return null.

*/
create or replace function cell__deletegriddertask(
  _gridder_task_id varchar
) returns varchar as
$$

  delete from cell_meta.variable
  where gridder_task_id = $1;

  delete from cell_meta.gridder_task
  where gridder_task_id = $1
  returning gridder_task_id;

$$
language sql;

/**

  Drops all the variables from a GridderTask in cell data vectors
  for a given zoom and geometry. Must be done in tiny steps because it's a
  huge query.

*/
create or replace function cell__deletecelldatavectorvars(
  _gridder_task_id varchar,
  _zoom integer,
  _geom geometry
) returns text[] as
$$

  with variable_keys as (
    select
      array_agg(variable_key)::text[] as keys
    from
      cell_meta.variable
    where gridder_task_id = $1
    order by keys
  ),
  cells as (
    select *
    from cell_data.data
    where st_intersects($3, geom) and zoom = $2
  )
  update cell_data.data d
  set data = d.data - a.keys
  from (
    select * from cells, variable_keys
  ) a
  where
    a.keys is not null and d.zoom = a.zoom and d.x = a.x and d.y = a.y
  returning a.keys;

$$
language sql;

/*

    JSONB Array functions.

    These are a set of functions to operate statistically on
    JSONB array results.

*/
create or replace function jsonsum(jsonb)
returns numeric as $$

    select sum(a::numeric)
    from jsonb_array_elements_text($1) as a;

$$ language sql
returns null on null input;


create or replace function jsonavg(jsonb)
returns numeric as $$

    select avg(a::numeric)
    from jsonb_array_elements_text($1) as a;

$$ language sql
returns null on null input;


create or replace function jsonstddev(jsonb)
returns numeric as $$

    select stddev(a::numeric)
    from jsonb_array_elements_text($1) as a;

$$ language sql
returns null on null input;


create or replace function jsonmin(jsonb)
returns numeric as $$

    select min(a::numeric)
    from jsonb_array_elements_text($1) as a;

$$ language sql
returns null on null input;


create or replace function jsonmax(jsonb)
returns numeric as $$

    select max(a::numeric)
    from jsonb_array_elements_text($1) as a;

$$ language sql
returns null on null input;

/**

    Utility views.

*/
-- Zooms above 5 to speed up visulization in QGIS
create view cell_data.zoom_0_4 as select * from cell_data.data where zoom < 5;

/**

  Permissions for the cell_readonly user.

*/
grant usage on schema cell_data
to cell_readonly;

grant usage on schema cell_meta
to cell_readonly;

grant usage on schema public
to cell_readonly;

grant select on all tables in schema cell_data
to cell_readonly;

grant select on all tables in schema cell_meta
to cell_readonly;

grant select on all tables in schema public
to cell_readonly;

commit;
