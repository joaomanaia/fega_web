import { doc, getDoc } from "firebase/firestore"
import { firestore } from "../../firebase"
import { useState, useEffect } from 'react'

type PostParams = {
    id: string,
    uid: string,
    description: string,
    images: string[] | undefined,
    timestamp: string
}

type User = {
    name: string,
    photoUrl: string
}

function Post({uid, description, images, timestamp}: PostParams) {

    const [user, setUser] = useState<User | undefined>(undefined)

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = async () => {
        const userRef = doc(firestore, 'users', uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
            setUser({
                name: userSnap.data().name,
                photoUrl: userSnap.data().photoUrl,
            })
        }
    }

    return (
        <div className="flex flex-col">
            <div className="p-5 bg-white dark:bg-gray-800 mt-5 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                    <img
                        className="rounded-full w-10"
                        alt={user?.name}
                        src={user?.photoUrl || "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/user_default_image.png?alt=media&token=7f18e231-8446-4499-9935-63209fa686cb"}/>
            
                    <div>
                        <p className="font-medium dark:text-white">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white">
                            {timestamp}
                        </p>
                    </div>
                </div>

                <p className="pt-4 dark:text-white">
                    {description}
                </p>

                <div className={`flex gap-2`}>
                    {images?.map(image => (
                        <img
                            className={`rounded-2xl mt-4 h-32 md:h-64 w-full ${images.length > 1 && "w-1/2"}`}
                            key={image}
                            src={image} 
                            alt="Publication Image"/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Post
