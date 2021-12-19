import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from "../../app/appSlice"
import Post from "../../components/post/Post";
import { PostType } from "../../components/post/Posts";
import { firestoreAdmin } from "../../firebase-admin";

const PostPage: NextPage = ({post}: any) => {

    const mPost = JSON.parse(post)

    const appThemeLight = useSelector(selectAppThemeLight)

    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    console.log(post)

    return(
        <div className={`${appThemeLight ? '' : 'dark'}`}>

            <Head>
                <title>
                    {post ? mPost.data.description : "Post Not Found"}
                </title>
                <meta name="description" content="Fega web" />
                <link rel="icon" href="/fega_round_1.ico" />
            </Head>

            <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-900">
                {post ? (
                    <Post
                        key={mPost.id}
                        id={mPost.id}
                        uid={mPost.uid}
                        description={mPost.data.description}
                        images={mPost.data.images}
                        timestamp={mPost.timestamp}/>
                ) : (
                    <p className="text-gray-500 dark:text-white text-3xl">
                        Post Not Found
                    </p>
                )}
            </div>
        </div>
    )
}

export default PostPage

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id
    if (typeof id !== 'string') {
        return {
            props: {
                post: null
            }
        }
    }

    const post = await firestoreAdmin.collection("publications").doc(id).get()

    if (!post.exists) {
        return {
            props: {
                post: null
            }
        }
    }

    let postFormatted: PostType = {
        id: post.id,
        uid: post.data()?.uid,
        timestamp: post.data()?.timestamp.toDate(),
        data: {
          description: post.data()?.data.description,
          images: post.data()?.data.images,
        }
    }
        
    return {
      props: {
        post: JSON.stringify(postFormatted)
      }
    }
}