import React, { useState } from 'react'
import { auth } from '../../firebase'
import DropdownMenu from './dropdown/DropdownMenu'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import en from '../../locales/en'
import pt from '../../locales/pt'
import { VideoCameraIcon } from "@heroicons/react/solid"

function Header() {

    const [menuOpen, setMenuOpen] = useState(false)

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    const isLoggedIn = auth.currentUser !== null

    return (
        <div>
            <header className="sticky top-0 z-50 flex h-16 w-full bg-red-700 dark:bg-gray-800 items-center">
                <div className="flex items-center grow ml-8">
                    <p
                        className="text-3xl text-white cursor-pointer">
                        <Link href="/">
                            {t.appName}
                        </Link>
                    </p>
                </div>
                <div className="flex items-center justify-end mr-8 space-x-8">
                    <div 
                        onClick={() => router.push('/cameras')}
                        className="bg-red-800 hover:bg-red-500 dark:bg-gray-700 dark:hover:bg-red-700 w-12 items-center justify-center p-3 rounded-2xl cursor-pointer">
                        <VideoCameraIcon className="text-white" />
                    </div>

                    <div className="h-10 w-10 relative">
                        <Image 
                            onClick={() => {
                                if (isLoggedIn) {
                                    setMenuOpen(!menuOpen)
                                } else {
                                    router.push("/auth")
                                }
                            }}
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
