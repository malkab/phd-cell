/**

  This SQL sentences help in creating manually index variables. They don't,
  however, set the index variables value, just put them into the cell vector and
  set them to null.

*/
\set griddertaskid hicAreaSummary
\set zoom 7
\set indexvarkey 5555

-- insert into cell_meta.variable
-- values(
--   :'griddertaskid',
--   :'indexvarkey',
--   'Index var hicAreaSummary',
--   'Index variable for GridderTask hicAreaSummary.'
-- );

-- update cell_meta.gridder_task
-- set index_variable_key = :'indexvarkey'
-- where gridder_task_id = :'griddertaskid';

with cells as (
  select *
  from cell__getcellsbyvarkeys(
    ARRAY[cell__getvariablekeysbygriddertaskid(:'griddertaskid')], false, :zoom,
    null)
)
update cell_data.data a
set data = a.data || '{ "5555": null }'::jsonb
from cells b
where a.zoom = b.zoom and a.x = b.x and a.y = b.y;
