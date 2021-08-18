import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCbQNn_YTWEIL5WJFQWUbyhlG5MrGKu7J0",
    authDomain: "fega-app.firebaseapp.com",
    databaseURL: "https://fega-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fega-app",
    storageBucket: "fega-app.appspot.com",
    messagingSenderId: "861331308734",
    appId: "1:861331308734:web:4209fd8b9d133c94039eef",
    measurementId: "G-0WZ017FHHK"
}

let app

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app()
}

const auth = firebase.auth()
const firestore = app.firestore()

export { auth, firestore }

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    //signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
}

export { uiConfig }