with a as (
  select st_transform(area, 3035) as area from cell_meta.gridder_job where gridder_job_id = 'gridderJobHuelva'
)
select
  cell__getcoverage('eu-grid', 0, area)
from a;

select
  gridder_cell_id,
  gridder_job_id,
  (cell).grid_id,
  (cell).epsg,
  (cell).zoom,
  (cell).x,
  (cell).y
from
  cell_meta.gridder_cell;
