begin;

/**

  NEEDS THE CREATION OF A TEST_CELL_DATA.TEST_CELL TABLE
  WITH A GID = 1 AND THE GEOM OF THE TEST CELL (1,8,3).

/**

  MDT stats

*/
drop table if exists test_cell_data.mdt_stats;

create table test_cell_data.mdt_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
)
select
  count(a.*) as number_of_mdt_points,
  b.test_cell_area / count(a.*) as area_per_point
from
  test_cell_data.mdt a,
  area_test_cell b
group by
  b.test_cell_area;

/**

  Población stats

*/
drop table if exists test_cell_data.poblacion_stats;

create table test_cell_data.poblacion_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
)
select
  count(a.*) as number_of_poblacion_points,
  b.test_cell_area / count(a.*) as area_per_point
from
  test_cell_data.poblacion a,
  area_test_cell b
group by
  b.test_cell_area;

/**

  HIC stats

*/
drop table if exists test_cell_data.hic_stats;

create table test_cell_data.hic_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
),
distinct_hic_polygon as (
  select distinct geom
  from test_cell_data.hic
),
total_hic_polygon as (
  select count(*) as n
  from test_cell_data.hic
)
select
  c.n as number_of_hic_polygons,
  count(a.geom) as number_of_distinct_hic_polygons,
  sum(st_area(a.geom)) / b.test_cell_area as total_area_hic_polygons
from
  distinct_hic_polygon a,
  area_test_cell b,
  total_hic_polygon c
group by
  b.test_cell_area, c.n;

/**

  HIC stats, complexity.

*/
drop table if exists test_cell_data.hic_polygon_stats;

create table test_cell_data.hic_polygon_stats as
with polygons as (
  select
    st_npoints(geom) as n_vertices,
    st_area(geom) as area
  from test_cell_data.hic
)
select
  sum(n_vertices) as total_num_vertices,
  avg(n_vertices) as avg_num_vertices,
  sum(area) as total_area,
  avg(area) as avg_area
from
  polygons d;

/**

  EENNPP stats

*/
drop table if exists test_cell_data.eennpp_stats;

create table test_cell_data.eennpp_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
),
distinct_eennpp_polygon as (
  select distinct geom
  from test_cell_data.eennpp
),
total_eennpp_polygon as (
  select count(*) as n
  from test_cell_data.eennpp
)
select
  c.n as number_of_eennpp_polygons,
  count(a.geom) as number_of_distinct_eennpp_polygons,
  sum(st_area(a.geom)) / b.test_cell_area as total_area_eennpp_polygons
from
  distinct_eennpp_polygon a,
  area_test_cell b,
  total_eennpp_polygon c
group by
  b.test_cell_area, c.n;

/**

  EENNPP stats, complexity.

*/
drop table if exists test_cell_data.eennpp_polygon_stats;

create table test_cell_data.eennpp_polygon_stats as
with polygons as (
  select
    st_npoints(geom) as n_vertices,
    st_area(geom) as area
  from test_cell_data.eennpp
)
select
  sum(n_vertices) as total_num_vertices,
  avg(n_vertices) as avg_num_vertices,
  sum(area) as total_area,
  avg(area) as avg_area
from
  polygons d;

/**

  Núcleo población stats

*/
drop table if exists test_cell_data.nucleo_poblacion_stats;

create table test_cell_data.nucleo_poblacion_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
),
distinct_nucleo_poblacion_polygon as (
  select distinct geom
  from test_cell_data.nucleo_poblacion
),
total_nucleo_poblacion_polygon as (
  select count(*) as n
  from test_cell_data.nucleo_poblacion
)
select
  c.n as number_of_nucleo_poblacion_polygons,
  count(a.geom) as number_of_distinct_nucleo_poblacion_polygons,
  sum(st_area(a.geom)) / b.test_cell_area as total_area_nucleo_poblacion_polygons
from
  distinct_nucleo_poblacion_polygon a,
  area_test_cell b,
  total_nucleo_poblacion_polygon c
group by
  b.test_cell_area, c.n;

/**

  Núcleo población stats, complexity.

*/
drop table if exists test_cell_data.nucleo_poblacion_polygon_stats;

create table test_cell_data.nucleo_poblacion_polygon_stats as
with polygons as (
  select
    st_npoints(geom) as n_vertices,
    st_area(geom) as area
  from test_cell_data.nucleo_poblacion
)
select
  sum(n_vertices) as total_num_vertices,
  avg(n_vertices) as avg_num_vertices,
  sum(area) as total_area,
  avg(area) as avg_area
from
  polygons d;

commit;
