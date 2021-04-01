/**

  Creates a pop structure ML view for visualizing

*/
drop materialized view ml.res_pop_structure;

create materialized view ml.res_pop_structure as
select
  grid_id,
  epsg,
  zoom, x, y,
  data ->> '95f4' as p18,
  data ->> '1db1' as p1864,
  data ->> '8e93' as p64,
  data ->> 'a57c' as ptotal,
  round(
    (data ->> '95f4')::numeric / (
      (data ->> '95f4')::numeric +
      (data ->> '1db1')::numeric +
      (data ->> '8e93')::numeric),
    2
  ) as r0_18,
  round(
    (data ->> '1db1')::numeric / (
      (data ->> '95f4')::numeric +
      (data ->> '1db1')::numeric +
      (data ->> '8e93')::numeric),
    2
  ) as r18_64,
  round(
    (data ->> '8e93')::numeric / (
      (data ->> '95f4')::numeric +
      (data ->> '1db1')::numeric +
      (data ->> '8e93')::numeric),
    2
  ) as r64,
  data ->> '8932' as pop_cluster,
  geom,
  geom_4326
from cell_data.data
where data ? '8932';

grant usage on schema ml
to cell_readonly;

grant select on all tables in schema ml
to cell_readonly;
