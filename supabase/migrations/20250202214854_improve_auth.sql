CREATE OR REPLACE FUNCTION public.prevent_social_oauth_update_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$-- This function ignores the update of avatar_url and full_name in raw_user_meta_data, when the user signs in for the second time using google.
DECLARE
    new_user_avatar_url text;
    new_user_full_name text;
    old_user_avatar_url text;
    old_user_full_name text;
BEGIN
    -- Extract new values from JSON data.
    new_user_avatar_url := NEW.raw_user_meta_data ->> 'avatar_url';

    IF new_user_avatar_url LIKE '%googleusercontent.com%' THEN
        -- Extract old values.
        old_user_avatar_url := OLD.raw_user_meta_data ->> 'avatar_url';
        old_user_full_name  := OLD.raw_user_meta_data ->> 'full_name';
    
        -- Revert the avatar_url only if it was NOT originally NULL.
        IF old_user_avatar_url IS NOT NULL THEN
            NEW.raw_user_meta_data := jsonb_set(
                NEW.raw_user_meta_data,
                '{avatar_url}',
                to_jsonb(old_user_avatar_url),
                false
            );
        ELSE
            -- Remove the key entirely if it was originally NULL
            NEW.raw_user_meta_data := NEW.raw_user_meta_data - 'avatar_url';
        END IF;
        
        -- Revert the full_name only if it was NOT originally NULL.
        IF old_user_full_name IS NOT NULL THEN
            NEW.raw_user_meta_data := jsonb_set(
                NEW.raw_user_meta_data,
                '{full_name}',
                to_jsonb(old_user_full_name),
                false
            );
        ELSE
            -- Remove the key entirely if it was originally NULL
            NEW.raw_user_meta_data := NEW.raw_user_meta_data - 'full_name';
        END IF;
    END IF;

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$declare
  user_fullname text;
  user_email text;
  raw_username text;
begin
  user_fullname := new.raw_user_meta_data ->> 'full_name';
  user_email := new.raw_user_meta_data ->> 'email';
  raw_username := new.raw_user_meta_data ->> 'username';

  IF raw_username IS NULL THEN
    raw_username := public.generate_username(user_fullname, user_email);

    UPDATE auth.users
    SET
      raw_user_meta_data = JSONB_SET(
        raw_user_meta_data,
        '{username}',
        to_jsonb(raw_username)
      )
    WHERE auth.users.id = new.id;
  ELSE
    IF EXISTS (SELECT FROM public.users u WHERE u.username = raw_username) THEN
      RAISE EXCEPTION 'username already exists'; 
    END IF;
  END IF;

  insert into public.users (id, full_name, avatar_url, username)
  values (new.id, user_fullname, new.raw_user_meta_data->>'avatar_url', raw_username);
  
  return new;
end;$function$
;


CREATE TRIGGER prevent_social_oauth_update_metadata_trigger 
BEFORE UPDATE OF raw_user_meta_data ON auth.users 
FOR EACH ROW 
EXECUTE FUNCTION prevent_social_oauth_update_metadata();
