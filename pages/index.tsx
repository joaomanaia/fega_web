import type { NextPage } from "next"
import Head from "next/head"
import React from "react"
import CreatePost from "../components/post/CreatePost"
import Posts, { PostType } from "../components/post/Posts"
import useSWR from "swr"
import RootLayout from "../components/layout/root-layout"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {
  const { data } = useSWR("/api/posts/initialPosts", fetcher)

  const testPosts: PostType[] = [
    {
      id: "a",
      uid: "b",
      timestamp: "21:32",
      data: {
        description: "Era uma vez um post",
        images: [],
      },
    },
  ]

  return (
    <RootLayout>
      <Head>
        <title>Fega</title>
        <meta name="description" content="A new social network from ega!" />
        <link rel="icon" href="/fega_round_1.ico" />

        {/**  Facebook Meta Tags */}
        <meta property="og:url" content="https://fega.ml/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fega" />
        <meta property="og:description" content="A new social network from ega!" />
        <meta
          property="og:image"
          content="http://www.jf-ega.pt/imagens/geral/picota_serrazina_valejanes/_MG_6062.jpg"
        />
        {/**  Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="fega.ml" />
        <meta property="twitter:url" content="https://fega.ml/" />
        <meta name="twitter:title" content="Fega" />
        <meta name="twitter:description" content="A new social network from ega!" />
        <meta
          name="twitter:image"
          content="http://www.jf-ega.pt/imagens/geral/picota_serrazina_valejanes/_MG_6062.jpg"
        />
      </Head>

      <main>
        {/** Posts */}
        <div className="flex-grow h-screen lg:flex overflow-y-auto lg:overflow-y-hidden scrollbar-hide">
          <div className="flex-grow pb-64 lg:overflow-y-auto scrollbar-hide">
            {/** <div id="container-c5b172d55e6697e12ec8cfa82c53b329"></div> */}
            {/**data && <Posts posts={JSON.parse(data.posts)} />*/}
            {<Posts posts={testPosts} />}
          </div>
          <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl px-5">
            <CreatePost />
          </div>
        </div>
      </main>
    </RootLayout>
  )
}

export default Home

/*

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("https://www.fega.ml/api/posts/initialPosts")
  //const res = await fetch("http://localhost:3000/api/posts/initialPosts")
  const data = await res.json()

  return {
    props: {
      posts: data.posts
    }
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await firestoreAdmin.collection("publications")
      .orderBy("timestamp", "desc")
      .limit(10)
      .get()

  const postsFormatted = posts.docs.map((post) => ({
    id: post.id,
    uid: post.data().uid,
    timestamp: post.data().timestamp.toDate(),
    data: {
      description: post.data().data.description,
      images: post.data().data.images,
    }
  }))

  return {
    props: {
      posts: JSON.stringify(postsFormatted)
    }
  }
}
*/
