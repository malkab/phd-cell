-- Create user

create role cellmetadatauser nosuperuser nocreatedb nocreaterole login inherit noreplication nobypassrls password $1;