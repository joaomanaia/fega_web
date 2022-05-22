import React, { useState } from 'react'
import { auth } from '../../firebase'
import DropdownMenu from './dropdown/DropdownMenu'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import en from '../../locales/en'
import pt from '../../locales/pt'
import { VideoCameraIcon } from "@heroicons/react/solid"
import Surface from '../material/surface/Surface'

function Header() {

    const [menuOpen, setMenuOpen] = useState(false)

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    const isLoggedIn = auth.currentUser !== null

    return (
        <header>
            <Surface 
                elevation={5}
                className="sticky top-0 z-50 flex h-16 w-full items-center">
                <div className="flex items-center grow ml-8">
                    <p
                        className="text-3xl text-onSurface-light dark:text-onSurface-dark cursor-pointer">
                        <Link href="/">
                            {t.appName}
                        </Link>
                    </p>
                </div>
                <div className="flex items-center justify-end mr-8 space-x-8">
                    <Surface 
                        onClick={() => router.push('/cameras')}
                        shadowDisabled
                        elevation={3}
                        className="w-12 items-center justify-center p-3 rounded-2xl cursor-pointer">
                        <VideoCameraIcon className="text-white" />
                    </Surface>

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
            </Surface>

            <div className="flex justify-end">
                {menuOpen && <DropdownMenu isOpen={menuOpen}/>}
            </div>
        </header>
    )
}

export default Header
