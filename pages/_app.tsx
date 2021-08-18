import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/firebaseui-styling.global.css'
import Auth from './auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore' 
import { auth, firestore } from '../firebase'
import Loading from './loading'

function MyApp({ Component, pageProps }: AppProps) {
  // Destructure user, loading, and error out of the hook.
  const [authUser, loadingAuth, errorAuth] = useAuthState(auth)
  const [userDB, loadingUserDB, errorUserDB] = useDocument(firestore.collection("users").doc(authUser?.uid))

  if(loadingAuth) return <Loading/>
  if(!authUser) return <Auth/>

  if(loadingUserDB) return <Loading/>
  if(!userDB?.exists) {
    firestore.collection("users").doc(authUser?.uid).set({
      admin: false,
      banned: false,
      name: authUser?.displayName,
      photoUrl: authUser?.photoURL,
      uid: authUser?.uid,
    })
    return <Loading/>
  }
  if(userDB?.data()?.banned === true) return <p>Você está banido!</p>

  return <Component {...pageProps} />
}

export default MyApp
