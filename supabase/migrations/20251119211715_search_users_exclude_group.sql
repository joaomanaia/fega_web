-- Create function to search users excluding group members
CREATE OR REPLACE FUNCTION search_users_exclude_group(
  search_query text,
  group_id_param uuid,
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
    -- Exclude users already in the group
    NOT EXISTS (
      SELECT 1 
      FROM group_participants gp 
      WHERE gp.uid = u.id 
      AND gp.group_id = group_id_param
    )
    -- Filter: must have some relevance
    AND (
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_users_exclude_group TO authenticated;
GRANT EXECUTE ON FUNCTION search_users_exclude_group TO anon;
