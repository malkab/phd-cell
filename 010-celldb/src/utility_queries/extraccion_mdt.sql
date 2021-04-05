-- Extracción de los valores teselados del MDT para su visualización

create materialized view export.mdt as
select
  row_number() over () as gid,
  a.x, a.y, a.zoom,
  (a.data ->> 'a1abc')::float as h,
  a.geom
from
  cell_data.data a inner join
  cell_data.data b on st_intersects(a.geom, b.geom)
where
  a.data ? 'a1abc' and
  b.zoom = 5 and b.x = 802 and b.y = 305;

grant usage on schema export to cell_readonly;

grant select on all tables in schema export to cell_readonly;
