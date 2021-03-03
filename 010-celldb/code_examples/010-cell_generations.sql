/*

  Generates a 10x10 cell grid at all zoom sizes.

*/
drop schema test cascade;

create schema test;

create table test.test as
select
  row_number() over () as gid,
  z, x, y,
  cell__cellgeom(('eu-grid', 3035, z, x, y, '{}'::jsonb)::cell__cell)
from
  generate_series(0, 9) as z,
  generate_series(0, 10) as x,
  generate_series(0, 10) as y;
