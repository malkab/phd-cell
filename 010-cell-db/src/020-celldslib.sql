/*

    cellgridlib v0.1

    A library to assist in the gridding process of geographic layers.

*/
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
    grid_id varchar(150),
    value jsonb,
    primary key (grid_id)
);

create index value_gin
on cell_meta.grid
using gin(value);

/*

    The cell_data schema.

*/
-- Schema
create schema cell_data;

/*

    Main cell_data table

    geom geometry: stores the cell geometry in native grid EPSG
    geom_4326 geometry: stores the cell geometry in 4326 for fast frontend rendering

*/
create table cell_data.data(
    grid_id varchar(100),
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

/*

    View to debug JSON output in QGIS

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
            (value -> 'origin' ->> 'x')::float,
            (value -> 'origin' ->> 'y')::float
        ), (value -> 'origin' ->> 'epsg'):: integer)
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
        (value -> 'origin' ->> 'epsg')::integer
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
        (value -> 'zoomlevels' -> _zoomlevel ->> 'size')::float
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

    Sets a cell, with optional overwriting of data branches

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


commit;