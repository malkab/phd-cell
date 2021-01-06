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

-- Select the Gridder Task ID
\set griddertaskid hicAreaSummary
-- \set griddertaskid municipioDiscreteAreaSummary
-- \set griddertaskid municipioDiscretePolyTopArea
-- \set griddertaskid municipioDiscreteAreaSummary
-- \set griddertaskid eennppDiscreteAreaSummary
-- \set griddertaskid nucleosPoblacionDiscreteAreaSummary
-- \set griddertaskid provinciaDiscreteAreaSummary
-- \set griddertaskid seccionCensalDiscreteAreaSummary
-- \set griddertaskid gridderTaskPointAggregationsPoblacion

-- Zoom, just for alignment
\set z 1
\set x 8
\set y 3

create materialized view qa.qa as
select *
from cell__getcellsbyvarkeys(
  cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
    4, null);

-- create materialized view qa.qa as
-- select *
-- from cell__getcellsbyvarkeys(
--   cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
--     null, cell__cellgeom(cell__defaultcell(:z, :x, :y)));

grant select on all tables in schema qa to cell_readonly;

commit;
