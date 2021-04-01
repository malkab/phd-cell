/**

  Population vector extractions for ML.

  Index var: c206

*/
create materialized view ml.urbanization_6 as
select
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
  data ->> 'e01a' as residencial,
  data ->> '3607' as total_superficie_cons,
  geom
from
  cell_data.data
where
  zoom = 6 and
  data ? 'e6b8' and
  data ? '95f4' and
  data ? '1db1' and
  data ? '8e93' and
  data ? 'c206' and
  data ? 'e01a' and
  data ? '3607' and
  data ->> '95f4' is not null and
  data ->> '1db1' is not null and
  data ->> '8e93' is not null and
  data ->> 'e01a' is not null and
  data ->> '3607' is not null
order by x, y;

select count(*)
from
  cell_data.data
where
  zoom = 6 and
  data ? 'e6b8' and
  data ? 'c206';

grant usage on schema ml
to cell_readonly;

grant select on all tables in schema ml
to cell_readonly;

/**

  Stats: total of tiles with population data / total of tiles with full vector.

  Zoom 4: 10943 / 5580
  Zoom 5: 21149 / 10355
  Zoom 6: 43412 / 21474

*/
