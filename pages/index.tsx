import type { NextPage } from "next"
import Head from "next/head"
import React from "react"
import CreatePost from "../components/post/CreatePost"
import Posts, { PostType } from "../components/post/Posts"
import useSWR from "swr"
import RootLayout from "../components/layout/root-layout"
import { Container } from "@mui/material"
import { InitialPostsData } from "./api/posts/initialPosts"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Home: NextPage = () => {
  const { data } = useSWR<InitialPostsData>("/api/posts/initialPosts", fetcher)

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

      <main className="flex flex-col lg:flex-row-reverse relative">
        <div className="lg:fixed">
          <CreatePost />
        </div>

        <Container className="ml-4">{<Posts posts={JSON.parse(data?.posts || "[]")} />}</Container>
      </main>
    </RootLayout>
  )
}

export default Home

/*
const testPosts: PostType[] = [
    {
      id: "a",
      uid: "b",
      timestamp: "21:32",
      data: {
        description: "Era uma vez um post",
        images: [
          "https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc3/unnamed85.png",
        ],
      },
    },
    {
      id: "b",
      uid: "b",
      timestamp: "21:32",
      data: {
        description: "Era uma vez um post",
        images: [
          "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/news%2Fhappy-new-year-2022-banner-template-vector.webp?alt=media&token=ccaa2187-7fe6-44cc-9ebd-8626871325e6",
          "https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc3/unnamed85.png",
        ],
      },
    },
    {
      id: "c",
      uid: "b",
      timestamp: "21:32",
      data: {
        description: "Era uma vez um post",
        images: [],
      },
    },
  ]
*/
