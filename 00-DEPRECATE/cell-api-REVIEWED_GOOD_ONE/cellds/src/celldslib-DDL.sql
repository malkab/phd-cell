/*

    cellgridlib v0.1

    A library to assist in the gridding process of geographic layers.

*/


create database cellds;

\c cellds

create extension postgis;


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

    The meta schema

*/

create schema meta;


-- Main CellDS objects table

create table meta.celldsobject(
    id varchar(100),
    initialization jsonb,
    primary key (id)
);

create index initialization_gin
on meta.celldsobject
using gin(initialization);


-- Type for the CellObjectId

drop type if exists cell__cellobjectid cascade;

create type cell__cellobjectid as (
    type varchar(25),
    id varchar(75)
);


-- Function to split the CellObjectId

create or replace function cell__cellobjectid(
    _id varchar(100)
) returns cell__cellobjectid as
$$
    select (split_part(_id, ':', 1), split_part(_id, ':', 2))::cell__cellobjectid;
$$
language sql;






/*

    The data schema.

*/



-- Schema
create schema data;


/*

    Main data table

    geom geometry: stores the cell geometry in native grid EPSG
    geom_4326 geometry: stores the cell geometry in 4326 for fast frontend rendering

*/

create table data.data(
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

create index data_grid_id_btree
on data.data
using btree(grid_id);

create index data_zoom_btree
on data.data
using btree(zoom);

create index data_x_btree
on data.data
using btree(x);

create index data_y_btree
on data.data
using btree(y);

create index data_data_gin
on data.data
using gin(data);

create index data_geom_gist
on data.data
using gist(geom);

create index data_geom_4326_gist
on data.data
using gist(geom_4326);




/*

    View to debug JSON output in QGIS

*/

create or replace view data.data_qgis as
select
    grid_id,
    epsg,
    zoom,
    x, y,
    data::varchar as data,
    geom,
    geom_4326
from
    data.data
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
            (initialization -> 'origin' ->> 'x')::float,
            (initialization -> 'origin' ->> 'y')::float
        ), (initialization -> 'origin' ->> 'epsg'):: integer)
    from meta.celldsobject
    where id = 'Grid:' || _grid_id
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
        (initialization -> 'zoomlevels' -> _zoomlevel ->> 'size')::float
    from meta.celldsobject
    where id = 'Grid:' || _grid_id
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

    Sets a cell, with optional overwritting of data branches

*/

create or replace function public.cell__setcell(
    _cell cell__cell
) returns void as
$$

    insert into data.data as d
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



commit;
