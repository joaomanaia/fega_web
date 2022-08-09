import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import UserType from "../types/UserType"
import { firestoreAdmin } from "../firebase-admin"

type UserPageType = {
  user: string
}

const UserPage: NextPage<UserPageType> = ({ user }) => {
  const userFormatted: UserType = JSON.parse(user)

  return (
    <div className="w-screen h-screen overflow-hidden">
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
        user: "",
      },
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
      user: JSON.stringify(user),
    },
  }
}
