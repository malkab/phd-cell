/**

  Apply training zones to data.

*/
drop materialized view ml.urbanization_training_4;

create materialized view ml.urbanization_training_4 as
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
  ml.urbanization_4 a inner join
  ml.training_rf b on st_intersects(a.geom, b.geom);


drop materialized view ml.urbanization_training_5;

create materialized view ml.urbanization_training_5 as
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
  ml.urbanization_5 a inner join
  ml.training_rf b on st_intersects(a.geom, b.geom);


drop materialized view ml.urbanization_training_6;

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
