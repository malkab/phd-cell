/**

  Shows GridderTasks.

*/

select
-- distinct on (gridder_task_type)
  gridder_task_id,
  gridder_task_type,
  name,
  description,
  source_table,
  geom_field,
  index_variable_key
from cell_meta.gridder_task
order by gridder_task_type;
-- where gridder_task_type = 'POINTAGGREGATIONS';
