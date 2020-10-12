/*

    Creation of the DBStatus database schema.

*/

create extension postgis;


/*

    Database schema

*/

-- Schema

create schema jobs;


-- Jobs table

create table jobs.job(
    hash char(64),
    name varchar(100),
    description text,
    datasource jsonb,
    cellds jsonb,
    adscriptionmethod jsonb,
    status integer,
    bbox geometry(POLYGON),
    primary key (hash)
);

create index bbox_gist
on jobs.job
using gist(bbox);





/*

    Functions

*/







/*





    TEST ZONE




*/



create or replace function cell__createjob(
    _hash char,
    _name varchar,
    _description text,
    _dataSource text,
    _cellDs text,
    _adscriptionMethod text,
    _status integer,
    _bbox text
) returns void as
$$

    insert into jobs.job
    values(
        _hash,
        _name,
        _description,
        _dataSource::jsonb,
        _cellDs::jsonb,
        _adscriptionMethod::jsonb,
        _status,
        st_geomfromgeojson(_bbox)
    );

$$
language sql;


create table jobs.celljob(
    job_hash char(64),
    cell_grid jsonb,
    cell_epsg integer,
    cell_zoom integer,
    cell_x bigint,
    cell_y bigint,
    primary key (job_hash, cell_grid, cell_zoom, cell_x, cell_y)
);










-- Creates a bbox from the bbox definition of a job

-- create or replace function cell__createbbox(
--     _bbox jsonb
-- ) returns geometry as
-- $$
-- declare
--     _geom geometry;
-- begin

--     _geom = st_setsrid(st_makepolygon(st_makeline(
--         array[
--             st_makepoint((_bbox ->> 'minx')::float, (_bbox ->> 'miny')::float),
--             st_makepoint((_bbox ->> 'maxx')::float, (_bbox ->> 'miny')::float),
--             st_makepoint((_bbox ->> 'maxx')::float, (_bbox ->> 'maxy')::float),
--             st_makepoint((_bbox ->> 'minx')::float, (_bbox ->> 'maxy')::float),
--             st_makepoint((_bbox ->> 'minx')::float, (_bbox ->> 'miny')::float)
--         ]::geometry[]
--     )), (_bbox ->> 'epsg')::integer);

--     return _geom;        

-- end;
-- $$
-- language plpgsql;


-- Creates a new job based on the JSON definition

-- create or replace function cell__createjob(
--     _data jsonb
-- ) returns char as
-- $$
-- declare
--     _hash char(42);
-- begin

--     _hash = digest(
--                 (now()::varchar || (_data ->> 'jobName') || 
--                 (_data ->> 'jobDescription'))::text,
--                 'sha1'::text)::char(42);

--     insert into jobs.job
--     values(
--         _hash,
--         _data ->> 'jobName',
--         _data ->> 'jobDescription',
--         _data -> 'dataSource',
--         _data -> 'cellDs',
--         _data -> 'adscriptionMethod',
--         cell__createbbox(_data -> 'bbox')
--     );

--     return _hash;

-- end;
-- $$
-- language plpgsql;