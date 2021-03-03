begin;

-- Register grid

insert into cell_meta.grid
values (
  'eu-grid',
  'eu-grid',
  'A grid based on the official EU one',
  '3035',
  2700000,
  1500000,
  Array[
      '{"name": "100 km", "size": 100000}'::jsonb,
      '{"name": "50 km", "size": 50000}'::jsonb,
      '{"name": "10 km", "size": 10000}'::jsonb,
      '{"name": "5 km", "size": 5000}'::jsonb,
      '{"name": "1 km", "size": 1000}'::jsonb,
      '{"name": "500 m", "size": 500}'::jsonb,
      '{"name": "250 m", "size": 250}'::jsonb,
      '{"name": "125 m", "size": 125}'::jsonb,
      '{"name": "25 m", "size": 25}'::jsonb,
      '{"name": "5 m", "size": 5}'::jsonb
  ]
);

commit;
