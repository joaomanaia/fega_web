

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


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgroonga" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_hashids" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_permission" AS ENUM (
    'news.create',
    'events.create',
    'locations.create'
);


ALTER TYPE "public"."app_permission" OWNER TO "postgres";


CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'moderator'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."post_vote_type" AS ENUM (
    'up',
    'down'
);


ALTER TYPE "public"."post_vote_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."post_vote_type" IS 'The type of the vote of a post';



CREATE OR REPLACE FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  bind_permissions int;
begin
  select count(*)
  from public.role_permissions
  where role_permissions.permission = authorize.requested_permission
    and (role_permissions.role = (select (auth.jwt() ->> 'user_role')::public.app_role))
  into bind_permissions;

  return bind_permissions > 0;
end;
$$;


ALTER FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    AS $$declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Check if the user is marked as admin in the profiles table
    select role into user_role from public.user_roles where uid = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_username"("full_name" "text", "email" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    base_username text;
    new_username text;
    cleaned_full_name text;
    cleaned_email text;
    random_suffix text;
    iteration_count int := 0;
    max_iterations int := 10; -- To prevent infinite loops
BEGIN
    -- Replace special characters in full_name and email using unaccent
    cleaned_full_name := LOWER(REGEXP_REPLACE(extensions.unaccent(full_name), '[^a-zA-Z0-9 ]', '', 'g'));
    cleaned_email := LOWER(REGEXP_REPLACE(extensions.unaccent(email), '[^a-zA-Z0-9@.]', '', 'g'));

    -- Generate base username from full_name or email or default base name "user"
    base_username := COALESCE(REPLACE(cleaned_full_name, ' ', ''), LOWER(SUBSTRING(cleaned_email FROM '^[^@]+')), 'fegauser');

    -- Ensure base username is within 20 characters
    base_username := SUBSTRING(base_username FROM 1 FOR 20);

    -- Ensure the base username is at least 3 characters long
    IF LENGTH(base_username) < 3 THEN
        random_suffix := LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
        
        base_username := SUBSTRING(base_username FROM 1 FOR (20 - LENGTH(random_suffix))) || random_suffix;
    END IF;

    new_username := base_username;

    -- Quick check before entering the loop
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = new_username) THEN
        RETURN new_username; -- If it's available, return it immediately
    END IF;

    -- Loop to find a unique username
    LOOP
        random_suffix := LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0'); -- Generate a random 4-digit number as a string
        
        -- Construct the new username ensuring it stays within 20 characters
        new_username := SUBSTRING(base_username FROM 1 FOR (20 - LENGTH(random_suffix))) || random_suffix;

        -- Check if the new username is available
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = new_username) THEN
            RETURN new_username; -- Return the new unique username
        END IF;

        -- Increment loop counter to prevent infinite loops
        iteration_count := iteration_count + 1;
        IF iteration_count >= max_iterations THEN
            -- Fallback mechanism: Append a small UUID to ensure uniqueness
            new_username := SUBSTRING(base_username FROM 1 FOR 15) || LEFT(MD5(RANDOM()::text), 5);
            RETURN SUBSTRING(new_username FROM 1 FOR 20);
        END IF;
    END LOOP;
END;$$;


ALTER FUNCTION "public"."generate_username"("full_name" "text", "email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_post_votes"("post_id" "uuid") RETURNS integer
    LANGUAGE "sql"
    AS $$select
  coalesce(
    sum(
      case
        when sum_vote.vote_type = 'up' then 1
        when sum_vote.vote_type = 'down' then -1
        else 0
      end
    ),
    0
  ) as votes
from
  post_votes as sum_vote
where
  post_id = get_post_votes.post_id$$;


ALTER FUNCTION "public"."get_post_votes"("post_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  user_fullname text;
  user_email text;
  username_generated text;
begin
  user_fullname := new.raw_user_meta_data ->> 'full_name';
  user_email := new.raw_user_meta_data ->> 'email';
  username_generated := public.generate_username(user_fullname, user_email);

  UPDATE auth.users
  SET
    raw_user_meta_data = JSONB_SET(
      raw_user_meta_data,
      '{username}',
      to_jsonb(username_generated)
    )
  WHERE auth.users.id = new.id;

  insert into public.users (id, full_name, avatar_url, username)
  values (new.id, user_fullname, new.raw_user_meta_data->>'avatar_url', username_generated);
  
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_creator_into_group"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into group_participants(group_id, uid)
  values(new.id, auth.uid());

  return new;
end;$$;


ALTER FUNCTION "public"."insert_creator_into_group"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_group_full"("group_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$BEGIN
RETURN (SELECT count(*) >= 16 FROM group_participants WHERE group_participants.group_id = is_group_full.group_id);
END;$$;


ALTER FUNCTION "public"."is_group_full"("group_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_group_participant"("group_id" "uuid", "uid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$select exists (
  select 1
  from group_participants gp
  where gp.group_id = is_group_participant.group_id
  and gp.uid = is_group_participant.uid
);$$;


ALTER FUNCTION "public"."is_group_participant"("group_id" "uuid", "uid" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "bio" "text",
    "username" "text" NOT NULL,
    CONSTRAINT "users_bio_check" CHECK (("length"("bio") <= 160)),
    CONSTRAINT "users_full_name_check" CHECK (("length"("full_name") < 30)),
    CONSTRAINT "users_username_check" CHECK ((("char_length"("username") >= 3) AND ("char_length"("username") <= 20)))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."bio" IS 'The user bio description';



COMMENT ON COLUMN "public"."users"."username" IS 'An unique username for each user';



CREATE OR REPLACE FUNCTION "public"."search_users_by_fullname"("search" "text") RETURNS SETOF "public"."users"
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select * from users where full_name &@~ search;
end;
$$;


ALTER FUNCTION "public"."search_users_by_fullname"("search" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_users_by_username"("search" "text") RETURNS SETOF "public"."users"
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select * from users where username &@~ search;
end;
$$;


ALTER FUNCTION "public"."search_users_by_username"("search" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_can_post"("user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    last_post_time timestamp with time zone;
BEGIN
    SELECT created_at INTO last_post_time
    FROM public.posts
    WHERE uid = user_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF last_post_time IS NULL OR last_post_time < NOW() - INTERVAL '1 minute' THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;


ALTER FUNCTION "public"."user_can_post"("user_id" "uuid") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."calendar_events" (
    "id" integer NOT NULL,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "content" "text" DEFAULT ''::"text" NOT NULL,
    "cover_image" "text" NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "location" integer,
    "other_data" "jsonb" NOT NULL,
    "description" "text",
    CONSTRAINT "calendar_events_description_check" CHECK (("length"("content") < 10000)),
    CONSTRAINT "calendar_events_title_check" CHECK (("length"("title") < 120))
);


ALTER TABLE "public"."calendar_events" OWNER TO "postgres";


COMMENT ON COLUMN "public"."calendar_events"."content" IS 'The text content of the event in markdown';



COMMENT ON COLUMN "public"."calendar_events"."description" IS 'A short description that shows in the event list page';



ALTER TABLE "public"."calendar_events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."calendar_events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "point" "extensions"."geography"(Point,4326) NOT NULL,
    "address" "text"
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."calendar_events_view" WITH ("security_invoker"='true') AS
 SELECT "calendar_events"."id",
    "extensions"."id_encode"(("calendar_events"."id")::bigint) AS "short_id",
    "calendar_events"."title",
    "calendar_events"."description",
    "calendar_events"."content",
    "calendar_events"."cover_image",
    "calendar_events"."start_date",
    "calendar_events"."end_date",
    "calendar_events"."other_data",
    "locations"."name" AS "location_name",
    "locations"."address" AS "location_address",
    "extensions"."st_y"(("locations"."point")::"extensions"."geometry") AS "location_lat",
    "extensions"."st_x"(("locations"."point")::"extensions"."geometry") AS "location_lng"
   FROM ("public"."calendar_events"
     LEFT JOIN "public"."locations" ON (("calendar_events"."location" = "locations"."id")));


ALTER TABLE "public"."calendar_events_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cameras" (
    "id" "text" NOT NULL,
    "link" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "video" boolean NOT NULL,
    "image_poster" "text" NOT NULL,
    "original_camera_url" "text",
    "original_camera_name" "text"
);


ALTER TABLE "public"."cameras" OWNER TO "postgres";


COMMENT ON COLUMN "public"."cameras"."original_camera_name" IS 'The name of the broadcast service';



CREATE TABLE IF NOT EXISTS "public"."group_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "uid" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reply_to" "uuid",
    CONSTRAINT "check_message_length" CHECK (("length"("message") <= 500))
);


ALTER TABLE "public"."group_messages" OWNER TO "postgres";


COMMENT ON COLUMN "public"."group_messages"."reply_to" IS 'The id this message is responding to ';



CREATE OR REPLACE VIEW "public"."group_messages_view" WITH ("security_invoker"='true') AS
 SELECT "group_messages"."id",
    "group_messages"."group_id",
    "group_messages"."uid",
    "group_messages"."message",
    "group_messages"."created_at",
    "group_messages"."reply_to",
    "users"."full_name" AS "user_full_name",
    "users"."avatar_url" AS "user_avatar_url",
    "rp"."message" AS "reply_message",
    "rp"."uid" AS "reply_to_uid",
    "users"."username" AS "user_username"
   FROM (("public"."group_messages"
     JOIN "public"."users" ON (("group_messages"."uid" = "users"."id")))
     LEFT JOIN "public"."group_messages" "rp" ON (("group_messages"."reply_to" = "rp"."id")));


ALTER TABLE "public"."group_messages_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_participants" (
    "group_id" "uuid" NOT NULL,
    "uid" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."group_participants" OWNER TO "postgres";


COMMENT ON TABLE "public"."group_participants" IS 'Groups where the users are in';



CREATE OR REPLACE VIEW "public"."group_participants_view" WITH ("security_invoker"='true') AS
 SELECT "group_participants"."group_id",
    "group_participants"."uid",
    "group_participants"."created_at",
    "users"."full_name",
    "users"."avatar_url",
    "users"."username"
   FROM ("public"."group_participants"
     JOIN "public"."users" ON (("users"."id" = "group_participants"."uid")));


ALTER TABLE "public"."group_participants_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."group_view" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::timestamp with time zone AS "created_at",
    NULL::"uuid" AS "created_by",
    NULL::"text" AS "name",
    NULL::"text" AS "icon_url",
    NULL::boolean AS "is_owner",
    NULL::bigint AS "participants_count",
    NULL::"text" AS "author_name",
    NULL::"text" AS "author_username",
    NULL::"text" AS "author_avatar_url";


ALTER TABLE "public"."group_view" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."group_with_last_message_view" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::timestamp with time zone AS "created_at",
    NULL::"uuid" AS "created_by",
    NULL::"text" AS "name",
    NULL::"text" AS "icon_url",
    NULL::boolean AS "is_owner",
    NULL::bigint AS "participants_count",
    NULL::"text" AS "author_name",
    NULL::"text" AS "last_message",
    NULL::timestamp with time zone AS "last_message_at",
    NULL::"uuid" AS "last_message_by",
    NULL::"text" AS "author_username",
    NULL::"text" AS "author_avatar_url";


ALTER TABLE "public"."group_with_last_message_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "name" "text" NOT NULL,
    "icon_url" "text"
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


ALTER TABLE "public"."locations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."locations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."news" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "cover_image" "text" NOT NULL,
    "tags" "text"[],
    CONSTRAINT "news_tags_check" CHECK (("array_length"("tags", 1) <= 10))
);


ALTER TABLE "public"."news" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."news_view" WITH ("security_invoker"='true') AS
 SELECT "news"."id",
    "news"."created_at",
    "news"."content",
    "news"."title",
    "news"."description",
    "news"."created_by",
    "news"."cover_image",
    "news"."tags",
    "author"."full_name" AS "author_full_name",
    "author"."avatar_url" AS "author_avatar_url"
   FROM ("public"."news"
     JOIN "public"."users" "author" ON (("author"."id" = "news"."created_by")));


ALTER TABLE "public"."news_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_votes" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "uid" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "vote_type" "public"."post_vote_type"
);


ALTER TABLE "public"."post_votes" OWNER TO "postgres";


COMMENT ON TABLE "public"."post_votes" IS 'The votes of the post (up/down)';



CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "uid" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text" NOT NULL,
    "images" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    CONSTRAINT "posts_description_check" CHECK (("length"("description") < 500))
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."posts_view" WITH ("security_invoker"='true') AS
 SELECT "post"."id",
    "post"."uid",
    "post"."created_at",
    "post"."description",
    "post"."images",
    "users"."full_name" AS "author_full_name",
    "users"."avatar_url" AS "author_avatar_url",
    "vote"."vote_type" AS "user_vote_type",
    "public"."get_post_votes"("post"."id") AS "votes",
    "users"."username" AS "author_username"
   FROM (("public"."posts" "post"
     JOIN "public"."users" ON (("post"."uid" = "users"."id")))
     LEFT JOIN "public"."post_votes" "vote" ON ((("vote"."post_id" = "post"."id") AND ("vote"."uid" = "auth"."uid"()))));


ALTER TABLE "public"."posts_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" bigint NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "permission" "public"."app_permission" NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_permissions" IS 'Application permissions for each role.';



ALTER TABLE "public"."role_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."role_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" bigint NOT NULL,
    "uid" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_roles" IS 'Application roles for each user.';



ALTER TABLE "public"."user_roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."calendar_events"
    ADD CONSTRAINT "calendar_events_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."calendar_events"
    ADD CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cameras"
    ADD CONSTRAINT "cameras_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."cameras"
    ADD CONSTRAINT "cameras_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_pkey" PRIMARY KEY ("group_id", "uid");



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "groups_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_votes"
    ADD CONSTRAINT "post_votes_pkey" PRIMARY KEY ("post_id", "uid");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_permission_key" UNIQUE ("role", "permission");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_uid_role_key" UNIQUE ("uid", "role");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE INDEX "ix_users_fullname" ON "public"."users" USING "pgroonga" ("full_name");



CREATE INDEX "ix_users_username" ON "public"."users" USING "pgroonga" ("username");



CREATE INDEX "locations_geo_index" ON "public"."locations" USING "gist" ("point");



CREATE INDEX "users_username_idx" ON "public"."users" USING "btree" ("username");



CREATE OR REPLACE VIEW "public"."group_view" WITH ("security_invoker"='true') AS
 SELECT DISTINCT ON ("groups"."id") "groups"."id",
    "groups"."created_at",
    "groups"."created_by",
    "groups"."name",
    "groups"."icon_url",
        CASE
            WHEN ("auth"."uid"() = "groups"."created_by") THEN true
            ELSE false
        END AS "is_owner",
    "count"("group_participants"."uid") AS "participants_count",
    "users"."full_name" AS "author_name",
    "users"."username" AS "author_username",
    "users"."avatar_url" AS "author_avatar_url"
   FROM (("public"."groups"
     JOIN "public"."group_participants" ON (("groups"."id" = "group_participants"."group_id")))
     LEFT JOIN "public"."users" ON (("groups"."created_by" = "users"."id")))
  GROUP BY "groups"."id", "group_participants"."group_id", "users"."full_name", "users"."username", "users"."avatar_url";



CREATE OR REPLACE VIEW "public"."group_with_last_message_view" WITH ("security_invoker"='true') AS
 SELECT DISTINCT ON ("groups"."id") "groups"."id",
    "groups"."created_at",
    "groups"."created_by",
    "groups"."name",
    "groups"."icon_url",
        CASE
            WHEN ("auth"."uid"() = "groups"."created_by") THEN true
            ELSE false
        END AS "is_owner",
    "count"("group_participants"."uid") AS "participants_count",
    "users"."full_name" AS "author_name",
    "group_messages"."message" AS "last_message",
    "group_messages"."created_at" AS "last_message_at",
    "group_messages"."uid" AS "last_message_by",
    "users"."username" AS "author_username",
    "users"."avatar_url" AS "author_avatar_url"
   FROM ((("public"."groups"
     LEFT JOIN "public"."group_participants" ON (("groups"."id" = "group_participants"."group_id")))
     LEFT JOIN "public"."users" ON (("groups"."created_by" = "users"."id")))
     LEFT JOIN "public"."group_messages" ON (("groups"."id" = "group_messages"."group_id")))
  GROUP BY "groups"."id", "group_participants"."group_id", "users"."full_name", "users"."username", "users"."avatar_url", "group_messages"."group_id", "group_messages"."message", "group_messages"."created_at", "group_messages"."uid"
  ORDER BY "groups"."id", "group_messages"."created_at" DESC;



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "on_group_created" AFTER INSERT ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."insert_creator_into_group"();



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."post_votes"
    ADD CONSTRAINT "post_votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_votes"
    ADD CONSTRAINT "post_votes_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."calendar_events"
    ADD CONSTRAINT "public_calendar_events_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."locations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "public_group_messages_reply_message_fkey" FOREIGN KEY ("reply_to") REFERENCES "public"."group_messages"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "public_news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow auth admin to read user roles" ON "public"."user_roles" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Allow create for authorized users" ON "public"."news" FOR INSERT TO "authenticated" WITH CHECK ("public"."authorize"('news.create'::"public"."app_permission"));



CREATE POLICY "Can view groups you are participating in" ON "public"."groups" FOR SELECT USING ((("created_by" = "auth"."uid"()) OR "public"."is_group_participant"("id", ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Can view other group participants for groups they are in" ON "public"."group_participants" FOR SELECT USING ("public"."is_group_participant"("group_id", "auth"."uid"()));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."groups" FOR DELETE TO "authenticated" USING ("public"."is_group_participant"("id", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."post_votes" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "uid"));



CREATE POLICY "Enable delete only for author" ON "public"."posts" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "uid"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."post_votes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK ("public"."user_can_post"("uid"));



CREATE POLICY "Enable insert to authorized users" ON "public"."calendar_events" FOR INSERT TO "authenticated" WITH CHECK ("public"."authorize"('events.create'::"public"."app_permission"));



CREATE POLICY "Enable insert to authorized users" ON "public"."locations" FOR INSERT TO "authenticated" WITH CHECK ("public"."authorize"('locations.create'::"public"."app_permission"));



CREATE POLICY "Enable read access for all users" ON "public"."calendar_events" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."cameras" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."locations" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."news" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."post_votes" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "Enable update for participant users only" ON "public"."groups" FOR UPDATE TO "authenticated" USING ("public"."is_group_participant"("id", ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK ("public"."is_group_participant"("id", ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Enable update for users based on user_id" ON "public"."post_votes" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "uid"));



CREATE POLICY "Only authenticated users can create a group" ON "public"."groups" FOR INSERT TO "authenticated" WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Public users are viewable by everyone." ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "User can delete thier messages that are participating" ON "public"."group_messages" FOR DELETE TO "authenticated" USING ((("uid" = ( SELECT "auth"."uid"() AS "uid")) AND "public"."is_group_participant"("group_id", ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "User can remove themselves or from an another user from a room" ON "public"."group_participants" FOR DELETE USING ((("uid" = ( SELECT "auth"."uid"() AS "uid")) OR "public"."is_group_participant"("group_id", ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "User can select message that they are in the group" ON "public"."group_messages" FOR SELECT TO "authenticated" USING ("public"."is_group_participant"("group_id", "auth"."uid"()));



CREATE POLICY "User can update their message in groups participating" ON "public"."group_messages" FOR UPDATE TO "authenticated" USING ((("uid" = "auth"."uid"()) AND "public"."is_group_participant"("group_id", "auth"."uid"()))) WITH CHECK ((("uid" = "auth"."uid"()) AND "public"."is_group_participant"("group_id", "auth"."uid"())));



CREATE POLICY "Users can add users to rooms they are in" ON "public"."group_participants" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_group_participant"("group_id", ( SELECT "auth"."uid"() AS "uid")) AND (NOT "public"."is_group_full"("group_id"))));



CREATE POLICY "Users can insert their own messages" ON "public"."group_messages" FOR INSERT WITH CHECK ((("uid" = "auth"."uid"()) AND "public"."is_group_participant"("group_id", "auth"."uid"())));



CREATE POLICY "Users can insert their own profile." ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own profile." ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."calendar_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cameras" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."news" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_votes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


CREATE PUBLICATION "supabase_realtime_messages_publication" WITH (publish = 'insert, update, delete, truncate');


-- supabase_admin causes issues when appling the migration
ALTER PUBLICATION "supabase_realtime_messages_publication" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."group_messages";



GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";
GRANT USAGE ON SCHEMA "public" TO "postgres";
















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "service_role";



GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."generate_username"("full_name" "text", "email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_username"("full_name" "text", "email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_username"("full_name" "text", "email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_post_votes"("post_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_post_votes"("post_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post_votes"("post_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_creator_into_group"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_creator_into_group"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_creator_into_group"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_group_full"("group_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_group_full"("group_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_group_full"("group_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_group_participant"("group_id" "uuid", "uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_group_participant"("group_id" "uuid", "uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_group_participant"("group_id" "uuid", "uid" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON FUNCTION "public"."search_users_by_fullname"("search" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users_by_fullname"("search" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users_by_fullname"("search" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_users_by_username"("search" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_users_by_username"("search" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_users_by_username"("search" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_can_post"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_can_post"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_can_post"("user_id" "uuid") TO "service_role";























































































GRANT ALL ON TABLE "public"."calendar_events" TO "anon";
GRANT ALL ON TABLE "public"."calendar_events" TO "authenticated";
GRANT ALL ON TABLE "public"."calendar_events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."calendar_events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."calendar_events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."calendar_events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON TABLE "public"."calendar_events_view" TO "anon";
GRANT ALL ON TABLE "public"."calendar_events_view" TO "authenticated";
GRANT ALL ON TABLE "public"."calendar_events_view" TO "service_role";



GRANT ALL ON TABLE "public"."cameras" TO "anon";
GRANT ALL ON TABLE "public"."cameras" TO "authenticated";
GRANT ALL ON TABLE "public"."cameras" TO "service_role";



GRANT ALL ON TABLE "public"."group_messages" TO "anon";
GRANT ALL ON TABLE "public"."group_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."group_messages" TO "service_role";



GRANT ALL ON TABLE "public"."group_messages_view" TO "anon";
GRANT ALL ON TABLE "public"."group_messages_view" TO "authenticated";
GRANT ALL ON TABLE "public"."group_messages_view" TO "service_role";



GRANT ALL ON TABLE "public"."group_participants" TO "anon";
GRANT ALL ON TABLE "public"."group_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."group_participants" TO "service_role";



GRANT ALL ON TABLE "public"."group_participants_view" TO "anon";
GRANT ALL ON TABLE "public"."group_participants_view" TO "authenticated";
GRANT ALL ON TABLE "public"."group_participants_view" TO "service_role";



GRANT ALL ON TABLE "public"."group_view" TO "anon";
GRANT ALL ON TABLE "public"."group_view" TO "authenticated";
GRANT ALL ON TABLE "public"."group_view" TO "service_role";



GRANT ALL ON TABLE "public"."group_with_last_message_view" TO "anon";
GRANT ALL ON TABLE "public"."group_with_last_message_view" TO "authenticated";
GRANT ALL ON TABLE "public"."group_with_last_message_view" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON SEQUENCE "public"."locations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."locations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."locations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."news" TO "anon";
GRANT ALL ON TABLE "public"."news" TO "authenticated";
GRANT ALL ON TABLE "public"."news" TO "service_role";



GRANT ALL ON TABLE "public"."news_view" TO "anon";
GRANT ALL ON TABLE "public"."news_view" TO "authenticated";
GRANT ALL ON TABLE "public"."news_view" TO "service_role";



GRANT ALL ON TABLE "public"."post_votes" TO "anon";
GRANT ALL ON TABLE "public"."post_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."post_votes" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."posts_view" TO "anon";
GRANT ALL ON TABLE "public"."posts_view" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_view" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "service_role";
GRANT ALL ON TABLE "public"."user_roles" TO "supabase_auth_admin";



GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
