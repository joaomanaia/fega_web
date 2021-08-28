import admin from 'firebase-admin'

if(!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.ADMIN_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            projectId: process.env.ADMIN_FIREBASE_PROJECT_ID
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    })
}

const firestoreAdmin = admin.firestore()

export { firestoreAdmin }