import type { NextPage } from 'next'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth, uiConfig } from '../firebase'
import Head from 'next/head'

const Auth: NextPage = () => {
    return(
        <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-red-700">
             <Head>
                <title>Login</title>
                <meta name="description" content="Fega web" />
                <link rel="icon" href="/fega_round_1.ico" />
            </Head>

             <div className="h-full w-1/2 bg-red-700 flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-center mb-4">
                    Welcome to Fega
                </p>
                <div className="h-2 w-20 md:w-32 bg-white mt-2 mb-16 rounded-full"/>
                <p className="text-lg text-white text-md md:text-xl">
                    Best social network in ega!
                </p>
            </div>
            
            <div className="h-full w-full md:w-1/2 bg-white rounded-t-3xl md:rounded-none md:rounded-l-3xl flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-700 mb-4">
                    Signin
                </p>
                <div className="h-2 w-16 bg-red-700 mt-2 mb-4 md:mb-16 rounded-full"/>
                <StyledFirebaseAuth 
                    uiConfig={uiConfig}
                    firebaseAuth={auth}/>
            </div>
        </div>
    )
}

export default Auth