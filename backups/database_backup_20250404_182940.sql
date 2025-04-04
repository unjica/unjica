--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA app;


ALTER SCHEMA app OWNER TO postgres;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: update_setting(text, text, text); Type: FUNCTION; Schema: app; Owner: postgres
--

CREATE FUNCTION app.update_setting(p_key text, p_value text, p_description text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO app.settings (key, value, description)
    VALUES (p_key, p_value, p_description)
    ON CONFLICT (key) 
    DO UPDATE SET 
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, app.settings.description),
        updated_at = now();
END;
$$;


ALTER FUNCTION app.update_setting(p_key text, p_value text, p_description text) OWNER TO postgres;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: settings; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.settings (
    key text NOT NULL,
    value text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE app.settings OWNER TO postgres;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    "articleId" text NOT NULL,
    "userId" text,
    "anonymousId" text,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: generated_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generated_articles (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "primaryTopic" text NOT NULL,
    summary text NOT NULL,
    tags text NOT NULL,
    "publishedAt" timestamp(3) without time zone NOT NULL,
    "sourceNewsIds" text NOT NULL,
    "lastUpdated" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "imageUrl" text,
    slug text
);


ALTER TABLE public.generated_articles OWNER TO postgres;

--
-- Name: reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reactions (
    id text NOT NULL,
    type text NOT NULL,
    "userId" text,
    "anonymousId" text,
    "articleId" text,
    "commentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reactions OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscribers (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.subscribers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    password text,
    image text,
    role text DEFAULT 'USER'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: supabase_admin
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


ALTER TABLE vault.decrypted_secrets OWNER TO supabase_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: settings; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.settings (key, value, description, created_at, updated_at) FROM stdin;
base_url	https://unjica.com	Base URL of the application	2025-03-20 19:40:45.917909+00	2025-03-20 19:40:45.917909+00
cron_secret	unjica-super-secret-cron-key-please-change-in-production-LogABS213.	Secret key for cron job authentication	2025-03-20 19:40:45.917909+00	2025-03-20 19:40:45.917909+00
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	654e2605-69ff-4b33-ab76-71c7b6490925	{"action":"user_confirmation_requested","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-03-02 15:38:54.077119+00	
00000000-0000-0000-0000-000000000000	4fd38cf6-1cd4-46b3-8407-51af6cffaa1f	{"action":"user_signedup","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"team"}	2025-03-02 15:39:06.862672+00	
00000000-0000-0000-0000-000000000000	73a4448e-7e2c-4bb8-ae50-321ca1b8a052	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 15:40:33.538931+00	
00000000-0000-0000-0000-000000000000	e9d1bfa4-c4a8-464d-bf22-6eb0ed8248bb	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 15:55:19.352135+00	
00000000-0000-0000-0000-000000000000	9a6d12d9-5f72-4d30-b3aa-d4aed158ca7e	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 16:10:15.66059+00	
00000000-0000-0000-0000-000000000000	0dee0ff9-71aa-4721-920c-0d850fc1ada9	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 16:10:21.436287+00	
00000000-0000-0000-0000-000000000000	4cc0d226-2a41-4fd6-bfa0-5f1dd707c16a	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 16:22:46.910338+00	
00000000-0000-0000-0000-000000000000	638f32e2-8fe7-42a9-afd6-a0f046716242	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 16:22:57.236038+00	
00000000-0000-0000-0000-000000000000	faa192a7-8832-43f9-b128-fffe3f73a5d8	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 16:23:04.748856+00	
00000000-0000-0000-0000-000000000000	150d8e7e-cb80-4d89-9347-d677eb1f1b6d	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 16:23:16.394616+00	
00000000-0000-0000-0000-000000000000	88cf98c1-5732-4eb7-b2d2-842a7af4d906	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 16:41:57.450349+00	
00000000-0000-0000-0000-000000000000	739c2048-a8f2-45f5-890a-0fbd3e632be1	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 16:42:36.432392+00	
00000000-0000-0000-0000-000000000000	b0d40ca2-2875-4510-ba12-9a79c00ddacd	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 16:44:02.59701+00	
00000000-0000-0000-0000-000000000000	fc588a3a-4cfd-4b43-be36-05e7902159c0	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 16:45:11.560271+00	
00000000-0000-0000-0000-000000000000	9e55425b-56fd-45de-9dbe-aa9a2ea0fc4c	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 16:47:09.866615+00	
00000000-0000-0000-0000-000000000000	0d0f073d-1b8b-442b-b678-db1ba5f3cdb9	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 16:47:55.18209+00	
00000000-0000-0000-0000-000000000000	0df947d4-971d-4a64-93b6-0dc947e84e85	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 17:16:40.95722+00	
00000000-0000-0000-0000-000000000000	0555add8-d037-4dac-8c9e-94eb240ee88c	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 17:21:55.451635+00	
00000000-0000-0000-0000-000000000000	72c474d8-8872-42d9-962a-c1c517adcc1d	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 17:23:01.788525+00	
00000000-0000-0000-0000-000000000000	125c73a0-cc3d-4203-832b-204fe74c3f39	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 17:23:53.104171+00	
00000000-0000-0000-0000-000000000000	8476fb1d-fd8d-4ee9-9321-62919b495d26	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 17:24:24.86559+00	
00000000-0000-0000-0000-000000000000	2b79bddc-7106-4c64-af89-2397aa087785	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 18:11:17.294476+00	
00000000-0000-0000-0000-000000000000	e7a874e8-209e-4cdd-a3c9-8716fe1b9d63	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:28:57.674151+00	
00000000-0000-0000-0000-000000000000	103f54fe-672b-471b-9766-ebc57a28d48f	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:31:00.582+00	
00000000-0000-0000-0000-000000000000	fe80e8f7-63bb-4f5e-9f7a-0e1f2706764a	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:34:23.07566+00	
00000000-0000-0000-0000-000000000000	4ba1dfc5-7932-4bc8-93b2-9faafb519a4d	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:38:01.047699+00	
00000000-0000-0000-0000-000000000000	30baab2e-ca23-423e-9555-33e955bdc543	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 18:39:35.865153+00	
00000000-0000-0000-0000-000000000000	5ad19e9a-bed7-4034-bc76-2a7d3dc6bbb5	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:39:40.403818+00	
00000000-0000-0000-0000-000000000000	462b2e2f-7461-4b3f-8255-d64ab75a2ab9	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:46:14.934488+00	
00000000-0000-0000-0000-000000000000	bcbb8fae-945d-4326-b528-7cf2b09681f3	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 18:49:34.589662+00	
00000000-0000-0000-0000-000000000000	a8cbda86-315f-47f6-9de6-a02a856e652b	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 19:36:49.444768+00	
00000000-0000-0000-0000-000000000000	7fe2b854-7c0b-4789-8248-537a0826d6f1	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 19:37:28.058533+00	
00000000-0000-0000-0000-000000000000	0f80688f-d4ef-477f-84a0-7ff21f943b13	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-02 19:52:32.87418+00	
00000000-0000-0000-0000-000000000000	d4338e05-362d-459a-b2a4-17b8eac94e7e	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-02 20:09:24.638201+00	
00000000-0000-0000-0000-000000000000	6ff08b1c-661f-4afd-86c2-ea91d5f37fbe	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-03 16:32:02.220082+00	
00000000-0000-0000-0000-000000000000	aa5ce1a0-3aaa-4d01-8f88-a50e04d93bae	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 16:15:34.019066+00	
00000000-0000-0000-0000-000000000000	4443f9c5-0f57-46e4-ac2e-2ae41d8bd68c	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-04 16:15:34.04586+00	
00000000-0000-0000-0000-000000000000	6a8fda8d-8150-4c4f-ba3f-1c0fe8b94ce7	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 13:38:52.422111+00	
00000000-0000-0000-0000-000000000000	a4971ed7-a465-4917-adf9-082f4cef8a6a	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-06 13:38:52.442211+00	
00000000-0000-0000-0000-000000000000	0c3b79a1-1256-434b-a374-f99c870d316e	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-07 15:57:57.918898+00	
00000000-0000-0000-0000-000000000000	348692a2-7b0e-4fea-8242-e3186a320233	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 14:29:26.563379+00	
00000000-0000-0000-0000-000000000000	1b463507-c3fc-418b-8b0e-ad10ea2a2a65	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 14:29:26.587273+00	
00000000-0000-0000-0000-000000000000	935b626a-8b28-4402-b28f-b1c63031ebe1	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 16:36:13.081893+00	
00000000-0000-0000-0000-000000000000	4cb5b9ec-9b0b-4a26-a9d2-1b21d3731011	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-08 16:36:13.082912+00	
00000000-0000-0000-0000-000000000000	eebb3da2-6a8e-4630-b67f-12a0117bdd40	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 06:31:53.277838+00	
00000000-0000-0000-0000-000000000000	9820428e-c020-4b46-8673-b8820e9726c8	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 06:31:53.292241+00	
00000000-0000-0000-0000-000000000000	a1ff6fb8-a2f4-4e5e-a4b6-2f9cf830bae1	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 08:53:05.141079+00	
00000000-0000-0000-0000-000000000000	a808ddce-3f5d-4165-9735-aac7ececc369	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 08:53:05.148191+00	
00000000-0000-0000-0000-000000000000	21053bb1-c657-46ac-8511-bfbf4f020e63	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-09 09:03:03.377197+00	
00000000-0000-0000-0000-000000000000	45fabfd9-c56f-40ef-91a4-5abccd0d1daa	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 09:57:46.212042+00	
00000000-0000-0000-0000-000000000000	3d4c39bc-d9e4-42e9-ab33-3c653b586bee	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 09:57:46.216556+00	
00000000-0000-0000-0000-000000000000	21215814-70f5-4f6c-b9dd-1eb7dd6bf0c0	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 10:20:13.686776+00	
00000000-0000-0000-0000-000000000000	c3c0d949-98ab-4de2-87f3-5a3213b7aed1	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 10:20:13.689564+00	
00000000-0000-0000-0000-000000000000	df15a047-3288-4aa6-b2f4-bd3569663cd9	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-09 10:46:50.551551+00	
00000000-0000-0000-0000-000000000000	448637e5-a4a2-4fad-bff6-f59a48fada91	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-09 11:23:00.56115+00	
00000000-0000-0000-0000-000000000000	49ee5ff5-78f6-4019-b8f8-fc3cc57e4347	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 19:04:05.583286+00	
00000000-0000-0000-0000-000000000000	c1ed6db1-a356-4004-811d-5d2709173c10	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 19:04:05.590948+00	
00000000-0000-0000-0000-000000000000	387f4d6e-2987-4104-9594-d0f9dfcb8c98	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-09 19:31:37.070761+00	
00000000-0000-0000-0000-000000000000	bd0a12d6-7f0e-4f3e-844b-0f70fdebb057	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-09 19:48:55.479419+00	
00000000-0000-0000-0000-000000000000	48f5a8b9-2239-4d4d-a090-a6a733ba0bf3	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 19:49:07.985846+00	
00000000-0000-0000-0000-000000000000	2494de22-659a-4be8-84e8-bb5eb3409679	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 19:49:07.986891+00	
00000000-0000-0000-0000-000000000000	1d2e10a8-b052-4916-95ee-3b5d1e78eb3d	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-09 19:49:21.639104+00	
00000000-0000-0000-0000-000000000000	579f9cea-396e-455e-81c6-f081b8d56ac3	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-09 19:55:45.664616+00	
00000000-0000-0000-0000-000000000000	0028136c-1c7f-45e9-9a46-6ced3be04b00	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 20:51:27.749272+00	
00000000-0000-0000-0000-000000000000	f02083d6-7d56-469e-96c3-205834aac5c3	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 20:51:27.751179+00	
00000000-0000-0000-0000-000000000000	2e5237b8-cda0-428f-b485-3f3fec58d251	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 20:54:41.825794+00	
00000000-0000-0000-0000-000000000000	b9417342-4d92-45bd-b506-c22134869aa3	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-09 20:54:41.826707+00	
00000000-0000-0000-0000-000000000000	a64a8533-2c8f-454a-8fe5-3df5e760cee4	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 08:50:33.853261+00	
00000000-0000-0000-0000-000000000000	c542df0d-71b4-44e9-8ac2-4ac01a8e3d45	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 08:50:33.87646+00	
00000000-0000-0000-0000-000000000000	d429acb0-4aca-4503-b528-902dbb164dba	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-15 09:36:35.549656+00	
00000000-0000-0000-0000-000000000000	f14a222f-8654-440e-bfda-9d4a6a4caac2	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-15 10:23:34.849715+00	
00000000-0000-0000-0000-000000000000	8a93c409-9403-4972-8991-d53eb4d272d5	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-15 10:45:34.780047+00	
00000000-0000-0000-0000-000000000000	8842016f-6efc-42b7-a143-915d4ae2c4b1	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 14:27:55.655009+00	
00000000-0000-0000-0000-000000000000	3095a956-74ae-4304-8df9-1055b064c04d	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 14:27:55.665261+00	
00000000-0000-0000-0000-000000000000	2c6a0072-a9f2-424f-a133-9c75195843f3	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 15:30:49.105043+00	
00000000-0000-0000-0000-000000000000	baef82fa-a4bb-438c-8f12-780d5be681ae	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 15:30:49.106711+00	
00000000-0000-0000-0000-000000000000	beb6728c-8b7d-4f2b-98f6-9dbad8e32962	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 19:59:07.493293+00	
00000000-0000-0000-0000-000000000000	3f2e7c1d-da5f-46a8-b0c3-d7193aee1f08	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 19:59:07.506296+00	
00000000-0000-0000-0000-000000000000	9e0602b4-a8b6-42cd-828e-ab614df28f96	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 20:02:06.804845+00	
00000000-0000-0000-0000-000000000000	3fe4c37b-5f1f-4b6a-8662-fbaf25b2759a	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 20:02:06.805813+00	
00000000-0000-0000-0000-000000000000	18e6bf01-8120-424d-9111-d0e41cb735b3	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 20:57:37.943483+00	
00000000-0000-0000-0000-000000000000	97a32af2-bfdd-4acd-9e01-01204111fddd	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 20:57:37.947005+00	
00000000-0000-0000-0000-000000000000	979b62f4-0310-48e3-bab0-d9084d2794cb	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 21:00:54.752635+00	
00000000-0000-0000-0000-000000000000	ce58ebfc-7471-43d0-9e64-4000d86b02bf	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-15 21:00:54.755373+00	
00000000-0000-0000-0000-000000000000	56a47bbb-7a91-4305-b241-633a8ff64f9c	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 08:46:09.950143+00	
00000000-0000-0000-0000-000000000000	b31febbf-ab99-4636-bd8c-aedad30376f8	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 08:46:09.961635+00	
00000000-0000-0000-0000-000000000000	08c65290-893c-4570-b321-5a60c1d1d93b	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 12:27:35.458805+00	
00000000-0000-0000-0000-000000000000	64c3f514-21da-488d-837a-cf014e220a95	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 12:27:35.460407+00	
00000000-0000-0000-0000-000000000000	b45589cd-278c-4ac8-aed9-cf497d719f7f	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 16:29:57.710957+00	
00000000-0000-0000-0000-000000000000	c8ce1237-2b9d-4ff6-97c7-da1666746ff6	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 16:29:57.721843+00	
00000000-0000-0000-0000-000000000000	dcbc5b8d-0be7-4903-8c86-447b3cb792f5	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 16:43:20.718879+00	
00000000-0000-0000-0000-000000000000	31ce0e24-15b5-4e4f-acc5-133e42b2ebf7	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 16:43:20.721796+00	
00000000-0000-0000-0000-000000000000	6d8cf1ea-8061-40f1-bd86-e489f9161833	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 17:30:55.041794+00	
00000000-0000-0000-0000-000000000000	7cad2416-b108-4020-98ae-81c051013060	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-16 17:30:55.047771+00	
00000000-0000-0000-0000-000000000000	14351212-40c7-409b-8d51-e57692d83e77	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 16:30:51.425137+00	
00000000-0000-0000-0000-000000000000	0a6aeb1f-1c49-48a5-9268-e050a4713537	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 16:30:51.439467+00	
00000000-0000-0000-0000-000000000000	b5567e73-f8c8-482c-b96a-d2d5727d22c2	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 17:07:16.505987+00	
00000000-0000-0000-0000-000000000000	eb22fc5f-57ab-42bf-b0e5-1a17c74789ce	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 17:07:16.511647+00	
00000000-0000-0000-0000-000000000000	39820969-ecf9-47ac-916e-c04e2f28be28	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 17:29:48.08679+00	
00000000-0000-0000-0000-000000000000	e621901c-8a5b-4cc6-ab2c-e62a19f04fba	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 17:29:48.087775+00	
00000000-0000-0000-0000-000000000000	98304eec-b25f-4ed4-9671-a537378001b8	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 18:05:18.490879+00	
00000000-0000-0000-0000-000000000000	2861e57f-ffb7-4a23-a54f-623091714538	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 18:05:18.492794+00	
00000000-0000-0000-0000-000000000000	37b9ceef-dc9e-43ec-8bf5-ccd2df2551d4	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 18:54:12.604237+00	
00000000-0000-0000-0000-000000000000	49b4a573-ade4-4dc6-8795-d07f4a5a701e	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 18:54:12.606514+00	
00000000-0000-0000-0000-000000000000	837d35ae-0033-4efb-8189-7976eb7a2cd3	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 20:41:37.259641+00	
00000000-0000-0000-0000-000000000000	edcb2366-8f61-4631-acc9-ad4b849b3771	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-17 20:41:37.262016+00	
00000000-0000-0000-0000-000000000000	ac9d83bd-9bb3-416d-a0cb-94f0d2620c4e	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 11:46:52.977149+00	
00000000-0000-0000-0000-000000000000	1a8b2b38-882b-4d32-a201-230bdddea281	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 11:46:53.004555+00	
00000000-0000-0000-0000-000000000000	deab2744-94fb-4179-bb37-e118d61d735d	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 12:58:17.317932+00	
00000000-0000-0000-0000-000000000000	24b6deaa-2d9b-4b2d-83ea-fd80d3a9733c	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 12:58:17.320214+00	
00000000-0000-0000-0000-000000000000	d07e4ba2-ddc7-4985-9b86-667b389b4227	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 15:48:58.763661+00	
00000000-0000-0000-0000-000000000000	1427c10f-38e7-4f71-b8d3-db2db9a6eead	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 15:48:58.765479+00	
00000000-0000-0000-0000-000000000000	cb56ef92-1b10-42ab-a969-87b449fa1038	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 16:08:43.930643+00	
00000000-0000-0000-0000-000000000000	9b70fabc-877f-4e22-b8f0-eb73b5f0b225	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 16:08:43.932247+00	
00000000-0000-0000-0000-000000000000	dd20155e-78e5-4524-8b96-6a0712836940	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 16:47:26.111753+00	
00000000-0000-0000-0000-000000000000	1a3ae085-6b33-42aa-8be0-4d58a232f673	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-19 16:47:26.114764+00	
00000000-0000-0000-0000-000000000000	7debca6b-a8a7-465d-9a1d-56823ee4ac09	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 17:37:02.705181+00	
00000000-0000-0000-0000-000000000000	c8ae174e-a7f4-4690-b1e9-4d3b3e21e6b9	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 17:37:02.72922+00	
00000000-0000-0000-0000-000000000000	bd4b73d9-a3f9-47ab-852f-f90cc21fa781	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 18:36:08.640484+00	
00000000-0000-0000-0000-000000000000	3c521230-4918-4e0c-843f-1757eacf6f09	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-20 18:36:08.644229+00	
00000000-0000-0000-0000-000000000000	854af8b0-54e1-483c-a8a3-f185e428ea3b	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 04:38:00.386892+00	
00000000-0000-0000-0000-000000000000	07b6ad2d-d136-4b0d-987e-e3dc44f0aee9	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 04:38:00.405353+00	
00000000-0000-0000-0000-000000000000	e1f978d9-b267-4563-bf93-b4269cc3f607	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 07:35:40.783853+00	
00000000-0000-0000-0000-000000000000	74023f25-35d5-4814-9a86-44822c17ec6e	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 07:35:40.796506+00	
00000000-0000-0000-0000-000000000000	9e588376-4512-4e04-bf8c-d3e33ed4a02a	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 09:06:41.638447+00	
00000000-0000-0000-0000-000000000000	81d404ae-eaee-4a85-a0c8-d87585c3d25a	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 09:06:41.64524+00	
00000000-0000-0000-0000-000000000000	a7b861c1-6335-42ef-b96d-74a691ed3a71	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-21 20:11:16.589714+00	
00000000-0000-0000-0000-000000000000	936fd275-e6f3-4bc7-83c3-dc3d9f4f1ff2	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 20:14:38.660258+00	
00000000-0000-0000-0000-000000000000	032e51e3-4b78-4f56-9d98-970d53f70068	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 20:14:38.662488+00	
00000000-0000-0000-0000-000000000000	87df5c3b-57a6-4135-8677-9cb2c4c8fad6	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 20:17:14.130582+00	
00000000-0000-0000-0000-000000000000	519cf379-8499-4bb1-8a38-4382354adc0d	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-21 20:17:14.134899+00	
00000000-0000-0000-0000-000000000000	3efd633d-d08f-4ff8-b902-c36a9ad079b3	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-22 11:03:18.595519+00	
00000000-0000-0000-0000-000000000000	7d356f3a-496a-4106-9b75-fa300bac4aed	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-22 11:03:18.618073+00	
00000000-0000-0000-0000-000000000000	69845b02-9952-4f5c-b776-4c4fa7e3ec17	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-22 18:25:51.671798+00	
00000000-0000-0000-0000-000000000000	d1694451-42e6-4d15-8a58-2f9e00a03cda	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 13:50:48.258416+00	
00000000-0000-0000-0000-000000000000	6c8c402d-a7d3-4671-a142-b22af2a0134a	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 13:50:48.282537+00	
00000000-0000-0000-0000-000000000000	c227d938-9ff8-49d1-ace5-40e76c7cb851	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-25 13:53:04.136684+00	
00000000-0000-0000-0000-000000000000	0a01e2c3-a3f7-4254-be7b-1e9f91256a64	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-25 15:24:23.684117+00	
00000000-0000-0000-0000-000000000000	7adeaace-f684-40cc-b98d-f3720e23e5d6	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 16:55:43.006773+00	
00000000-0000-0000-0000-000000000000	46a9185d-0433-4885-8356-6200a329afb7	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 16:55:43.017493+00	
00000000-0000-0000-0000-000000000000	2f52b3fe-1270-4ffe-938d-01adcaedfd75	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 18:23:02.480603+00	
00000000-0000-0000-0000-000000000000	861c378d-4766-4056-be03-b0e687feb840	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-25 18:23:02.49008+00	
00000000-0000-0000-0000-000000000000	3169c23d-c424-4e79-a0e3-23f7c9b846bc	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-25 18:23:10.798125+00	
00000000-0000-0000-0000-000000000000	2ca327d7-62a1-4fe3-9e3f-84aa7e821ef5	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-25 19:20:17.0533+00	
00000000-0000-0000-0000-000000000000	90626eb7-c6ce-40b1-8a01-32239092ad16	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-26 17:38:48.565288+00	
00000000-0000-0000-0000-000000000000	77a3601a-4cab-4fd1-8132-474415ad3377	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 13:45:39.370689+00	
00000000-0000-0000-0000-000000000000	8b8bc823-1256-4f6a-af65-2082cf6ca22a	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 13:45:39.390297+00	
00000000-0000-0000-0000-000000000000	6cd2ab67-8685-428e-9062-73a2ac4efa61	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 17:58:04.217767+00	
00000000-0000-0000-0000-000000000000	6e90c127-60f6-4317-9b30-3930376314e9	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-27 17:58:04.236236+00	
00000000-0000-0000-0000-000000000000	f149b94f-52a1-43c8-9930-83c647946415	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 17:53:05.872427+00	
00000000-0000-0000-0000-000000000000	c52d270a-ca1e-467a-bfc2-3c894d9aa398	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 17:53:05.899368+00	
00000000-0000-0000-0000-000000000000	3e710604-6880-4116-ad83-47d556d269fd	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-28 19:24:42.604484+00	
00000000-0000-0000-0000-000000000000	e7ef1fec-d39f-454e-a7fc-27db7eeefcda	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-28 19:28:59.961998+00	
00000000-0000-0000-0000-000000000000	fb5b568b-5ac6-4017-9c4d-b72d959f7e2e	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-28 19:30:41.941074+00	
00000000-0000-0000-0000-000000000000	444f280b-98cf-4a7a-b4ee-b864be322f96	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-28 19:31:08.875311+00	
00000000-0000-0000-0000-000000000000	41cf7104-d619-4b9b-9758-c4d429d06864	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-28 21:26:09.927396+00	
00000000-0000-0000-0000-000000000000	1e845c71-4536-4cab-813c-47a82e6c8f23	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-29 10:40:37.190635+00	
00000000-0000-0000-0000-000000000000	5369ba60-d981-4ee4-a749-a144f8fd7d0e	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-29 10:40:37.217599+00	
00000000-0000-0000-0000-000000000000	4ee7acbb-5f75-4fc3-8a03-844cc601bb79	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-29 11:43:04.122053+00	
00000000-0000-0000-0000-000000000000	69aab241-a60b-4c58-a2b3-8ff51e8d084d	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-29 11:43:04.13731+00	
00000000-0000-0000-0000-000000000000	d8fb0e62-17bb-4441-b17d-e3b2164338be	{"action":"logout","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-29 12:11:56.891031+00	
00000000-0000-0000-0000-000000000000	d1ec7950-dd32-48aa-bcec-645e050bb659	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-29 18:54:32.888845+00	
00000000-0000-0000-0000-000000000000	2098fcf5-d5c9-46fc-8c86-1158f81fb17c	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-29 19:00:41.101327+00	
00000000-0000-0000-0000-000000000000	87f7d628-ae6c-4abd-8042-b12e352145c7	{"action":"login","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-29 19:09:45.249141+00	
00000000-0000-0000-0000-000000000000	581147cc-330e-4fc6-91e8-26542aaf27c2	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-29 20:00:35.055949+00	
00000000-0000-0000-0000-000000000000	059885dd-e8fb-479b-9cac-cf012afb3f0d	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-29 20:00:35.061281+00	
00000000-0000-0000-0000-000000000000	f00e70bc-845f-42ab-a0c1-721dcc5250d5	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 09:30:51.337512+00	
00000000-0000-0000-0000-000000000000	40140832-2a74-4eab-95bb-c3524cc0ef9d	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-30 09:30:51.362904+00	
00000000-0000-0000-0000-000000000000	28428624-7c5d-43d2-9f29-170e7659629e	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 14:57:37.367067+00	
00000000-0000-0000-0000-000000000000	dffdbb79-9d64-46eb-85bc-bd8b43b341af	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 14:57:37.385694+00	
00000000-0000-0000-0000-000000000000	130779aa-de0c-46b7-8465-094b415e77b4	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 15:02:54.42167+00	
00000000-0000-0000-0000-000000000000	a2edcbc6-aa76-46a2-b125-6c2113dbada7	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 15:02:54.423961+00	
00000000-0000-0000-0000-000000000000	4909fe68-974f-4428-b9ff-ae9f276b2925	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 15:58:48.747854+00	
00000000-0000-0000-0000-000000000000	f192a69e-9092-45aa-84a2-97589b13c284	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 15:58:48.763627+00	
00000000-0000-0000-0000-000000000000	4319b43d-01fb-43e8-8c69-923c3cf62f39	{"action":"token_refreshed","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 16:20:22.039932+00	
00000000-0000-0000-0000-000000000000	896a298e-07a0-46c4-bf89-e79df091f7d5	{"action":"token_revoked","actor_id":"1cc8717a-d439-4f20-99db-d43be97d244d","actor_username":"sanja.malovic2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 16:20:22.044779+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
31bf9c44-70bb-4277-bc51-28565338f95b	\N	89e7d61a-5b6d-469e-b0ae-71c8579d9075	s256	YojxMjyX5EooItk4AaItiKlKGYY76Jy7gXuzeQd-3dc	facebook			2025-03-28 20:52:25.225007+00	2025-03-28 20:52:25.225007+00	oauth	\N
5219d506-2ed3-4ac2-ad07-0e01aa18e1ca	\N	1b2bebfd-e797-4f21-a550-970091d84cfe	s256	8hl-VSvztJZ8q5NXVtHKCylW4N77mg7TjgiXoD3mZqY	google			2025-03-28 20:54:45.804539+00	2025-03-28 20:54:45.804539+00	oauth	\N
747e6083-44fd-487f-ac74-157bd3a877f6	\N	46ff72da-6f78-453d-99ad-167058491b21	s256	-QncDUmMUROUBKqmU1q3uexAHXbjc1NvPc2zeEfnXP4	google			2025-03-28 21:13:50.708521+00	2025-03-28 21:13:50.708521+00	oauth	\N
5a52b708-e9e5-4cb1-bdd0-9559ffab2c7c	\N	26fe4d5d-bcaf-42b0-ab51-96ea74abc5fe	s256	ZmnrAkpp3EF51uyUUYcWBI11SbGUF41EmlHEByTlxEE	facebook			2025-03-28 21:14:10.247307+00	2025-03-28 21:14:10.247307+00	oauth	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
1cc8717a-d439-4f20-99db-d43be97d244d	1cc8717a-d439-4f20-99db-d43be97d244d	{"sub": "1cc8717a-d439-4f20-99db-d43be97d244d", "name": "Sanja Malovic", "email": "sanja.malovic2@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-03-02 15:38:54.07289+00	2025-03-02 15:38:54.072946+00	2025-03-02 15:38:54.072946+00	4f4f3497-2c0c-403f-813e-2ef718a57598
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
8126c91e-e684-4710-8507-89708889a549	2025-03-29 18:54:32.963761+00	2025-03-29 18:54:32.963761+00	password	2ff175e4-a783-4276-b056-7146504d3629
a47a9ffa-4b50-4a62-9f20-f4621f052128	2025-03-29 19:00:41.110144+00	2025-03-29 19:00:41.110144+00	password	03aed9b7-dfa5-471e-89d8-e5c21543e312
75f0eb8a-b2a8-444c-8906-8dd2bf56ddbf	2025-03-29 19:09:45.260303+00	2025-03-29 19:09:45.260303+00	password	f188423d-b07b-4f66-8f19-529b3fd815f7
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	93	x2BnM4vK-nuH3z_pMfnshw	1cc8717a-d439-4f20-99db-d43be97d244d	t	2025-03-29 19:00:41.105844+00	2025-03-29 20:00:35.061994+00	\N	a47a9ffa-4b50-4a62-9f20-f4621f052128
00000000-0000-0000-0000-000000000000	92	4TppgwgR9vr3__kRIYY5Rw	1cc8717a-d439-4f20-99db-d43be97d244d	t	2025-03-29 18:54:32.930928+00	2025-03-30 09:30:51.363608+00	\N	8126c91e-e684-4710-8507-89708889a549
00000000-0000-0000-0000-000000000000	96	sbddzd5kVgBAJf9UFehjlQ	1cc8717a-d439-4f20-99db-d43be97d244d	f	2025-03-30 09:30:51.378814+00	2025-03-30 09:30:51.378814+00	4TppgwgR9vr3__kRIYY5Rw	8126c91e-e684-4710-8507-89708889a549
00000000-0000-0000-0000-000000000000	94	JRtOVh3R7Ab3qoRiVIn4EA	1cc8717a-d439-4f20-99db-d43be97d244d	t	2025-03-29 19:09:45.256116+00	2025-04-04 14:57:37.38902+00	\N	75f0eb8a-b2a8-444c-8906-8dd2bf56ddbf
00000000-0000-0000-0000-000000000000	95	tVHlCEvfQ5ycxX5yDQYUMA	1cc8717a-d439-4f20-99db-d43be97d244d	t	2025-03-29 20:00:35.068563+00	2025-04-04 15:02:54.424571+00	x2BnM4vK-nuH3z_pMfnshw	a47a9ffa-4b50-4a62-9f20-f4621f052128
00000000-0000-0000-0000-000000000000	97	rFjjUm9swbBgYZ8fJyQ1Hg	1cc8717a-d439-4f20-99db-d43be97d244d	t	2025-04-04 14:57:37.396307+00	2025-04-04 15:58:48.76423+00	JRtOVh3R7Ab3qoRiVIn4EA	75f0eb8a-b2a8-444c-8906-8dd2bf56ddbf
00000000-0000-0000-0000-000000000000	99	UUOZAelqkOTJj9cKls0HnQ	1cc8717a-d439-4f20-99db-d43be97d244d	f	2025-04-04 15:58:48.768323+00	2025-04-04 15:58:48.768323+00	rFjjUm9swbBgYZ8fJyQ1Hg	75f0eb8a-b2a8-444c-8906-8dd2bf56ddbf
00000000-0000-0000-0000-000000000000	98	02FVqaUo_gdxh2jVMuq4pg	1cc8717a-d439-4f20-99db-d43be97d244d	t	2025-04-04 15:02:54.425937+00	2025-04-04 16:20:22.045521+00	tVHlCEvfQ5ycxX5yDQYUMA	a47a9ffa-4b50-4a62-9f20-f4621f052128
00000000-0000-0000-0000-000000000000	100	hvz3t8XFPBWeW5yobe2XHA	1cc8717a-d439-4f20-99db-d43be97d244d	f	2025-04-04 16:20:22.048863+00	2025-04-04 16:20:22.048863+00	02FVqaUo_gdxh2jVMuq4pg	a47a9ffa-4b50-4a62-9f20-f4621f052128
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
8126c91e-e684-4710-8507-89708889a549	1cc8717a-d439-4f20-99db-d43be97d244d	2025-03-29 18:54:32.90879+00	2025-03-30 09:30:51.397881+00	\N	aal1	\N	2025-03-30 09:30:51.397776	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1	46.122.64.135	\N
75f0eb8a-b2a8-444c-8906-8dd2bf56ddbf	1cc8717a-d439-4f20-99db-d43be97d244d	2025-03-29 19:09:45.252984+00	2025-04-04 15:58:48.772862+00	\N	aal1	\N	2025-04-04 15:58:48.772788	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	46.122.64.135	\N
a47a9ffa-4b50-4a62-9f20-f4621f052128	1cc8717a-d439-4f20-99db-d43be97d244d	2025-03-29 19:00:41.10386+00	2025-04-04 16:20:22.052767+00	\N	aal1	\N	2025-04-04 16:20:22.052678	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	46.122.64.135	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	1cc8717a-d439-4f20-99db-d43be97d244d	authenticated	authenticated	sanja.malovic2@gmail.com	$2a$10$Nu2W7ySmg5EwTB.SW98OReYZbxWg0agrQTSo6o5U30gfA7B5oFi1e	2025-03-02 15:39:06.864195+00	\N		2025-03-02 15:38:54.081389+00		\N			\N	2025-03-29 19:09:45.252659+00	{"provider": "email", "providers": ["email"]}	{"sub": "1cc8717a-d439-4f20-99db-d43be97d244d", "name": "Sanja Malovic", "email": "sanja.malovic2@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-03-02 15:38:54.039438+00	2025-04-04 16:20:22.050369+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--

COPY cron.job (jobid, schedule, command, nodename, nodeport, database, username, active, jobname) FROM stdin;
\.


--
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--

COPY cron.job_run_details (jobid, runid, job_pid, database, username, command, status, return_message, start_time, end_time) FROM stdin;
1	1	381570	postgres	postgres	\n  SELECT call_instagram_post_endpoint();\n  	failed	ERROR:  function http_post(text, unknown, unknown, record[]) does not exist\nLINE 1: SELECT http_post(\n               ^\nHINT:  No function matches the given name and argument types. You might need to add explicit type casts.\nQUERY:  SELECT http_post(\n    current_setting('app.settings.base_url') || '/api/social/instagram/post-latest',\n    '{}',\n    'application/json',\n    ARRAY[\n      ('Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'))\n    ]\n  )\nCONTEXT:  PL/pgSQL function call_instagram_post_endpoint() line 3 at PERFORM\n	2025-03-21 18:00:00.443743+00	2025-03-21 18:00:00.483449+00
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
469c7fbc-ae60-41a7-a740-a9683c2e2555	44ee6650c2b998773a25586d3b8c770f17e8c265dd5e19a5c8d1390f896771a4	2025-04-04 15:15:04.802522+00	20250404151504_init	\N	\N	2025-04-04 15:15:04.425055+00	1
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, "articleId", "userId", "anonymousId", "parentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: generated_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generated_articles (id, title, content, "primaryTopic", summary, tags, "publishedAt", "sourceNewsIds", "lastUpdated", "createdAt", "imageUrl", slug) FROM stdin;
reconstructed-1743782420243	🎨 New Art Digest: The Artist's Palette: Modern Art's Ever-Expanding Canvas	# 🎨 New Art Digest: The Artist's Palette: Modern Art's Ever-Expanding Canvas\n\nArt is not static; it is a vivid, breathing entity, constantly evolving and redefining itself in response to the world around it. This dynamic can be seen in recent developments across the global art landscape. Today, we delve into the storie...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Photography	Art is not static; it is a vivid, breathing entity, constantly evolving and redefining itself in response to the world around it. This dynamic can be seen in recent developments across the global art landscape. Today, we delve into the storie...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!	["modernart","artdigest","artist","photography"]	2025-03-17 18:25:09	[]	2025-04-04 16:03:06.94	2025-04-04 16:00:20.244	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-artists-palette-modern-arts-ever-expanding-canvas-artist.jpg	the-artists-palette-modern-arts-ever-expanding-canvas
reconstructed-1743781408132	🎨 The Blooming Art: Watercolor's Grand Revival and Modern Art Museums' Role	# 🎨 The Blooming Art: Watercolor's Grand Revival and Modern Art Museums' Role\n\nIn a world where art continuously reinvents itself, painting remains a steadfast and thriving medium. Recently, the art community has been abuzz with the works of Ukrainian artist Janet Pulcho, whose watercolor paintings have breathed new life into the medium. Meanwhile, the Modern Art Museum of For...\n\nRead more: https://unjica.com/category/painting/the-blooming-art-watercolors-grand-revival-and-modern-art-museums-role\n\n#painting #art #artwork #modernart #contemporaryart #abstractart #popart\n\n*This article was reconstructed from Instagram posts.*	Painting	In a world where art continuously reinvents itself, painting remains a steadfast and thriving medium. Recently, the art community has been abuzz with the works of Ukrainian artist Janet Pulcho, whose watercolor paintings have breathed new life into the medium. Meanwhile, the Modern Art Museum of For...\n\nRead more: https://unjica.com/category/painting/the-blooming-art-watercolors-grand-revival-and-modern-art-museums-role\n\n#painting #art #artwork #modernart #contemporaryart #abstractart #popart	["painting","art","artwork","modernart","contemporaryart","abstractart","popart"]	2025-03-27 17:44:04	[]	2025-04-04 15:44:53.275	2025-04-04 15:43:28.133	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-blooming-art-watercolors-grand-revival-and-modern-art-museums-role-painting.jpg	the-blooming-art-watercolors-grand-revival-and-modern-art-museums-role
reconstructed-1743781408517	🎨 The Brush Strokes of Tomorrow: Embracing the Evolution of Modern Painting	# 🎨 The Brush Strokes of Tomorrow: Embracing the Evolution of Modern Painting\n\nIn an art world that constantly shifts and evolves, painting remains a steadfast medium that both honors tradition and boldly embraces innovation. As the art scene continues to thrive with technological advances and groundbreaking concepts, painting, as a versatile and enduring form of expression, f...\n\nRead more: https://unjica.com/category/painting/the-brush-strokes-of-tomorrow-embracing-the-evolution-of-modern-painting\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #painting\n\n*This article was reconstructed from Instagram posts.*	Painting	In an art world that constantly shifts and evolves, painting remains a steadfast medium that both honors tradition and boldly embraces innovation. As the art scene continues to thrive with technological advances and groundbreaking concepts, painting, as a versatile and enduring form of expression, f...\n\nRead more: https://unjica.com/category/painting/the-brush-strokes-of-tomorrow-embracing-the-evolution-of-modern-painting\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #painting	["art","artwork","modernart","contemporaryart","abstractart","popart","painting"]	2025-03-21 20:59:57	[]	2025-04-04 15:44:53.692	2025-04-04 15:43:28.518	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-brush-strokes-of-tomorrow-embracing-the-evolution-of-modern-painting-painting.jpg	the-brush-strokes-of-tomorrow-embracing-the-evolution-of-modern-painting
reconstructed-1743781408074	🎨 A Modern Art Medley: Exhibitions That Push the Boundaries	# 🎨 A Modern Art Medley: Exhibitions That Push the Boundaries\n\nIn the ever-evolving world of modern art, exhibitions are not just about displaying art; they are platforms that challenge societal norms, celebrate diversity, and push the boundaries of creativity. Recently, the art world has been abuzz with a series of exhibitions that are redefining what it means...\n\nRead more: https://unjica.com/category/exhibition/a-modern-art-medley-exhibitions-that-push-the-boundaries\n\n#exhibition #art #artwork #modernart #contemporaryart #abstractart #popart\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the ever-evolving world of modern art, exhibitions are not just about displaying art; they are platforms that challenge societal norms, celebrate diversity, and push the boundaries of creativity. Recently, the art world has been abuzz with a series of exhibitions that are redefining what it means...\n\nRead more: https://unjica.com/category/exhibition/a-modern-art-medley-exhibitions-that-push-the-boundaries\n\n#exhibition #art #artwork #modernart #contemporaryart #abstractart #popart	["exhibition","art","artwork","modernart","contemporaryart","abstractart","popart"]	2025-03-28 17:44:05	[]	2025-04-04 15:44:53.214	2025-04-04 15:43:28.075	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/a-modern-art-medley-exhibitions-that-push-the-boundaries-exhibition.jpg	a-modern-art-medley-exhibitions-that-push-the-boundaries
reconstructed-1743781407967	🎨 A Decade of Joy: Modern Art and the Gallery Experience	# 🎨 A Decade of Joy: Modern Art and the Gallery Experience\n\nModern art galleries are more than just spaces for displaying art; they are vibrant sanctuaries where new ideas flourish, where color and form dance in unison, and where artists and art lovers alike come together to celebrate creativity. This is especially true for Adelman Fine Art (AFA) in San Dieg...\n\nRead more: https://unjica.com/category/Gallery/a-decade-of-joy-modern-art-and-the-gallery-experience\n\n#gallery #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #gallery #contemporary\n\n*This article was reconstructed from Instagram posts.*	Gallery	Modern art galleries are more than just spaces for displaying art; they are vibrant sanctuaries where new ideas flourish, where color and form dance in unison, and where artists and art lovers alike come together to celebrate creativity. This is especially true for Adelman Fine Art (AFA) in San Dieg...\n\nRead more: https://unjica.com/category/Gallery/a-decade-of-joy-modern-art-and-the-gallery-experience\n\n#gallery #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #gallery #contemporary	["gallery","art","artwork","modernart","contemporaryarts","abstractart","popart","artists","modern_art","art_digest","gallery","contemporary"]	2025-03-30 17:45:31	[]	2025-04-04 15:44:53.087	2025-04-04 15:43:27.968	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/a-decade-of-joy-modern-art-and-the-gallery-experience-gallery.jpg	a-decade-of-joy-modern-art-and-the-gallery-experience
reconstructed-1743781408291	🎨 Sculptural Reveries: The Modern Art Exhibition You Can't Miss	# 🎨 Sculptural Reveries: The Modern Art Exhibition You Can't Miss\n\nIn the ever-evolving world of modern art, exhibitions have become cultural barometers, reflecting both the zeitgeist and the timeless. Recently, a series of exhibitions have caught the art world's attention, each offering a unique perspective on modern art and sculpture. From the bustling scene at M...\n\nRead more: https://unjica.com/category/exhibition/sculptural-reveries-the-modern-art-exhibition-you-cant-miss\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #exhibition\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the ever-evolving world of modern art, exhibitions have become cultural barometers, reflecting both the zeitgeist and the timeless. Recently, a series of exhibitions have caught the art world's attention, each offering a unique perspective on modern art and sculpture. From the bustling scene at M...\n\nRead more: https://unjica.com/category/exhibition/sculptural-reveries-the-modern-art-exhibition-you-cant-miss\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #exhibition	["art","artwork","modernart","contemporaryart","abstractart","popart","exhibition"]	2025-03-25 18:26:31	[]	2025-04-04 15:44:53.461	2025-04-04 15:43:28.292	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/sculptural-reveries-the-modern-art-exhibition-you-cant-miss-exhibition.jpg	sculptural-reveries-the-modern-art-exhibition-you-cant-miss
reconstructed-1743781408020	🎨 Museums in the Modern Age: Preserving the Past and Embracing the Future	# 🎨 Museums in the Modern Age: Preserving the Past and Embracing the Future\n\nIn an era where digital screens compete for our attention, the museum stands as a beacon of quiet reflection and awe-inspiring wonder. Yet, this bastion of cultural preservation is no longer just about dusty relics and echoing halls. Today, museums are redefining themselves, embracing modern art and...\n\nRead more: https://unjica.com/category/museum/museums-in-the-modern-age-preserving-the-past-and-embracing-the-future\n\n#museum #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #museum\n\n*This article was reconstructed from Instagram posts.*	Museum	In an era where digital screens compete for our attention, the museum stands as a beacon of quiet reflection and awe-inspiring wonder. Yet, this bastion of cultural preservation is no longer just about dusty relics and echoing halls. Today, museums are redefining themselves, embracing modern art and...\n\nRead more: https://unjica.com/category/museum/museums-in-the-modern-age-preserving-the-past-and-embracing-the-future\n\n#museum #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #museum	["museum","art","artwork","modernart","contemporaryarts","abstractart","popart","artists","modern_art","art_digest","museum"]	2025-03-29 19:03:11	[]	2025-04-04 15:44:53.147	2025-04-04 15:43:28.021	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/museums-in-the-modern-age-preserving-the-past-and-embracing-the-future-museum.jpg	museums-in-the-modern-age-preserving-the-past-and-embracing-the-future
reconstructed-1743781408351	🎨 The Evolving Canvas: Contemporary Art in Unexpected Places	# 🎨 The Evolving Canvas: Contemporary Art in Unexpected Places\n\nIntroduction\n\nIn an era where art is as much about medium as it is about message, contemporary artists are breaking barriers and redefining spaces. Whether through the immersive genius of Salvador Dalí’s surrealism finding a home in Florida, or the unexpected presence of anime-inspired narratives in...\n\nRead more: https://unjica.com/category/contemporary/the-evolving-canvas-contemporary-art-in-unexpected-places\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #contemporaryart\n\n*This article was reconstructed from Instagram posts.*	Contemporary Art	Introduction\n\nIn an era where art is as much about medium as it is about message, contemporary artists are breaking barriers and redefining spaces. Whether through the immersive genius of Salvador Dalí’s surrealism finding a home in Florida, or the unexpected presence of anime-inspired narratives in...\n\nRead more: https://unjica.com/category/contemporary/the-evolving-canvas-contemporary-art-in-unexpected-places\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #contemporaryart	["art","artwork","modernart","contemporaryart","abstractart","popart","contemporaryart"]	2025-03-24 17:07:39	[]	2025-04-04 15:44:53.521	2025-04-04 15:43:28.352	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-evolving-canvas-contemporary-art-in-unexpected-places-contemporary-art.jpg	the-evolving-canvas-contemporary-art-in-unexpected-places
reconstructed-1743781408750	🎨 New Art Digest: The Artist's Eye: Illuminating Modern Narratives	# 🎨 New Art Digest: The Artist's Eye: Illuminating Modern Narratives\n\nIn the ever-evolving landscape of modern art, where each brushstroke and photograph tells a unique story, artists continue to redefine the boundaries of expression. Recent developments in the art world have brought fresh perspectives to light, from t...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Photography	In the ever-evolving landscape of modern art, where each brushstroke and photograph tells a unique story, artists continue to redefine the boundaries of expression. Recent developments in the art world have brought fresh perspectives to light, from t...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!	["modernart","artdigest","artist","photography"]	2025-03-19 11:47:49	[]	2025-04-04 15:44:53.946	2025-04-04 15:43:28.751	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-artists-eye-illuminating-modern-narratives-artist.jpg	the-artists-eye-illuminating-modern-narratives
reconstructed-1743781407844	🎨 The Thrift Store Find and the Global Stage: A Modern Art Exhibition Odyssey	# 🎨 The Thrift Store Find and the Global Stage: A Modern Art Exhibition Odyssey\n\nWhen does a thrift store lamp become the talk of the modern art world? When its perceived value skyrockets and sends art enthusiasts into a frenzy, shaking with excitement and disbelief. This recent news headline about a $5.99 thrift-store lamp finding fame beyond its humble origins is more than jus...\n\nRead more: https://unjica.com/category/Exhibition/the-thrift-store-find-and-the-global-stage-a-modern-art-exhibition-odyssey\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition\n\n*This article was reconstructed from Instagram posts.*	Exhibition	When does a thrift store lamp become the talk of the modern art world? When its perceived value skyrockets and sends art enthusiasts into a frenzy, shaking with excitement and disbelief. This recent news headline about a $5.99 thrift-store lamp finding fame beyond its humble origins is more than jus...\n\nRead more: https://unjica.com/category/Exhibition/the-thrift-store-find-and-the-global-stage-a-modern-art-exhibition-odyssey\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition	["exhibition","art","artwork","modernart","contemporaryarts","abstractart","popart","artists","modern_art","art_digest","exhibition"]	2025-04-01 17:45:31	[]	2025-04-04 15:44:52.975	2025-04-04 15:43:27.845	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-thrift-store-find-and-the-global-stage-a-modern-art-exhibition-odyssey-exhibition.jpg	the-thrift-store-find-and-the-global-stage-a-modern-art-exhibition-odyssey
reconstructed-1743781408644	🎨 Unraveling the Modern Museum Experience: A Journey Through Time and Innovation	# 🎨 Unraveling the Modern Museum Experience: A Journey Through Time and Innovation\n\nIn the heart of London, the Tate Modern recently celebrated its 25th anniversary with a flair that matched its iconic status. Sponsored by the global apparel brand Uniqlo, this event was not just a birthday bash but an emblem of how museums are evolving in the 21st century. As museums embrace modern...\n\nRead more: https://www.unjica.com/category/museum/a-modern-muse-celebrating-the-ever-evolving-museum-experience\n\n*This article was reconstructed from Instagram posts.*	Contemporary Art	In the heart of London, the Tate Modern recently celebrated its 25th anniversary with a flair that matched its iconic status. Sponsored by the global apparel brand Uniqlo, this event was not just a birthday bash but an emblem of how museums are evolving in the 21st century. As museums embrace modern...\n\nRead more: https://www.unjica.com/category/museum/a-modern-muse-celebrating-the-ever-evolving-museum-experience	[]	2025-03-20 18:24:00	[]	2025-04-04 15:44:53.825	2025-04-04 15:43:28.645	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/unraveling-the-modern-museum-experience-a-journey-through-time-and-innovation-museum.jpg	unraveling-the-modern-museum-experience-a-journey-through-time-and-innovation
reconstructed-1743782420581	🎨 New Art Digest: The Enigmatic Allure of Modern Art Exhibitions: A Dive into Recent Developments	# 🎨 New Art Digest: The Enigmatic Allure of Modern Art Exhibitions: A Dive into Recent Developments\n\nIn the kaleidoscope of modern art, exhibitions serve as the pulsing heart, bringing to life the abstract musings and bold narratives of contemporary creators. Recent events in the art world have painted an intriguing picture...\n\n#modernart #artdigest #exhibition \n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the kaleidoscope of modern art, exhibitions serve as the pulsing heart, bringing to life the abstract musings and bold narratives of contemporary creators. Recent events in the art world have painted an intriguing picture...\n\n#modernart #artdigest #exhibition \n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition"]	2025-03-16 17:46:20	[]	2025-04-04 16:03:07.264	2025-04-04 16:00:20.581	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/50390783bb16c4fe-exhibition.jpg	the-enigmatic-allure-of-modern-art-exhibitions-a-dive-into-recent-developments
reconstructed-1743782420296	🎨 New Art Digest: The Color of Art: Navigating the Modern Landscape with Contemporary Artists	# 🎨 New Art Digest: The Color of Art: Navigating the Modern Landscape with Contemporary Artists\n\nIn the bustling world of modern art, where innovation meets tradition, artists constantly redefine the boundaries of expression. From the vibrant hues of color photography to the haunting emptiness of Victorian fiberglass g...\n\n#modernart #artdigest #artist\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Artist	In the bustling world of modern art, where innovation meets tradition, artists constantly redefine the boundaries of expression. From the vibrant hues of color photography to the haunting emptiness of Victorian fiberglass g...\n\n#modernart #artdigest #artist\n\nRead more on our website!	["modernart","artdigest","artist"]	2025-03-17 17:31:16	[]	2025-04-04 16:03:06.993	2025-04-04 16:00:20.297	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-color-of-art-navigating-the-modern-landscape-with-contemporary-artists-artist.jpg	the-color-of-art-navigating-the-modern-landscape-with-contemporary-artists
reconstructed-1743781408854	🎨 New Art Digest: The Art of Now: Unveiling Modern Mastery	# 🎨 New Art Digest: The Art of Now: Unveiling Modern Mastery\n\nIn the bustling world of contemporary art, where innovation and tradition intermingle, artists continue to redefine the boundaries of expression. From the vibrant world of color photography to the haunting stillness of fiberglass gowns, modern art offers a s...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Photography	In the bustling world of contemporary art, where innovation and tradition intermingle, artists continue to redefine the boundaries of expression. From the vibrant world of color photography to the haunting stillness of fiberglass gowns, modern art offers a s...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!	["modernart","artdigest","artist","photography"]	2025-03-17 18:59:44	[]	2025-04-04 15:44:54.058	2025-04-04 15:43:28.855	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-art-of-now-unveiling-modern-mastery-artist.jpg	the-art-of-now-unveiling-modern-mastery
reconstructed-1743781408802	🎨 New Art Digest: The Artist's Eye: Unveiling Modern Art's New Visions	# 🎨 New Art Digest: The Artist's Eye: Unveiling Modern Art's New Visions\n\nIn the ever-evolving world of modern art, artists continue to push boundaries, challenging our perceptions and reimagining the very essence of artistic expression. Recent developments in the art world have showcased a vibrant tapestry of innovati...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Photography	In the ever-evolving world of modern art, artists continue to push boundaries, challenging our perceptions and reimagining the very essence of artistic expression. Recent developments in the art world have showcased a vibrant tapestry of innovati...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!	["modernart","artdigest","artist","photography"]	2025-03-17 19:00:23	[]	2025-04-04 15:44:54.006	2025-04-04 15:43:28.803	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-artists-eye-unveiling-modern-arts-new-visions-artist.jpg	the-artists-eye-unveiling-modern-arts-new-visions
reconstructed-1743781408463	🎨 The Contemporary Canvas: How Modern Galleries Are Shaping Art's Future	# 🎨 The Contemporary Canvas: How Modern Galleries Are Shaping Art's Future\n\nStep into any modern gallery today, and you might find yourself at the intersection of past, present, and future. These spaces, once solemn halls of quiet reflection, have evolved into vibrant arenas where art, ideas, and innovation collide. As we navigate through this transformative era in the art ...\n\nRead more: https://unjica.com/category/gallery/the-contemporary-canvas-how-modern-galleries-are-shaping-arts-future\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #gallery\n\n*This article was reconstructed from Instagram posts.*	Gallery	Step into any modern gallery today, and you might find yourself at the intersection of past, present, and future. These spaces, once solemn halls of quiet reflection, have evolved into vibrant arenas where art, ideas, and innovation collide. As we navigate through this transformative era in the art ...\n\nRead more: https://unjica.com/category/gallery/the-contemporary-canvas-how-modern-galleries-are-shaping-arts-future\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #gallery	["art","artwork","modernart","contemporaryart","abstractart","popart","gallery"]	2025-03-22 17:07:40	[]	2025-04-04 15:44:53.638	2025-04-04 15:43:28.464	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-contemporary-canvas-how-modern-galleries-are-shaping-arts-future-gallery.jpg	the-contemporary-canvas-how-modern-galleries-are-shaping-arts-future
reconstructed-1743782420705	🎨 New Art Digest: Unveiling the Abstract: Modern Art Exhibitions Making Waves	# 🎨 New Art Digest: Unveiling the Abstract: Modern Art Exhibitions Making Waves\n\nIn the ever-evolving realm of art, exhibitions serve as the beating heart that pumps creativity and innovation into the public sphere. From the bustling streets of Tokyo to the expanding skyline of São Paulo, these cultural showcases invit...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Artist	In the ever-evolving realm of art, exhibitions serve as the beating heart that pumps creativity and innovation into the public sphere. From the bustling streets of Tokyo to the expanding skyline of São Paulo, these cultural showcases invit...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition","abstract","artist"]	2025-03-16 17:41:45	[]	2025-04-04 16:03:07.376	2025-04-04 16:00:20.706	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/adc27b3d9c975f06-exhibition.jpg	unveiling-the-abstract-modern-art-exhibitions-making-waves
reconstructed-1743781408185	🎨 The Art of Time and Change: Contemporary Connections in Modern Art	# 🎨 The Art of Time and Change: Contemporary Connections in Modern Art\n\nIn the ever-evolving landscape of contemporary art, the lines between past and present blur, creating a tapestry of innovation and tradition. Recent developments in art, from Ken Burns' evocative storytelling through baseball to Breitling's horological craftsmanship, reflect a dynamic interplay of i...\n\nRead more: https://unjica.com/category/contemporary/the-art-of-time-and-change-contemporary-connections-in-modern-art\n\n#contemporaryart #art #artwork #modernart #contemporaryart #abstractart #popart\n\n*This article was reconstructed from Instagram posts.*	Contemporary Art	In the ever-evolving landscape of contemporary art, the lines between past and present blur, creating a tapestry of innovation and tradition. Recent developments in art, from Ken Burns' evocative storytelling through baseball to Breitling's horological craftsmanship, reflect a dynamic interplay of i...\n\nRead more: https://unjica.com/category/contemporary/the-art-of-time-and-change-contemporary-connections-in-modern-art\n\n#contemporaryart #art #artwork #modernart #contemporaryart #abstractart #popart	["contemporaryart","art","artwork","modernart","contemporaryart","abstractart","popart"]	2025-03-26 17:39:02	[]	2025-04-04 15:44:53.398	2025-04-04 15:43:28.186	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-art-of-time-and-change-contemporary-connections-in-modern-art-contemporary-art.jpg	the-art-of-time-and-change-contemporary-connections-in-modern-art
reconstructed-1743782420364	🎨 New Art Digest: The Art of Now: Embracing Modern Expressions and Pioneering Visions	# 🎨 New Art Digest: The Art of Now: Embracing Modern Expressions and Pioneering Visions\n\nIn a world where art continually evolves, the line between tradition and innovation often blurs. This dynamic intersection is a playground for modern artists who are reshaping the boundaries of artistic expression. From the hauntin...\n\n#modernart #artdigest #artist\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Artist	In a world where art continually evolves, the line between tradition and innovation often blurs. This dynamic intersection is a playground for modern artists who are reshaping the boundaries of artistic expression. From the hauntin...\n\n#modernart #artdigest #artist\n\nRead more on our website!	["modernart","artdigest","artist"]	2025-03-17 17:29:16	[]	2025-04-04 16:03:07.049	2025-04-04 16:00:20.365	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-art-of-now-embracing-modern-expressions-and-pioneering-visions-artist.jpg	the-art-of-now-embracing-modern-expressions-and-pioneering-visions
reconstructed-1743781407906	🎨 The Art of Play: Contemporary Exhibitions Redefining Modern Culture	# 🎨 The Art of Play: Contemporary Exhibitions Redefining Modern Culture\n\nIn the ever-evolving landscape of modern art, exhibitions serve as poignant reflections of contemporary society, mirroring our obsessions, our innovations, and even our vices. As we delve into the world of recent exhibitions, we find ourselves tangled in a vibrant tapestry woven with elements of pop...\n\nRead more: https://unjica.com/category/Exhibition/the-art-of-play-contemporary-exhibitions-redefining-modern-culture\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition #installation #contemporary\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the ever-evolving landscape of modern art, exhibitions serve as poignant reflections of contemporary society, mirroring our obsessions, our innovations, and even our vices. As we delve into the world of recent exhibitions, we find ourselves tangled in a vibrant tapestry woven with elements of pop...\n\nRead more: https://unjica.com/category/Exhibition/the-art-of-play-contemporary-exhibitions-redefining-modern-culture\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition #installation #contemporary	["exhibition","art","artwork","modernart","contemporaryarts","abstractart","popart","artists","modern_art","art_digest","exhibition","installation","contemporary"]	2025-03-31 17:45:30	[]	2025-04-04 15:44:53.029	2025-04-04 15:43:27.906	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-art-of-play-contemporary-exhibitions-redefining-modern-culture-exhibition.jpg	the-art-of-play-contemporary-exhibitions-redefining-modern-culture
reconstructed-1743781407780	🎨 The Art of Time and Space: Modern Exhibitions Shaping the Current Art Landscape	# 🎨 The Art of Time and Space: Modern Exhibitions Shaping the Current Art Landscape\n\nAs the art world gallops into the future with a flair for the contemporary, exhibitions have taken on new and daring forms. They are not merely places to view art but have become cultural crossroads where history, technology, and creativity intertwine. Recent developments in the art world, particula...\n\nRead more: https://unjica.com/category/Exhibition/the-art-of-time-and-space-modern-exhibitions-shaping-the-current-art-landscape\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition\n\n*This article was reconstructed from Instagram posts.*	Exhibition	As the art world gallops into the future with a flair for the contemporary, exhibitions have taken on new and daring forms. They are not merely places to view art but have become cultural crossroads where history, technology, and creativity intertwine. Recent developments in the art world, particula...\n\nRead more: https://unjica.com/category/Exhibition/the-art-of-time-and-space-modern-exhibitions-shaping-the-current-art-landscape\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition	["exhibition","art","artwork","modernart","contemporaryarts","abstractart","popart","artists","modern_art","art_digest","exhibition"]	2025-04-02 17:45:31	[]	2025-04-04 15:44:52.919	2025-04-04 15:43:27.781	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-art-of-time-and-space-modern-exhibitions-shaping-the-current-art-landscape-exhibition.jpg	the-art-of-time-and-space-modern-exhibitions-shaping-the-current-art-landscape
reconstructed-1743781408402	🎨 Contemporary Conundrums: The Ever-Present Pulse of Modern Art	# 🎨 Contemporary Conundrums: The Ever-Present Pulse of Modern Art\n\nIn the vast, colorful tapestry of today's art world, contemporary art continues to be a dynamic and often contentious force. It challenges perceptions, provokes dialogue, and occasionally leaves us scratching our heads. Recent art news offers a rich palette of diverse stories that remind us how mode...\n\nRead more: https://unjica.com/category/contemporary/contemporary-conundrums-the-ever-present-pulse-of-modern-art\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #contemporaryart\n\n*This article was reconstructed from Instagram posts.*	Contemporary Art	In the vast, colorful tapestry of today's art world, contemporary art continues to be a dynamic and often contentious force. It challenges perceptions, provokes dialogue, and occasionally leaves us scratching our heads. Recent art news offers a rich palette of diverse stories that remind us how mode...\n\nRead more: https://unjica.com/category/contemporary/contemporary-conundrums-the-ever-present-pulse-of-modern-art\n\n#art #artwork #modernart #contemporaryart #abstractart #popart #contemporaryart	["art","artwork","modernart","contemporaryart","abstractart","popart","contemporaryart"]	2025-03-23 17:07:40	[]	2025-04-04 15:44:53.582	2025-04-04 15:43:28.403	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/contemporary-conundrums-the-ever-present-pulse-of-modern-art-contemporary-art.jpg	contemporary-conundrums-the-ever-present-pulse-of-modern-art
reconstructed-1743782420529	🎨 New Art Digest: The Abstract Appeal: Bringing Modern Art to Life Through Exhibition	# 🎨 New Art Digest: The Abstract Appeal: Bringing Modern Art to Life Through Exhibition\n\nIn the world of modern art, the concept of exhibition is not just about displaying artworks; it’s about creating a narrative, an experience that transcends the visual and touches the emotional. Recent developments in the art scene...\n\n#modernart #artdigest #exhibition \n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the world of modern art, the concept of exhibition is not just about displaying artworks; it’s about creating a narrative, an experience that transcends the visual and touches the emotional. Recent developments in the art scene...\n\n#modernart #artdigest #exhibition \n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition"]	2025-03-16 17:47:49	[]	2025-04-04 16:03:07.212	2025-04-04 16:00:20.529	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/84737720427dd201-exhibition.jpg	the-abstract-appeal-bringing-modern-art-to-life-through-exhibition
reconstructed-1743781407220	🎨 A Blossoming Dialogue: Shepard Fairey's New Exhibition and the Timeless Appeal of Flowers in Art	# 🎨 A Blossoming Dialogue: Shepard Fairey's New Exhibition and the Timeless Appeal of Flowers in Art\n\nIn the ever-evolving world of modern art, exhibitions have become the crucibles where artists' visions are not only displayed but also challenged and redefined. This spring, the art world is abuzz with two exhibitions that are as different as they are compelling—Shepard Fairey's new show featuring o...\n\nRead more: https://unjica.com/category/Exhibition/a-blossoming-dialogue-shepard-faireys-new-exhibition-and-the-timeless-appeal-of-flowers-in-art\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition #installation #artist\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the ever-evolving world of modern art, exhibitions have become the crucibles where artists' visions are not only displayed but also challenged and redefined. This spring, the art world is abuzz with two exhibitions that are as different as they are compelling—Shepard Fairey's new show featuring o...\n\nRead more: https://unjica.com/category/Exhibition/a-blossoming-dialogue-shepard-faireys-new-exhibition-and-the-timeless-appeal-of-flowers-in-art\n\n#exhibition #art #artwork #modernart #contemporaryarts #abstractart #popart #artists #modern_art #art_digest #exhibition #installation #artist	["exhibition","art","artwork","modernart","contemporaryarts","abstractart","popart","artists","modern_art","art_digest","exhibition","installation","artist"]	2025-04-03 17:45:31	[]	2025-04-04 15:44:52.467	2025-04-04 15:43:27.676	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/a-blossoming-dialogue-shepard-faireys-new-exhibition-and-the-timeless-appeal-of-flowers-in-art-exhibition.jpg	a-blossoming-dialogue-shepard-faireys-new-exhibition-and-the-timeless-appeal-of-flowers-in-art
reconstructed-1743781408581	🎨 A Modern Muse: Celebrating the Ever-Evolving Museum Experience	# 🎨 A Modern Muse: Celebrating the Ever-Evolving Museum Experience\n\nAs I wander through the hallowed halls of some of the world's most renowned museums, I often find myself pondering the profound juxtaposition of history and modernity that these institutions embody. The museum, that venerable bastion of culture, has long been a repository for the relics of the past,...\n\nRead more: https://www.unjica.com/category/museum/a-modern-muse-celebrating-the-ever-evolving-museum-experience\n\n#art #artwork #modernart #contemporaryart #abstractart #popart\n\n*This article was reconstructed from Instagram posts.*	Contemporary Art	As I wander through the hallowed halls of some of the world's most renowned museums, I often find myself pondering the profound juxtaposition of history and modernity that these institutions embody. The museum, that venerable bastion of culture, has long been a repository for the relics of the past,...\n\nRead more: https://www.unjica.com/category/museum/a-modern-muse-celebrating-the-ever-evolving-museum-experience\n\n#art #artwork #modernart #contemporaryart #abstractart #popart	["art","artwork","modernart","contemporaryart","abstractart","popart"]	2025-03-20 19:22:31	[]	2025-04-04 15:44:53.774	2025-04-04 15:43:28.582	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/a-modern-muse-celebrating-the-ever-evolving-museum-experience-museum.jpg	a-modern-muse-celebrating-the-ever-evolving-museum-experience
reconstructed-1743781408698	🎨 A Lens on the World: Modern Photography’s New Frontiers	# 🎨 A Lens on the World: Modern Photography’s New Frontiers\n\nIn the realm of modern art, photography stands as a medium that continually reshapes and challenges our perception of reality. This dynamic art form captures more than mere images; it encapsulates stories, emotions, and sometimes even the very...\n\nRead more: https://unjica.com/category/photography/a-lens-on-the-world-modern-photographys-new-frontiers\n\n*This article was reconstructed from Instagram posts.*	Contemporary Art	In the realm of modern art, photography stands as a medium that continually reshapes and challenges our perception of reality. This dynamic art form captures more than mere images; it encapsulates stories, emotions, and sometimes even the very...\n\nRead more: https://unjica.com/category/photography/a-lens-on-the-world-modern-photographys-new-frontiers	[]	2025-03-19 18:10:21	[]	2025-04-04 15:44:53.894	2025-04-04 15:43:28.699	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/a-lens-on-the-world-modern-photographys-new-frontiers-photography.jpg	a-lens-on-the-world-modern-photographys-new-frontiers
reconstructed-1743782420639	🎨 New Art Digest: Beyond the Canvas: Diving into Modern Art Exhibitions	# 🎨 New Art Digest: Beyond the Canvas: Diving into Modern Art Exhibitions\n\nIn the ever-evolving world of modern art, exhibitions serve as the heartbeat of cultural expression, a place where abstract ideas converge with tangible reality. There’s an undeniable magic in the air when an artist’s vision transforms into an e...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Artist	In the ever-evolving world of modern art, exhibitions serve as the heartbeat of cultural expression, a place where abstract ideas converge with tangible reality. There’s an undeniable magic in the air when an artist’s vision transforms into an e...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition","abstract","artist"]	2025-03-16 17:42:22	[]	2025-04-04 16:03:07.317	2025-04-04 16:00:20.64	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/650999a1456078fb-exhibition.jpg	beyond-the-canvas-diving-into-modern-art-exhibitions
reconstructed-1743782420470	🎨 New Art Digest: The Art of Rebirth: Modern Artists Reimagining the Gallery Space	# 🎨 New Art Digest: The Art of Rebirth: Modern Artists Reimagining the Gallery Space\n\nIn the ever-evolving world of modern art, a new generation of artists is breathing fresh life into traditional mediums, challenging the boundaries of perception, and redefining the gallery experience. From the haunting allure of Brand...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Photography	In the ever-evolving world of modern art, a new generation of artists is breathing fresh life into traditional mediums, challenging the boundaries of perception, and redefining the gallery experience. From the haunting allure of Brand...\n\n#modernart #artdigest #artist #photography\n\nRead more on our website!	["modernart","artdigest","artist","photography"]	2025-03-17 16:33:23	[]	2025-04-04 16:03:07.159	2025-04-04 16:00:20.471	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/ce5d9745d9b1a719-artist.jpg	the-art-of-rebirth-modern-artists-reimagining-the-gallery-space
reconstructed-1743782420418	🎨 New Art Digest: The Art of the Unseen: Exploring Modern Masterpieces Through the Lens of the Contemporary Artist	# 🎨 New Art Digest: The Art of the Unseen: Exploring Modern Masterpieces Through the Lens of the Contemporary Artist\n\nIn the ever-evolving world of contemporary art, artists are constantly pushing boundaries and redefining what it means to create. From color photography to innovative sculptures, today’s artists are...\n\n#modernart #artdigest #artist\n\nRead more on our website!\n\n*This article was reconstructed from Instagram posts.*	Artist	In the ever-evolving world of contemporary art, artists are constantly pushing boundaries and redefining what it means to create. From color photography to innovative sculptures, today’s artists are...\n\n#modernart #artdigest #artist\n\nRead more on our website!	["modernart","artdigest","artist"]	2025-03-17 17:16:12	[]	2025-04-04 16:03:07.107	2025-04-04 16:00:20.419	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/the-art-of-the-unseen-exploring-modern-masterpieces-through-the-lens-of-the-contemporary-artist-artist.jpg	the-art-of-the-unseen-exploring-modern-masterpieces-through-the-lens-of-the-contemporary-artist
reconstructed-1743782421033	🎨 New Art Digest: The Canvas of Modernity: Unveiling the Layers of Contemporary Art Exhibitions	# 🎨 New Art Digest: The Canvas of Modernity: Unveiling the Layers of Contemporary Art Exhibitions\n\nIn the often enigmatic world of modern art, exhibitions serve as vibran...\n\n#modernart #artdigest #exhibition\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In the often enigmatic world of modern art, exhibitions serve as vibran...\n\n#modernart #artdigest #exhibition\n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition"]	2025-03-16 08:53:53	[]	2025-04-04 16:03:07.717	2025-04-04 16:00:21.033	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/8c6d73adbc4876cc-museum.jpg	the-canvas-of-modernity-unveiling-the-layers-of-contemporary-art-exhibitions
reconstructed-1743782420929	🎨 New Art Digest: Modern Masterpieces: The Muscarelle Museum of Art Reimagined	# 🎨 New Art Digest: Modern Masterpieces: The Muscarelle Museum of Art Reimagined\n\nNestled in the historical heart of Williamsburg, Virginia, the Muscarelle Museum of Art ...\n\n#modernart #artdigest #museum\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Museum	Nestled in the historical heart of Williamsburg, Virginia, the Muscarelle Museum of Art ...\n\n#modernart #artdigest #museum\n\nRead more on our website!\nLink in bio	["modernart","artdigest","museum"]	2025-03-16 08:59:02	[]	2025-04-04 16:03:07.607	2025-04-04 16:00:20.929	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/92280900055b7956-museum.jpg	modern-masterpieces-the-muscarelle-museum-of-art-reimagined
reconstructed-1743782420877	🎨 New Art Digest: Beyond the Canvas: Exhibitions Redefining Modern Art	# 🎨 New Art Digest: Beyond the Canvas: Exhibitions Redefining Modern Art\n\nIn a world where art constantly evolves, exhibitions serve as the lifeline that connects artists...\n\n#modernart #artdigest #exhibition\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Exhibition	In a world where art constantly evolves, exhibitions serve as the lifeline that connects artists...\n\n#modernart #artdigest #exhibition\n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition"]	2025-03-16 08:57:36	[]	2025-04-04 16:03:07.664	2025-04-04 16:00:20.877	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/70b3660ed0186a43-exhibition.jpg	beyond-the-canvas-exhibitions-redefining-modern-art
reconstructed-1743782420817	🎨 New Art Digest: The Abstract Symphony: A Journey Through Modern Art Exhibitions	# 🎨 New Art Digest: The Abstract Symphony: A Journey Through Modern Art Exhibitions\n\nThe world of modern art is a kaleidoscope of creativity, a playground for the mind wh...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Artist	The world of modern art is a kaleidoscope of creativity, a playground for the mind wh...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition","abstract","artist"]	2025-03-16 17:36:06	[]	2025-04-04 16:03:07.489	2025-04-04 16:00:20.818	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/8d2585286be10604-exhibition.jpg	the-abstract-symphony-a-journey-through-modern-art-exhibitions
reconstructed-1743782420764	🎨 New Art Digest: The Modern Art Spectacle: Abstract Wonders and Artistic Journeys	# 🎨 New Art Digest: The Modern Art Spectacle: Abstract Wonders and Artistic Journeys\n\nAs the leaves turn golden and the year draws toward its twilight, the art world unfo...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio\n\n*This article was reconstructed from Instagram posts.*	Artist	As the leaves turn golden and the year draws toward its twilight, the art world unfo...\n\n#modernart #artdigest #exhibition #abstract #artist\n\nRead more on our website!\nLink in bio	["modernart","artdigest","exhibition","abstract","artist"]	2025-03-16 17:41:02	[]	2025-04-04 16:03:07.437	2025-04-04 16:00:20.765	https://pub-63fc20c8550142e693bb270e905fc7eb.r2.dev/article-images/25a9e75b4313fb34-exhibition.jpg	the-modern-art-spectacle-abstract-wonders-and-artistic-journeys
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reactions (id, type, "userId", "anonymousId", "articleId", "commentId", "createdAt") FROM stdin;
cm92zth4z0002rwqch0svw7o1	LIKE	\N	supabase-1cc8717a-d439-4f20-99db-d43be97d244d	reconstructed-1743781407780	\N	2025-04-04 16:22:25.283
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscribers (id, email, "createdAt") FROM stdin;
cm92zr6gk0000rwqcd47j88ed	sanja.malovic2@gmail.com	2025-04-04 16:20:38.132
jdsmnafuh98adgh	herzig.coteam@t-online.de	2025-04-03 17:50:13
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, "emailVerified", password, image, role, "createdAt", "updatedAt") FROM stdin;
cm7rp2aou0000rwavb7bwtwat	Sanja Malovic	sanja.malovic2@gmail.com	\N	$2b$10$pGEx5Z.0op08v.wstHRAy.XlPI8300LZc/Z1dEBkwy9wclZCMau5u	\N	ADMIN	2025-04-04 15:22:26.021	2025-04-04 15:22:26.021
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-03-02 14:23:30
20211116045059	2025-03-02 14:23:31
20211116050929	2025-03-02 14:23:31
20211116051442	2025-03-02 14:23:31
20211116212300	2025-03-02 14:23:31
20211116213355	2025-03-02 14:23:31
20211116213934	2025-03-02 14:23:31
20211116214523	2025-03-02 14:23:31
20211122062447	2025-03-02 14:23:32
20211124070109	2025-03-02 14:23:32
20211202204204	2025-03-02 14:23:32
20211202204605	2025-03-02 14:23:32
20211210212804	2025-03-02 14:23:33
20211228014915	2025-03-02 14:23:33
20220107221237	2025-03-02 14:23:33
20220228202821	2025-03-02 14:23:33
20220312004840	2025-03-02 14:23:33
20220603231003	2025-03-02 14:23:33
20220603232444	2025-03-02 14:23:33
20220615214548	2025-03-02 14:23:34
20220712093339	2025-03-02 14:23:34
20220908172859	2025-03-02 14:23:34
20220916233421	2025-03-02 14:23:34
20230119133233	2025-03-02 14:23:34
20230128025114	2025-03-02 14:23:34
20230128025212	2025-03-02 14:23:35
20230227211149	2025-03-02 14:23:35
20230228184745	2025-03-02 14:23:35
20230308225145	2025-03-02 14:23:35
20230328144023	2025-03-02 14:23:35
20231018144023	2025-03-02 14:23:35
20231204144023	2025-03-02 14:23:35
20231204144024	2025-03-02 14:23:36
20231204144025	2025-03-02 14:23:36
20240108234812	2025-03-02 14:23:36
20240109165339	2025-03-02 14:23:36
20240227174441	2025-03-02 14:23:36
20240311171622	2025-03-02 14:23:36
20240321100241	2025-03-02 14:23:37
20240401105812	2025-03-02 14:23:37
20240418121054	2025-03-02 14:23:37
20240523004032	2025-03-02 14:23:38
20240618124746	2025-03-02 14:23:38
20240801235015	2025-03-02 14:23:38
20240805133720	2025-03-02 14:23:38
20240827160934	2025-03-02 14:23:38
20240919163303	2025-03-02 14:23:39
20240919163305	2025-03-02 14:23:39
20241019105805	2025-03-02 14:23:39
20241030150047	2025-03-02 14:23:39
20241108114728	2025-03-02 14:23:40
20241121104152	2025-03-02 14:23:40
20241130184212	2025-03-02 14:23:40
20241220035512	2025-03-02 14:23:40
20241220123912	2025-03-02 14:23:40
20241224161212	2025-03-02 14:23:40
20250107150512	2025-03-02 14:23:41
20250110162412	2025-03-02 14:23:41
20250123174212	2025-03-02 14:23:41
20250128220012	2025-03-02 14:23:41
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-03-02 14:21:20.972453
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-03-02 14:21:20.987867
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-03-02 14:21:20.999854
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-03-02 14:21:21.029946
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-03-02 14:21:21.067413
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-03-02 14:21:21.079056
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-03-02 14:21:21.092584
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-03-02 14:21:21.106186
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-03-02 14:21:21.119105
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-03-02 14:21:21.134032
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-03-02 14:21:21.14724
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-03-02 14:21:21.160809
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-03-02 14:21:21.177105
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-03-02 14:21:21.191163
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-03-02 14:21:21.204745
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-03-02 14:21:21.24244
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-03-02 14:21:21.258065
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-03-02 14:21:21.279459
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-03-02 14:21:21.293132
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-03-02 14:21:21.308628
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-03-02 14:21:21.323792
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-03-02 14:21:21.342848
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-03-02 14:21:21.38505
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-03-02 14:21:21.419774
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-03-02 14:21:21.432409
25	custom-metadata	67eb93b7e8d401cafcdc97f9ac779e71a79bfe03	2025-03-02 14:21:21.445122
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 100, true);


--
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.jobid_seq', 1, true);


--
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.runid_seq', 1, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (key);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: generated_articles generated_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_articles
    ADD CONSTRAINT generated_articles_pkey PRIMARY KEY (id);


--
-- Name: reactions reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: anonymous_reaction_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX anonymous_reaction_index ON public.reactions USING btree ("anonymousId", "articleId", "commentId");


--
-- Name: generated_articles_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "generated_articles_publishedAt_idx" ON public.generated_articles USING btree ("publishedAt");


--
-- Name: generated_articles_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX generated_articles_slug_key ON public.generated_articles USING btree (slug);


--
-- Name: reactions_userId_articleId_commentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reactions_userId_articleId_commentId_key" ON public.reactions USING btree ("userId", "articleId", "commentId");


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: subscribers_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX subscribers_email_key ON public.subscribers USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: comments comments_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public.generated_articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reactions reactions_articleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "reactions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES public.generated_articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reactions reactions_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reactions reactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.try_cast_double(inp text) FROM postgres;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.url_decode(data text) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.url_encode(data bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) FROM postgres;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_keygen(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE decrypted_key; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;


--
-- Name: TABLE masking_rule; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;


--
-- Name: TABLE mask_columns; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.migrations TO anon;
GRANT ALL ON TABLE storage.migrations TO authenticated;
GRANT ALL ON TABLE storage.migrations TO service_role;
GRANT ALL ON TABLE storage.migrations TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES  TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON TABLES  TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON TABLES  TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

