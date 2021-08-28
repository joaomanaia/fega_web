import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/performance'
import 'firebase/app-check'

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

let app: firebase.app.App

const newApp = firebase.apps.length === 0

if (newApp) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app()
}

const auth = app.auth()
const firestore = app.firestore()
const analytics = app.analytics
const performance = app.performance
const appCheck = app.appCheck

/*
if(newApp) {
    auth.useEmulator("http://localhost:9099")
    firestore.useEmulator("localhost", 8080);
}
*/

export { app, auth, firestore, analytics, performance, appCheck }

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    //signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
}

export { uiConfig }