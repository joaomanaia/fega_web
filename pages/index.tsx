import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Posts from '../components/post/Posts'

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-gray-200 dark:bg-gray-900 overflow-hidden">
      <Head>
        <title>Fega</title>
        <meta name="description" content="Fega web" />
        <link rel="icon" href="/fega_round_1.ico" />
      </Head>

      <Header/>

      <div className="flex-grow h-screen overflow-y-auto pb-64">
          <Posts/>
      </div>
    </div>
  )
}

export default Home
