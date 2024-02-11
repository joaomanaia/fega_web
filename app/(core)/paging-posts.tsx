"use client"

import { PostsWithData } from "@/types/PostType"
import { useState } from "react"
import Post from "./components/post/Post"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"

const ITEMS_PER_PAGE = 7

interface PagingPostsProps {
  uid?: string
  initialPosts: PostsWithData
}

export const PagingPosts: React.FC<PagingPostsProps> = ({ uid, initialPosts }) => {
  const [posts, setPosts] = useState<PostsWithData>(initialPosts)
  const [page, setPage] = useState(1)
  const [endReached, setEndReached] = useState(false)

  const loadMore = async () => {
    if (endReached) return

    let from = page * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const supabase = createClientComponentClient<Database>()

    var newPosts: PostsWithData = []

    if (uid) {
      const { data: newPosts_ } = await supabase
        .rpc("get_posts_with_data")
        .eq("uid", uid)
        .order("created_at", { ascending: false })
        .range(from, to)

      console.log(newPosts_)

      // If there are no new posts, we reached the end
      if (!newPosts_) return

      newPosts = newPosts_
    } else {
      const { data: newPosts_ } = await supabase
        .rpc("get_posts_with_data")
        .order("created_at", { ascending: false })
        .range(from, to)

      console.log(newPosts_)

      // If there are no new posts, we reached the end
      if (!newPosts_) return

      newPosts = newPosts_
    }

    if (newPosts) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts])
      setPage((prevPage) => prevPage + 1)

      // If we have less than ITEMS_PER_PAGE posts, we reached the end
      if (newPosts.length < ITEMS_PER_PAGE) {
        setEndReached(true)
      }
    }
  }

  return (
    <>
      {posts?.map((post) => (
        <Post
          key={post.id}
          post={post}
          postVotes={post.votes}
          authorName={post.full_name}
          authorAvatarUrl={post.avatar_url}
          localUserVotedType={post.vote_type}
        />
      ))}

      {!endReached && <Button onClick={loadMore}>Load More</Button>}
    </>
  )
}
