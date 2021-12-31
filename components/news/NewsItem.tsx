import Image from "next/image"

export type NewsItemType = {
    id: string,
    title: string,
    description: string,
    mainImage: string,
}

const NewsItem: React.FC<NewsItemType> = ({title, description, mainImage}) => {
    return(
        <div className="relative group bg-white dark:bg-gray-800 rounded-2xl aspect-video">
            <div className="absolute flex-col  bg-white/50 group-hover:bg-white/95 dark:bg-gray-800/50 dark:group-hover:bg-gray-800/95 z-10 rounded-2xl left-0 bottom-0 right-0 p-2">
                <p className="dark:text-white text-2xl">
                    {title}
                </p>

                <p className="dark:text-white text-xl mt-2">
                    {description}
                </p>
            </div>            
            <div className="relative z-0 w-full h-full bg-local justify-bottom">
                <Image
                    className="rounded-2xl"
                    src={mainImage}
                    layout="fill"
                    alt={title}/>
            </div>
        </div>
    )
}

export default NewsItem