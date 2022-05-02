import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { selectAppThemeLight, setAppThemeLight, setAppThemeNight } from "../app/appSlice";
import Header from "../components/header/Header"
import Image from 'next/image'

type UserPageType = {}

type CameraType = {
    link: string
    name: string
    video: boolean
}

const cameras: CameraType[] = [
    {
        link: "https://video-auth1.iol.pt/beachcam/figueiradafoz/playlist.m3u8",
        name: "Figueira da Foz - Panoramica",
        video: true
    },
    {
        link: "https://video-auth1.iol.pt/beachcam/bcfigueiradois/playlist.m3u8",
        name: "Figueira da Foz - Burarcos",
        video: true
    },
    {
        link: "https://video-auth1.iol.pt/beachcam/arrifana/playlist.m3u8",
        name: "Arrifana",
        video: true
    },
    {
        link: "https://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG",
        name: "Coimbra",
        video: false
    }
]

const UserPage: NextPage<UserPageType> = () => {

    const [videoState, setVideoState] = useState(false)

    const [selectCameraPopupVisible, setSelectCameraPopupVisibility] = useState(false)
    const [selectedCamera, setSelectedCamera] = useState<CameraType>(cameras[0])
    const [cameraImageUrl, setCameraImageUrl] = useState<string>("https://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG")

    const appThemeLight = useSelector(selectAppThemeLight)
    const dispatch = useDispatch()

    useEffect(() => {
        localStorage.getItem("theme") === 'light' ? dispatch(setAppThemeLight()) : dispatch(setAppThemeNight())
    }, [dispatch])

    useEffect(() => {
        const intervalId = setInterval(() => {
            const url = "https://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG?d=" + new Date().getTime()
            setCameraImageUrl(url)
        }, 1000)

        return clearInterval(intervalId)
    }, [])

    return (
        <div className={`w-screen h-screen overflow-hidden ${appThemeLight ? '' : 'dark'}`}>
            <Head>
                <title>{selectedCamera.name}</title>
            </Head>

            <div className="w-screen h-full bg-gray-100 dark:bg-gray-900">
                <Header />

                <div className="h-full flex flex-col">
                    <div
                        onClick={() => setSelectCameraPopupVisibility(!selectCameraPopupVisible)}
                        className="py-2 mx-4 px-4 bg-gray-800 hover:bg-gray-700 m-2 w-64 rounded-2xl cursor-pointer">
                        <p className="text-gray-300">
                            {selectedCamera.name}
                        </p>
                    </div>

                    {selectCameraPopupVisible && (
                        <div className="z-50 absolute mx-4 shadow-lg p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 w-72 mt-14">
                            {cameras.map(camera => (
                                <div
                                    className="h-12 flex items-center rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                    key={camera.link}
                                    onClick={() => {
                                        setSelectCameraPopupVisibility(false)
                                        setSelectedCamera(camera)
                                    }}>
                                    <p className="text-white text-lg mx-4">
                                        {camera.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedCamera.video ? (
                        <div className="h-full pb-32 pt-4">
                            <ReactPlayer
                                volume={0}
                                muted={true}
                                playing={videoState}
                                onReady={() => {
                                    setVideoState(true)
                                }}
                                controls={true}
                                width="100%"
                                height="100%"
                                url={selectedCamera.link} />
                        </div>
                    ) : (
                        <div className="h-full pb-32 pt-4">
                            <img
                                src={cameraImageUrl}
                                alt={selectedCamera.name}
                                className="w-full h-full"/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserPage