import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/firebaseui-styling.global.css'
import Auth from './auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { analytics, app, auth, firestore } from '../firebase'
import Loading from './loading'
import { useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'

function MyApp({ Component, pageProps }: AppProps) {
  // Destructure user, loading, and error out of the hook.
  const [authUser, loadingAuth, errorAuth] = useAuthState(auth)

  const routers = useRouter()

  useEffect(() => {
    app.analytics()
    app.performance()
    const appCheck = app.appCheck()
    appCheck.activate("6Ld3sg8cAAAAAG87yUa03kZIYSarmr7EFvnjivK7", true)
    const logEvent = (url: string) => {
      app.analytics().setCurrentScreen(url)
      app.analytics().logEvent("screen_view")
    }

    routers.events.on('routeChangeComplete', logEvent)
    // For First page
    logEvent(window.location.pathname)

    return () => {
      routers.events.off('routeChangeComplete', logEvent)
    }
  }, [])

  if(loadingAuth) return <Loading/>
  if(!authUser) return <Auth/>
  if(errorAuth) return <p>{errorAuth.message}</p>

  if(authUser) {
    firestore.collection("users").doc(authUser.uid).get().then(doc => {
      if(doc?.data()?.banned === true) return <p>Você está banido!</p>

      if(!doc?.exists) {
        firestore.collection("users").doc(authUser?.uid).set({
          admin: false,
          banned: false,
          name: authUser?.displayName,
          photoUrl: authUser?.photoURL,
          uid: authUser?.uid,
        })
      }
    }).catch(err => {
      return <p>{err.message}</p>
    })
  }

  return <Component {...pageProps} />
}

export default MyApp
