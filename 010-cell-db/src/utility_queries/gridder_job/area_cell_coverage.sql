/**

  This SQL covers an area from a Gridder Job with cells of a given zoom.

  zoomLevels: [
    {"name": "100 km", "size": 100000}, // 0
    {"name": "50 km", "size": 50000},   // 1
    {"name": "10 km", "size": 10000},   // 2
    {"name": "5 km", "size": 5000},     // 3
    {"name": "1 km", "size": 1000},     // 4
    {"name": "500 m", "size": 500},     // 5
    {"name": "250 m", "size": 250},     // 6
    {"name": "125 m", "size": 125},     // 7
    {"name": "25 m", "size": 25},       // 8
    {"name": "5 m", "size": 5}          // 9
  ]

*/
with a as (
  -- HERE the EPSG of the grid to use
  select st_transform(area, 3035) as area
  from cell_meta.gridder_job
  -- HERE THE GRIDDERJOB
  where gridder_job_id = 'gridderJobHuelva'
)
select
  -- HERE the target zoom and the grid to use
  cell__setcell(cell__getcoverage('eu-grid', 4, area)) as cell
from a;
