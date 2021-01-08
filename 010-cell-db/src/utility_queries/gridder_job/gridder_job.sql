/**

  Return list of Gridder Jobs.

*/
select
  gridder_job_id,
  gridder_task_id,
  max_zoom_level,
  min_zoom_level,
  sql_area_retrieval,
  st_area(area) / 1000000 as area_km2
from
  cell_meta.gridder_job;
