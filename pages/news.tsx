import { Box, List } from "@mui/material"
import { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"
import RootLayout from "../components/layout/root-layout"
import NewsItem, { NewsItemType } from "../components/news/NewsItem"

const News: NextPage = () => {
  const [news, setNews] = useState<NewsItemType[]>([
    {
      id: "0",
      title: "Atualização de design",
      description: "O fega foi atualizado para o material you!",
      mainImage: "https://www.notebookcheck.info/fileadmin/Notebooks/News/_nc3/unnamed85.png",
    },
    {
      id: "1",
      title: "Novo Ano 2022",
      description:
        "Novo ano e muitas novidades em breve no Fega. Um feliz novo ano 2022 para todos.",
      mainImage:
        "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/news%2Fhappy-new-year-2022-banner-template-vector.webp?alt=media&token=ccaa2187-7fe6-44cc-9ebd-8626871325e6",
    },
  ])

  return (
    <RootLayout>
      <Head>
        <title>Fega</title>
        <meta name="description" content="Fega web" />
        <link rel="icon" href="/fega_round_1.ico" />
      </Head>

      <List>
        {news.map((item) => (
          <NewsItem
            key={item.id}
            id={item.id}
            title={item.title}
            mainImage={item.mainImage}
            description={item.description}
          />
        ))}
      </List>
    </RootLayout>
  )
}

export default News
