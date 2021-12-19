import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAppThemeLight } from '../app/appSlice'
import Header from '../components/header/Header'
import CreatePost from '../components/post/CreatePost'
import Posts from '../components/post/Posts'
import { setAppThemeLight, setAppThemeNight } from '../app/appSlice'
import LeftSidebarMenu from '../components/leftSidebar/LeftSidebarMenu'
import BottomNavItem from '../components/bottomNavigation/BottomNavItem'
import BottomNav from '../components/bottomNavigation/BottomNav'

const Home: NextPage = ({posts}: any) => {

  const appThemeLight = useSelector(selectAppThemeLight)
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
  }, [dispatch])

  return (
    <div className={`w-screen h-screen overflow-hidden ${appThemeLight ? '' : 'dark'}`}>
      <Head>
        <title>Fega</title>
        <meta name="description" content="Fega web" />
        <link rel="icon" href="/fega_round_1.ico" />
      </Head>

      <Header/>

      <main className="flex bg-gray-200 dark:bg-gray-900">
        {/** Right Sidebar */}

        {/** Posts */}
        <div className="flex-grow h-screen lg:flex overflow-y-auto lg:overflow-y-hidden scrollbar-hide"> 
          <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl px-5">
                <CreatePost/>
          </div> 
          <div className="flex-grow pb-64 lg:overflow-y-auto scrollbar-hide">
              {posts && <Posts posts={JSON.parse(posts)}/>}
          </div>
          <div className="invisible lg:visible lg:h-screen lg:w-2/12 lg:px-5 lg:mt-5">
            <LeftSidebarMenu/>
          </div>
        </div>
      </main>

      {/** Bottom navigation (mobile) */}
      <BottomNav/>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("http://localhost:3000/api/posts/initialPosts")
  const data = await res.json()

  return {
    props: {
      posts: data.posts,
    }
  }
}

/*
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