/**

  Shows GridderTasks.

*/

select
  gridder_task_id,
  gridder_task_type,
  name,
  description,
  source_table,
  geom_field,
  index_variable_key
from cell_meta.gridder_task;
-- where gridder_task_type = 'DISCRETEPOLYTOPAREA';
