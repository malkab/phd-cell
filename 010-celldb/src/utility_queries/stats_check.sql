-- select
--   count(*),
--   avg(st_perimeter(geom) / st_npoints(geom)) as segments_length,
--   avg(st_area(geom))/10000 as area,
--   avg((2*sqrt(pi()*st_area(geom)))/st_perimeter(geom)) as esfericidad
-- from context.seccion_censal;


-- -- Get number of keys in JSON

-- select array_length(array_agg(A.key), 1) from (
--     select jsonb_object_keys(data) as key from cell_data.data where zoom=0
-- ) A;





-- with a as (
--   select
--     zoom, x, y,
--     jsonb_object_keys(data) as key
--   from
--     cell_data.data x
--     -- inner join stats.zones y on st_intersects(x.geom, y.geom)
--   where zoom=7
-- ),
-- b as (
--   select
--     zoom, x, y,
--     array_length(array_agg(key), 1) as keys
--   from a
--   group by zoom, x, y
--   -- having array_length(array_agg(key), 1) > 10
-- )
-- select
--   max(keys),
--   min(keys),
--   avg(keys)
-- from b;

-- select
--   zoom,
--   count(*) as n,
--   count(*)::numeric/1000.0 as nk
-- from qa.qa
-- group by zoom
-- order by zoom;


--   avg((2*sqrt(pi()*st_area(geom)))/st_perimeter(geom)) as esfericidad

-- create view context.municipio_esfericidad as
-- select
--   gid,
--   municipio,
--   (2*sqrt(pi()*st_area(geom)))/st_perimeter(geom) as esfericidad,
--   geom
-- from
--   context.municipio
-- order by esfericidad;

-- with keys_a as (
--   select
--     jsonb_object_keys(data) as k
--   from
--     cell_data.data
--   where zoom=4 and x=411 and y=176
-- ),
-- keys_b as (
--   select
--     jsonb_object_keys(data) as k
--   from
--     cell_data.data
--   where zoom=4 and x=424 and y=182
-- ),
-- a as (
--   select
--     k,
--     data ->> k as val_a
--   from cell_data.data, keys_a
--   where zoom=4 and x=411 and y=176
-- ),
-- b as (
--   select
--     k,
--     data ->> k as val_b
--   from cell_data.data, keys_b
--   where zoom=4 and x=424 and y=182
-- )
-- select
--   coalesce(a.k, b.k) as "Clave variable",
--   coalesce(val_a, '') as "4/411/176",
--   coalesce(val_b, '') as "4/424/182",
--   c.name
-- from
--   a full outer join b
--   on a.k = b.k inner join
--   cell_meta.variable c on
--   coalesce(a.k, b.k) = c.variable_key
-- order by coalesce(a.k, b.k);

select
  jsonb_object_keys(data) as k
from
  cell_data.data
where zoom=4 and x=411 and y=176
