/**

  Population vector extractions for ML.

  Index var: e6b8

*/
create materialized view ml.pop_structure_7 as
select
  zoom, x, y,
  round(
    (data ->> '95f4')::numeric / (
      (data ->> '95f4')::numeric +
      (data ->> '1db1')::numeric +
      (data ->> '8e93')::numeric),
    2
  ) as p0_18,
  round(
    (data ->> '1db1')::numeric / (
      (data ->> '95f4')::numeric +
      (data ->> '1db1')::numeric +
      (data ->> '8e93')::numeric),
    2
  ) as p18_64,
  round(
    (data ->> '8e93')::numeric / (
      (data ->> '95f4')::numeric +
      (data ->> '1db1')::numeric +
      (data ->> '8e93')::numeric),
    2
  ) as p64
from
  cell_data.data
where
  zoom = 7 and
  data ? 'e6b8' and
  data ? '95f4' and
  data ? '1db1' and
  data ? '8e93' and
  data ->> '95f4' is not null and
  data ->> '1db1' is not null and
  data ->> '8e93' is not null
order by x, y;

select count(*)
from
  cell_data.data
where
  zoom = 7 and
  data ? 'e6b8';

grant usage on schema ml
to cell_readonly;

grant select on all tables in schema ml
to cell_readonly;

/**

  Stats: total of tiles with population data / total of tiles with full vector.

  Zoom 0: 19    / 19
  Zoom 1: 53    / 53
  Zoom 2: 802   / 725
  Zoom 3: 2191  / 1607
  Zoom 4: 11332 / 5720
  Zoom 5: 22212 / 10679
  Zoom 6: 46160 / 22192
  Zoom 7: 48097 / 23037

*/
