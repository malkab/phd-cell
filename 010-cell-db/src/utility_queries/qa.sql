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
-- \set griddertaskid hicAreaSummary
-- \set griddertaskid municipioDiscreteAreaSummary
-- \set griddertaskid municipioDiscretePolyTopArea
-- \set griddertaskid municipioDiscreteAreaSummary
-- \set griddertaskid eennppDiscreteAreaSummary
-- \set griddertaskid nucleosPoblacionDiscreteAreaSummary
-- \set griddertaskid provinciaDiscreteAreaSummary
\set griddertaskid seccionCensalDiscreteAreaSummary
-- \set griddertaskid gridderTaskPointAggregationsPoblacion
-- \set griddertaskid gridderTaskMdtProcessing

-- Zoom, just for alignment
\set z 1
\set x 8
\set y 3

/**

  Get cells by optional zoom, full extent

*/
create materialized view qa.qa as
select *
from cell__getcellsbyvarkeys(
  ARRAY[ cell__getindexvariablekeybygriddertaskid(:'griddertaskid') ]::varchar[],
    false, 5, null);

/**

  Get cells by optional zoom, in a cell

*/
-- create materialized view qa.qa as
-- select *
-- from cell__getcellsbyvarkeys(
--   cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
--     9, cell__cellgeom(cell__defaultcell(:z, :x, :y)));

/**

  Get cells where the index var is unset, at a zoom

*/
-- create materialized view qa.qa as
-- select *
-- from cell_data.data
-- where
--   zoom = 0 and
--   data -> cell__getindexvariablekeybygriddertaskid(:'griddertaskid') = 'null';

grant select on all tables in schema qa to cell_readonly;

commit;

/**

  Check value of the index var for a zoom

*/
-- select
--   zoom, x, y,
--   data -> cell__getindexvariablekeybygriddertaskid(:'griddertaskid')
-- from cell__getcellsbyvarkeys(
--   ARRAY[ cell__getindexvariablekeybygriddertaskid(:'griddertaskid') ]::varchar[],
--     false, 7, null);
