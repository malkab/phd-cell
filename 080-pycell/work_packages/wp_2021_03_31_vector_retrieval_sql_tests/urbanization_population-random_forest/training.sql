/**

  Training zones for Random Forest.

*/
create table ml.training_rf(
  gid integer primary key,
  class integer,
  class_descriptor text,
  geom geometry(polygon, 3035)
);

grant select on all tables in schema ml
to cell_readonly;

grant all privileges on table ml.training_rf
to cell_readonly;
