import React, { useState } from 'react'
import { auth } from '../../firebase'
import DropdownMenu from './dropdown/DropdownMenu'
import Image from 'next/image'

function Header() {

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div>
            <header className="sticky top-0 z-50 flex h-16 w-full bg-red-700 dark:bg-gray-800 items-center">
                <div className="flex items-center flex-grow ml-8">
                    <p className="text-3xl text-white cursor-pointer">Fega</p>
                </div>
                <div className="flex items-center justify-end mr-8">
                    <div className="h-10 w-10 relative">
                        <Image 
                            onClick={() => setMenuOpen(!menuOpen)}
                            layout="fill"
                            className="rounded-full cursor-pointer"
                            alt={auth.currentUser?.displayName || "Profile Photo"}
                            src={auth.currentUser?.photoURL || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb"}/>
                    </div>
                </div>
            </header>

            <div className="flex justify-end">
                {menuOpen && <DropdownMenu isOpen={menuOpen}/>}
            </div>
        </div>
    )
}

export default Header
