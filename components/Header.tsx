import React from 'react'
import { auth } from '../firebase'

function Header() {
    return (
        <div className="sticky top-0 z-50 flex h-16 w-full bg-red-700 items-center">
            <div className="flex items-center flex-grow ml-8">
                <p className="text-3xl text-white">Fega</p>
            </div>
            <div className="flex items-center justify-end mr-8">
                <img 
                    onClick={() => auth.signOut()}
                    className="w-10 rounded-full cursor-pointer"
                    alt={auth.currentUser?.displayName || "Profile Photo"}
                    src={auth.currentUser?.photoURL || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb"}/>
            </div>
        </div>
    )
}

export default Header
