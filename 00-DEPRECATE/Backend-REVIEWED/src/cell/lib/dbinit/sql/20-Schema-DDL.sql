-- Database new schema for application data management

create schema app;


-- PostgreSQL datasources

create table app.datasource(
  id varchar(50),
  definition jsonb
);

alter table app.datasource
add constraint datasource_pkey
primary key(id);

create index datasource_definition_gin
on app.datasource
using gin(definition);


-- colors

create table app.color_ramp(
    id varchar(50),
    definition jsonb
);

alter table app.color_ramp
add constraint color_ramp_pkey
primary key(id);

create index color_ramp_gin
on app.color_ramp
using gin(definition);


-- Layers

create table app.layer(
  id varchar(50),
  name varchar(100),
  short_description varchar(250),
  long_description text,
  type varchar(25),
  initial_order integer,
  definition jsonb
);

alter table app.layer
add constraint layer_pkey
primary key(id);

create index layer_definition_gin
on app.layer
using gin(definition);