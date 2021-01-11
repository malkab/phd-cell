/**

  This SQL sentences help in creating manually index variables. They don't,
  however, set the index variables value, just put them into the cell vector and
  set them to null.

*/
\set griddertaskid eennppDiscreteAreaSummary
\set zoom 7

-- insert into cell_meta.variable
-- values(
--   :'griddertaskid',
--   '33333',
--   'Index var nucleosPoblacionDiscreteAreaSummary',
--   'Index variable for GridderTask nucleosPoblacionDiscreteAreaSummary.'
-- );

-- update cell_meta.gridder_task
-- set index_variable_key = '33333'
-- where gridder_task_id = :'griddertaskid';

with cells as (
  select *
  from cell__getcellsbyvarkeys(
    ARRAY[cell__getvariablekeysbygriddertaskid(:'griddertaskid')], false, :zoom,
    null)
)
update cell_data.data a
set data = a.data || '{ "33333": null }'::jsonb
from cells b
where a.zoom = b.zoom and a.x = b.x and a.y = b.y;
