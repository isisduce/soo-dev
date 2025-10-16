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


-- check current-session for using db
SELECT pid, usename, application_name, client_addr, state, query, query_start, state_change
FROM pg_stat_activity
order by datname;

-- terminate specified session (check pid from the above query result)
SELECT pg_terminate_backend(pid);
