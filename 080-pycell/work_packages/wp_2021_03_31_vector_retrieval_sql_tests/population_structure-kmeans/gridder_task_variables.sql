/**

  Prepare the GridderTask and Variables for the population structure ML.

*/
insert into cell_meta.gridder_task
values (
  '999999',
  'ML',
  'KMeans estructura población',
  'KMeans de 4 clústeres sobre proporción de población en las tres franjas de edad: menores de 18 años, 18-64 años y mayores de 64 años.',
  null,
  null,
  null,
  null
);

insert into cell_meta.variable
values (
  '999999',
  '8932',
  'Clúster KMeans estructura población',
  'Clúster correspondiente a la clusterización de 4 categorías sobre la estructura de la población'
);
