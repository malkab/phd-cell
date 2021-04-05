/**

  Creates a pop structure ML view for visualizing

*/
drop materialized view ml.res_urbanization;

create materialized view ml.res_urbanization as
select
  grid_id,
  epsg,
  zoom, x, y,
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
  (data ->> 'e01a')::numeric as residencial,
  (data ->> '3607')::numeric as total_superficie_cons,
  data ->> '9932' as class,
  geom,
  geom_4326
from cell_data.data
where data ? '9932';

grant usage on schema ml
to cell_readonly;

grant select on all tables in schema ml
to cell_readonly;
