/**

  Creates a QA layer to check for missing cells in a given target cell.
  Use with the solid cell layer style to detect missing cells easily.

*/
begin;

drop schema if exists qa cascade;

create schema qa;

--\set griddertaskid hicAreaSummary
\set griddertaskid municipioDiscreteAreaSummary
-- Zoom, just for alignment
\set z 1
\set x 6
\set y 3

create materialized view qa.qa as
select *
from cell__getcellsbyvarkeys(
  cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
    null,
    cell__cellgeom(cell__defaultcell(:z, :x, :y)));

commit;
