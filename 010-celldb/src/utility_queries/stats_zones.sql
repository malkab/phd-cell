-- Zonas de estadísticas teselares

create schema stats;

create table stats.zones(
  gid integer primary key,
  description varchar(200),
  geom geometry(POLYGON, 3035)
);

create index zones_geom_gist
on stats.zones
using gist(geom);

grant usage on schema stats to cell_readonly, cell_master;

grant all privileges on all tables in schema stats to cell_readonly, cell_master;
