-- Install required extensions (run once)
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create immutable function to remove accents (for index compatibility)
-- IMPORTANT: Specify schema path to avoid trigger issues
CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
RETURNS text
LANGUAGE sql
IMMUTABLE PARALLEL SAFE STRICT
SET search_path = public, extensions
AS $$
  SELECT unaccent('unaccent', $1);
$$;

-- Add generated columns for optimized searching
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name_search text 
GENERATED ALWAYS AS (lower(immutable_unaccent(full_name))) STORED;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username_search text 
GENERATED ALWAYS AS (lower(immutable_unaccent(username))) STORED;

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_users_full_name_search_trgm 
ON users USING gin(full_name_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_users_username_search_trgm 
ON users USING gin(username_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_users_full_name_search_prefix 
ON users (full_name_search text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_users_username_search_prefix 
ON users (username_search text_pattern_ops);

-- Main search function
CREATE OR REPLACE FUNCTION search_users(
  search_query text,
  limit_count int DEFAULT 20,
  offset_count int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  relevance_score float
) 
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  normalized_query text;
BEGIN
  -- Normalize the search query (lowercase + remove accents)
  normalized_query := lower(immutable_unaccent(trim(search_query)));
  
  -- Return empty if query is too short
  IF length(normalized_query) < 2 THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.full_name,
    u.avatar_url,
    -- Calculate relevance score (higher is better)
    GREATEST(
      -- Exact username match (highest priority)
      CASE WHEN u.username_search = normalized_query THEN 100.0 ELSE 0.0 END,
      -- Username starts with query
      CASE WHEN u.username_search LIKE normalized_query || '%' THEN 90.0 ELSE 0.0 END,
      -- Exact full name match
      CASE WHEN u.full_name_search = normalized_query THEN 85.0 ELSE 0.0 END,
      -- Full name starts with query
      CASE WHEN u.full_name_search LIKE normalized_query || '%' THEN 80.0 ELSE 0.0 END,
      -- Username contains query
      CASE WHEN u.username_search LIKE '%' || normalized_query || '%' THEN 60.0 ELSE 0.0 END,
      -- Full name contains query
      CASE WHEN u.full_name_search LIKE '%' || normalized_query || '%' THEN 50.0 ELSE 0.0 END,
      -- Trigram similarity for fuzzy matching (0-40 points)
      GREATEST(
        similarity(u.username_search, normalized_query) * 40.0,
        similarity(u.full_name_search, normalized_query) * 40.0
      )
    ) as relevance_score
  FROM users u
  WHERE 
    -- Filter: must have some relevance
    (
      u.username_search LIKE '%' || normalized_query || '%' OR
      u.full_name_search LIKE '%' || normalized_query || '%' OR
      similarity(u.username_search, normalized_query) > 0.2 OR
      similarity(u.full_name_search, normalized_query) > 0.2
    )
  ORDER BY 
    relevance_score DESC,
    u.username ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Example usage:
-- SELECT * FROM search_users('joao');
-- SELECT * FROM search_users('joão');
-- SELECT * FROM search_users('jose silva', 10, 0);

-- Grant execute permission (adjust role as needed)
GRANT EXECUTE ON FUNCTION search_users TO authenticated;
GRANT EXECUTE ON FUNCTION search_users TO anon;

-- Cleanup old functions if they exist
DROP FUNCTION IF EXISTS search_users_by_fullname(text);
DROP FUNCTION IF EXISTS search_users_by_username(text);
