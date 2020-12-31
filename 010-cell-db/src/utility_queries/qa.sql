/**

  Creates a QA layer to check for missing cells in a given target cell for a
  given GridderTask. Use with the solid cell layer style to detect missing cells
  easily.

*/
begin;

drop schema if exists qa cascade;

create schema qa;

grant usage on schema qa
to cell_readonly;

\set griddertaskid hicAreaSummary
-- \set griddertaskid municipioDiscreteAreaSummary
-- Zoom, just for alignment
\set z 0
\set x 1
\set y 3

create materialized view qa.qa as
select *
from cell__getcellsbyvarkeys(
  cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
    7, null);
    --cell__cellgeom(cell__defaultcell(:z, :x, :y)));

grant select on all tables in schema qa to cell_readonly;

commit;
