/**

  Prepare the GridderTask and Variables for the population structure ML.

*/
insert into cell_meta.gridder_task
values (
  '888888',
  'ML',
  'Random forest población + residencial + densidad',
  'Random forest de 4 clases en función de población, residencial y densidad constructiva.',
  null,
  null,
  null,
  null
);

insert into cell_meta.variable
values (
  '888888',
  '9932',
  'Clase Random forest población + residencial + densidad',
  'Clase Random forest correspondiente a población + residencial + densidad constructiva.'
);
