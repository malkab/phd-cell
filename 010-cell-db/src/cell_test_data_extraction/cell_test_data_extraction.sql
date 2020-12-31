begin;

-- Test cell
\set z 1
\set x 8
\set y 3

-- Drop schema

drop schema if exists test_cell_data cascade;

-- Create schema

create schema test_cell_data;

-- Create cell test geom
create table test_cell_data.test_cell as
select
  1 as gid,
  st_setsrid(st_geomfromewkt(
    'SRID=3035;POLYGON((3100000 1650000,3100000 1700000,3150000 1700000,3150000 1650000,3100000 1650000))'
  ), 3035) as geom;

-- Extracto MDT
create table test_cell_data.mdt as
select
  a.*
from
  mdt.mdt a inner join
  test_cell_data.test_cell b on
  st_intersects(a.geom, b.geom);

-- Extracto HIC
create table test_cell_data.hic as
select
  a.gid,
  a.codigo,
  st_intersection(a.geom, b.geom) as geom
from
  hic.hic a inner join
  test_cell_data.test_cell b on
  st_intersects(a.geom, b.geom);

-- Extracto EENNPP
create table test_cell_data.eennpp as
select
  a.gid,
  a.figura,
  a.nombre,
  st_intersection(a.geom, b.geom) as geom
from
  context.eennpp a inner join
  test_cell_data.test_cell b on
  st_intersects(a.geom, b.geom);

-- Extracto poblacion
create table test_cell_data.poblacion as
select
  a.*
from
  poblacion.poblacion a inner join
  test_cell_data.test_cell b on
  st_intersects(a.geom, b.geom);

-- Extracto núcleos de población
create table test_cell_data.nucleo_poblacion as
select
  a.gid,
  nombre_pob,
  nivel,
  st_intersection(a.geom, b.geom) as geom
from
  context.nucleo_poblacion a inner join
  test_cell_data.test_cell b on
  st_intersects(a.geom, b.geom);

commit;
