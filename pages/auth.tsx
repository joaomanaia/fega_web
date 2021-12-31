import type { NextPage } from 'next'
import StyledFirebaseAuth from  "react-firebaseui/StyledFirebaseAuth"
import { auth, uiConfig } from '../firebase'
import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from '../app/appSlice'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import pt from '../locales/pt'
import en from '../locales/en'

const Auth: NextPage = () => {

    const appThemeLight = useSelector(selectAppThemeLight)

    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    return(
        <div className={`${appThemeLight ? '' : 'dark'}`}>
            <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-red-700 dark:bg-gray-900">
                <Head>
                    <title>Login</title>
                    <meta name="description" content="Fega web" />
                    <link rel="icon" href="/fega_round_1.ico" />
                </Head>

                <div className="h-full w-1/2 flex flex-col items-center justify-center">
                    <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-center mb-4">
                        {t.welcome_to_fega}
                    </p>
                    <div className="h-2 w-20 md:w-32 bg-white dark:bg-red-700 mt-2 mb-16 rounded-full"/>
                    <p className="text-lg text-white text-md md:text-xl">
                        {t.best_social_network_in_ega}
                    </p>
                </div>
                
                <div className="h-full w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-none md:rounded-l-3xl flex flex-col items-center justify-center">
                    <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-700 dark:text-white mb-4">
                        {t.sign_in}
                    </p>
                    <div className="h-2 w-16 bg-red-700 mt-2 mb-4 md:mb-16 rounded-full"/>
                    <StyledFirebaseAuth 
                        uiConfig={uiConfig}
                        firebaseAuth={auth}/>
                </div>
            </div>
        </div> 
    )
}

export default Auth