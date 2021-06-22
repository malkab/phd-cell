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
-- \set griddertaskid gridderTaskPointAggregationsCatastro
-- \set griddertaskid municipioDiscreteAreaSummary
-- \set griddertaskid provinciaDiscretePolyTopArea
-- \set griddertaskid municipioDiscretePolyTopArea
-- \set griddertaskid seccionCensalDiscretePolyTopArea
-- \set griddertaskid nucleoPoblacionDiscretePolyTopArea
\set griddertaskid provincia2018DiscretePolyTopArea
\set griddertaskid municipio2018DiscretePolyTopArea
\set griddertaskid seccionCensal2018DiscretePolyTopArea
\set griddertaskid seccionesCensalesPointAggregations
-- \set griddertaskid eennppDiscretePolyTopArea
-- \set griddertaskid eennppDiscreteAreaSummary
-- \set griddertaskid nucleosPoblacionDiscreteAreaSummary
-- \set griddertaskid provinciaDiscreteAreaSummary
-- \set griddertaskid seccionCensalDiscreteAreaSummary
-- \set griddertaskid gridderTaskPointAggregationsPoblacion
-- \set griddertaskid gridderTaskMdtProcessing

-- Zoom, just for alignment
-- \set z 0
-- \set x 5
-- \set y 1

/**

  Get cells by optional zoom, full extent

*/
create materialized view qa.qa as
select *
from cell__getcellsbyvarkeys(
  ARRAY[ cell__getindexvariablekeybygriddertaskid(:'griddertaskid') ]::varchar[],
    false, null, null);

/**

  Get cells by optional zoom, in a cell

*/
-- create materialized view qa.qa as
-- select *
-- from cell__getcellsbyvarkeys(
--   cell__getvariablekeysbygriddertaskid(:'griddertaskid'), false,
--     4, cell__cellgeom(cell__defaultcell(:z, :x, :y)));

/**

  Get cells where the index var is unset, at a zoom

*/
-- create materialized view qa.qa as
-- select *
-- from cell_data.data
-- where
--   zoom = 4 and
--   data -> cell__getindexvariablekeybygriddertaskid(:'griddertaskid') = 'null';

/**

  Select cells based on query.

*/
-- create materialized view qa.seleccion as
-- select *
-- from cell_data.data
-- where (data -> '5555' ->> 'area')::float > 1;

-- Permissions
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