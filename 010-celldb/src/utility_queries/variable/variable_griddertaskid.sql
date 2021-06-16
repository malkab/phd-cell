\set gtid nucleoPoblacionDiscretePolyTopArea

select *
from cell_meta.variable
where
  gridder_task_id = :'gtid';
