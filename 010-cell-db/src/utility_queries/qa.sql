/**

  Creates a QA layer to check for missing cells in a given target cell.
  Use with the solid cell layer style to detect missing cells easily.

*/
begin;

drop schema if exists qa cascade;

create schema qa;

\set griddertaskid municipioDiscreteAreaSummary
\set zoom 1
\set x 4
\set y 5

create materialized view qa.qa as
select *
from cell__getcellsbyvarkeys(
  cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
    null,
    cell__cellgeom(cell__defaultcell(:zoom, :x, :y)));

commit;
