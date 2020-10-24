/**

  Deletes all data from the database.

*/
begin;

delete from cell_meta.catalog;
delete from cell_meta.grid;
delete from cell_meta.pg_connection;
delete from cell_meta.cell_version;

commit;

\i 030-quad_definition-ddl.sql
\i 050-add_metadata.sql
