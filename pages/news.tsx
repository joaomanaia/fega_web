import { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from "../app/appSlice"
import BottomNav from "../components/bottomNavigation/BottomNav"
import Header from "../components/header/Header"
import LeftSidebarMenu from "../components/leftSidebar/LeftSidebarMenu"
import NewsItem, { NewsItemType } from "../components/news/NewsItem"

const News: NextPage = () => {

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    const [news, setNews] = useState<NewsItemType[]>([
        {
            id: "0",
            title: "Novo Ano 2022",
            description: "Novo ano e muitas novidades em breve no Fega. Um feliz novo ano 2022 para todos.",
            mainImage: "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/news%2Fhappy-new-year-2022-banner-template-vector.webp?alt=media&token=ccaa2187-7fe6-44cc-9ebd-8626871325e6"
        }
    ])

    return(
        <div className={`w-screen h-screen overflow-hidden ${appThemeLight ? '' : 'dark'}`}>
            <Head>
                <title>Fega</title>
                <meta name="description" content="Fega web" />
                <link rel="icon" href="/fega_round_1.ico" />
            </Head>

            <Header/>

            <main className="flex bg-gray-200 dark:bg-gray-900 h-screen w-screen">
                <div className="flex-grow lg:mx-32 items-center justify-center pb-64 lg:overflow-y-auto scrollbar-hide space-y-4 mx-4 mt-4 w-full">
                    {news.map(item => (
                        <NewsItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            mainImage={item.mainImage}
                            description={item.description}/>
                    ))}
                </div>
                <div className="invisible lg:visible w-0 lg:h-screen lg:w-2/12 lg:px-5 lg:mt-5">
                    <LeftSidebarMenu/>
                </div>
            </main>

            {/** Bottom navigation (mobile) */}
            <BottomNav/>
        </div>
    )
}

export default News