/**

  Creates the DB and roles.

*/

-- Set the name of the database and the owner and read-only user
\set dbname cell
\set dbowneruser cell_master
\set dbreadonlyuser cell_readonly

\set search_path public

\c postgres postgres

begin;

create user :dbowneruser with
password '38fn3k39erj34n8'
NOSUPERUSER LOGIN NOCREATEDB NOCREATEROLE NOREPLICATION;

create user :dbreadonlyuser with
password 'manCastle002'
NOSUPERUSER LOGIN NOCREATEDB NOCREATEROLE NOREPLICATION;

commit;

-- Create database cannot be run in a transaction
create database :dbname
owner :dbowneruser;

grant all privileges on database :dbname
to :dbowneruser;

\c :dbname

-- Create PostGIS extension
create extension postgis;

-- Drop default privileges for public
revoke all privileges on database :dbname
from public;

revoke all privileges on schema public
from public;

-- Drop default privileges for the read-only user
revoke all privileges on database :dbname
from :dbreadonlyuser;

revoke all privileges on schema public
from :dbreadonlyuser;

grant connect on database :dbname
to :dbreadonlyuser;

grant all privileges on schema public
to :dbowneruser;

grant usage on schema public
to :dbreadonlyuser;

grant select on all tables in schema public
to :dbreadonlyuser;
