import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from "../app/appSlice";
import Header from "../components/header/Header";
import UserType from "../components/user/UserType";
import { firestoreAdmin } from "../firebase-admin";

type UserPageType = {
    user: string
}

const UserPage: NextPage<UserPageType> = ({user}) => {

    const [videoState, setVideoState] = useState(false)

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    const userFormatted: UserType = JSON.parse(user)

    console.log(user)

    return(
        <div className={`w-screen h-screen overflow-hidden ${appThemeLight ? '' : 'dark'}`}>
            <Head>
                <title>User</title>
            </Head>
        </div>
    )
}

export default UserPage

export const getServerSideProps: GetServerSideProps = async (context) => {
    const uid = context.params?.uid

    if (typeof uid !== "string") {
        return {
            props: {
                user: ""
            }
        }
    }

    const userDoc = await firestoreAdmin.collection("users").doc(uid).get()

    const user: UserType = {
        uid: userDoc.data()?.uid,
        name: userDoc.data()?.name,
        photoUrl: userDoc.data()?.photoUrl,
        banned: userDoc.data()?.banned,
    }

    return { 
        props: {
            user: JSON.stringify(user)
        }
    }
}