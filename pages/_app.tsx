import type { AppProps } from 'next/app'
import Auth from './auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { analytics, app, auth, firestore } from '../firebase'
import Loading from './loading'
import { useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { getAnalytics, logEvent, setCurrentScreen } from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'
import { initializeAppCheck, ReCaptchaV3Provider  } from 'firebase/app-check'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import '../styles/globals.css'
import '../styles/firebaseui-styling.global.css'

function MyApp({ Component, pageProps }: AppProps) {
  // Destructure user, loading, and error out of the hook.
  const [authUser, loadingAuth, errorAuth] = useAuthState(auth)

  const routers = useRouter()

  useEffect(() => {
    const analytics = getAnalytics(app)
    getPerformance(app)
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6Ld3sg8cAAAAAG87yUa03kZIYSarmr7EFvnjivK7'),
      isTokenAutoRefreshEnabled: true
    })

    const logEventPage = (url: string) => {
      logEvent(analytics, 'screen_view')
      setCurrentScreen(analytics, url)
    }

    routers.events.on('routeChangeComplete', logEventPage)
    // For First page
    logEventPage(window.location.pathname)

    return () => {
      routers.events.off('routeChangeComplete', logEventPage)
    }
  }, [routers.events])
    
  const loadDBUser = async () => {
    if (authUser !== null && authUser !== undefined) {
      const userRef = doc(firestore, 'users', authUser.uid)
      const userSnap = await getDoc(userRef)
  
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          banned: false,
          name: authUser?.displayName || "Fega User",
          photoUrl: authUser?.photoURL || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb",
          uid: authUser?.uid
        })
      }
    }
  }

  loadDBUser()

  if(loadingAuth) return <Loading/>
  if(!authUser) return <Provider store={store}><Auth/></Provider>
  if(errorAuth) return <p>{errorAuth.message}</p>

  return <Provider store={store}><Component {...pageProps} /></Provider>
}

export default MyApp