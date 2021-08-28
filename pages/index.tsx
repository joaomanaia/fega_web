import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAppThemeLight } from '../app/appSlice'
import Header from '../components/header/Header'
import CreatePost from '../components/post/CreatePost'
import Posts, { PostType } from '../components/post/Posts'
import { setAppThemeLight, setAppThemeNight } from '../app/appSlice'
import { firestore } from '../firebase'
import firebase from "firebase"
import { firestoreAdmin } from '../firebase-admin'

const Home: NextPage = ({posts}: any) => {

  const appThemeLight = useSelector(selectAppThemeLight)
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
  }, [])

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
          <div className="flex-grow pb-64 xl:mr-40 lg:overflow-y-auto scrollbar-hide">
              <Posts posts={JSON.parse(posts)}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

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