/**

  Define objects tables at cell_meta for ORM.

*/
begin;

create table cell_meta.catalog(
  id varchar(64) primary key,
  forward jsonb,
  backward jsonb
);

create index catalog_forward_gin
on cell_meta.catalog
using gin(forward);

create index catalog_backward_gin
on cell_meta.catalog
using gin(backward);

commit;
