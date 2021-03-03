drop schema test cascade;

create schema test;

create table test.test as
with p as (
  select *
  from context.provincia
  where provincia ilike 'cádiz'
),
cells as (
  select cell__getcoverage('eu-grid', 7, p.geom) as c
  from p
)
select
  row_number() over () as gid,
  c,
  cell__cellgeom(c)
from
  cells;
