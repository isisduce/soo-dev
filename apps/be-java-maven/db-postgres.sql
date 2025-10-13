select * from pg_class;
select * from pg_database order by oid;
select * from pg_roles order by oid;
select * from pg_shadow;
select * from pg_user order by usename;

-- enable postgis
create extension postgis;

-- user
create user soo password 'soo#123' superuser;
alter user soo with password 'soo#123';

-- database
create database soo_database encoding 'UTF8';
alter database soo_database owner to soo;
