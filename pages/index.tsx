import type { NextPage } from "next"
import Head from "next/head"
import React, { Suspense } from "react"
import CreatePost from "../components/post/CreatePost"
import RootLayout from "../components/layout/root-layout"
import { CircularProgress, Container } from "@mui/material"
import dynamic from "next/dynamic"
import useSWR from "swr"
import { InitialPostsData } from "./api/posts/initialPosts"
import { fetcher } from "../utils/data"

const DynamicPosts = dynamic(() => import("../components/post/Posts"), {
  suspense: true
})

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

        <Container className="ml-4">
          <Suspense fallback={<CircularProgress />}>
            <DynamicPosts posts={JSON.parse(data?.posts || "[]")} />
          </Suspense>
        </Container>
      </main>
    </RootLayout>
  )
}

export default Home