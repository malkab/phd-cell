begin;

drop schema if exists test_mdt_convolution cascade;

create schema test_mdt_convolution;

create table test_mdt_convolution.cell_center as
select
  1 as gid,
  st_setsrid(st_makepoint(2932562.5, 1740062.5), 3035) as geom;

create table test_mdt_convolution.points_within_distance as
with center as (
  select geom from test_mdt_convolution.cell_center
),
nearest_points as (
  select a.geom as geom
  from mdt.mdt a, center
  where st_dwithin(center.geom, a.geom, 200)
)
select
  row_number() over () as gid,
  geom
from nearest_points;

create table test_mdt_convolution.nearest_points as
with center as (
  select geom from test_mdt_convolution.cell_center
),
nearest as (
  select
    a.geom as geom,
    st_distance(a.geom, b.geom) as d
  from
    test_mdt_convolution.points_within_distance a,
    center b
  order by d asc
  limit 6
)
select
  row_number() over () as gid,
  *
from
  nearest;

create table test_mdt_convolution.lines as
select
  row_number() over (),
  b.d,
  st_setsrid(st_makeline(
    a.geom,
    b.geom
  ), 3035)
from
  test_mdt_convolution.cell_center a,
  test_mdt_convolution.nearest_points b;


commit;
