/**

  Apply training zones to data.

*/
create materialized view ml.urbanization_training_6 as
select
  zoom, x, y,
  r0_18,
  r18_64,
  r64,
  residencial,
  total_superficie_cons,
  gid as gid_tz,
  class,
  class_descriptor
from
  ml.urbanization_6 a inner join
  ml.training_rf b on st_intersects(a.geom, b.geom);
