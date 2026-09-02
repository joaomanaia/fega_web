create or replace function toggle_post_vote(
  p_post_id   uuid,
  p_vote_type public.post_vote_type
) returns table (
  post_id    uuid,
  uid        uuid,
  vote_type  public.post_vote_type,
  created_at timestamptz
)
language sql
security invoker
set search_path = public
as $$
  with locked as materialized (
    select pv.vote_type
    from   post_votes pv
    where  pv.post_id = p_post_id
      and  pv.uid     = auth.uid()
    for update
  ),
  deleted as (
    delete from post_votes
    where  post_votes.post_id = p_post_id
      and  post_votes.uid     = auth.uid()
      and  (select l.vote_type from locked l) = p_vote_type
    returning *
  ),
  upserted as (
    insert into post_votes (post_id, uid, vote_type)
    select p_post_id, auth.uid(), p_vote_type
    where  not exists (select 1 from deleted)
    on conflict (post_id, uid)
    do update set vote_type = excluded.vote_type
    returning *
  )
  select d.post_id, d.uid, d.vote_type, d.created_at from deleted  d
  union all
  select u.post_id, u.uid, u.vote_type, u.created_at from upserted u;
$$;

revoke execute on function toggle_post_vote(uuid, public.post_vote_type) from public;
grant  execute on function toggle_post_vote(uuid, public.post_vote_type) to   authenticated;
