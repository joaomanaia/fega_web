import { initializeApp, getApps } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, EmailAuthProvider, FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth'
import { FirebaseApp } from '@firebase/app'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

/*
const newApp = firebase.apps.length === 0

if (newApp) {
    initializeApp(firebaseConfig)
}
*/

let app: FirebaseApp
let appArray = getApps()
if (!appArray.length) {
    app = initializeApp(firebaseConfig)
} else {
    app = appArray[0]
}

const auth = getAuth()
const firestore = getFirestore()
const database = getDatabase()

//connectAuthEmulator(auth, 'http://localhost:9099')
//connectFirestoreEmulator(firestore, 'localhost', 8080)
//connectDatabaseEmulator(database, "localhost", 9000)

export { app, auth, firestore, database }

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    //signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID
    ],
}

export { uiConfig }