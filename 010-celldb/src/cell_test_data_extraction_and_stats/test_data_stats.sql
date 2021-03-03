begin;

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

/**

  Municipio stats

*/
drop table if exists test_cell_data.municipio_stats;

create table test_cell_data.municipio_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
),
distinct_municipio_polygon as (
  select distinct geom
  from test_cell_data.municipio
),
total_municipio_polygon as (
  select count(*) as n
  from test_cell_data.municipio
)
select
  c.n as number_of_municipio_polygons,
  count(a.geom) as number_of_distinct_municipio_polygons,
  sum(st_area(a.geom)) / b.test_cell_area as total_area_municipio_polygons
from
  distinct_municipio_polygon a,
  area_test_cell b,
  total_municipio_polygon c
group by
  b.test_cell_area, c.n;

/**

  Municipio stats, complexity.

*/
drop table if exists test_cell_data.municipio_polygon_stats;

create table test_cell_data.municipio_polygon_stats as
with polygons as (
  select
    st_npoints(geom) as n_vertices,
    st_area(geom) as area
  from test_cell_data.municipio
)
select
  sum(n_vertices) as total_num_vertices,
  avg(n_vertices) as avg_num_vertices,
  sum(area) as total_area,
  avg(area) as avg_area
from
  polygons d;

/**

  Provincia stats

*/
drop table if exists test_cell_data.provincia_stats;

create table test_cell_data.provincia_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
),
distinct_provincia_polygon as (
  select distinct geom
  from test_cell_data.provincia
),
total_provincia_polygon as (
  select count(*) as n
  from test_cell_data.provincia
)
select
  c.n as number_of_provincia_polygons,
  count(a.geom) as number_of_distinct_provincia_polygons,
  sum(st_area(a.geom)) / b.test_cell_area as total_area_provincia_polygons
from
  distinct_provincia_polygon a,
  area_test_cell b,
  total_provincia_polygon c
group by
  b.test_cell_area, c.n;

/**

  Provincia stats, complexity.

*/
drop table if exists test_cell_data.provincia_polygon_stats;

create table test_cell_data.provincia_polygon_stats as
with polygons as (
  select
    st_npoints(geom) as n_vertices,
    st_area(geom) as area
  from test_cell_data.provincia
)
select
  sum(n_vertices) as total_num_vertices,
  avg(n_vertices) as avg_num_vertices,
  sum(area) as total_area,
  avg(area) as avg_area
from
  polygons d;

/**

  Sección censal stats

*/
drop table if exists test_cell_data.seccion_censal_stats;

create table test_cell_data.seccion_censal_stats as
with area_test_cell as (
  select st_area(geom) as test_cell_area
  from test_cell_data.test_cell
),
distinct_seccion_censal_polygon as (
  select distinct geom
  from test_cell_data.seccion_censal
),
total_seccion_censal_polygon as (
  select count(*) as n
  from test_cell_data.seccion_censal
)
select
  c.n as number_of_seccion_censal_polygons,
  count(a.geom) as number_of_distinct_seccion_censal_polygons,
  sum(st_area(a.geom)) / b.test_cell_area as total_area_seccion_censal_polygons
from
  distinct_seccion_censal_polygon a,
  area_test_cell b,
  total_seccion_censal_polygon c
group by
  b.test_cell_area, c.n;

/**

  Sección censal stats, complexity.

*/
drop table if exists test_cell_data.seccion_censal_polygon_stats;

create table test_cell_data.seccion_censal_polygon_stats as
with polygons as (
  select
    st_npoints(geom) as n_vertices,
    st_area(geom) as area
  from test_cell_data.seccion_censal
)
select
  sum(n_vertices) as total_num_vertices,
  avg(n_vertices) as avg_num_vertices,
  sum(area) as total_area,
  avg(area) as avg_area
from
  polygons d;

-- Permissions
grant usage on schema test_cell_data
to cell_readonly;

grant select on all tables in schema test_cell_data
to cell_readonly;

commit;
