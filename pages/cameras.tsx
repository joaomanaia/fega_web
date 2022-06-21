/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAppThemeLight,
  setAppThemeLight,
  setAppThemeNight,
} from "../app/appSlice";
import Header from "../components/header/Header";

type CameraType = {
  id: string;
  link: string;
  name: string;
  description: string;
  video: boolean;
  imagePoster: string;
};

type UserPageType = {
  selectedCamera: CameraType;
};

const cameras: CameraType[] = [
  {
    id: "figueiradafoz-panoramica",
    link: "https://video-auth1.iol.pt/beachcam/figueiradafoz/playlist.m3u8",
    name: "Figueira da Foz - Panoramica",
    description: "Camera panoramica localizada na figueira da foz",
    video: true,
    imagePoster:
      "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTc-VKCG56MkcaKgQVbQ3VKjHAeBh1pa8ORrBOowL27KyHeOnwKH8k6flxE8szc",
  },
  {
    id: "figueiradafoz-buarcos",
    link: "https://video-auth1.iol.pt/beachcam/bcfigueiradois/playlist.m3u8",
    name: "Figueira da Foz - Buarcos",
    description: "Camera localizada em burarcos, figueira da foz",
    video: true,
    imagePoster:
      "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTc-VKCG56MkcaKgQVbQ3VKjHAeBh1pa8ORrBOowL27KyHeOnwKH8k6flxE8szc",
  },
  {
    id: "hoteloslo-coimbra",
    link: "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG",
    name: "Coimbra",
    description: "Camera localizada no hotel Hoteloslo, Coimbra",
    video: false,
    imagePoster: "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG",
  },
];

const getCameraById = (id: string): CameraType | null => {
  return cameras.find((camera) => camera.id === id) || null;
};

const UserPage: NextPage<UserPageType> = ({ selectedCamera }) => {
  const router = useRouter();

  const [videoState, setVideoState] = useState(false);

  const [selectCameraPopupVisible, setSelectCameraPopupVisibility] =
    useState(false);
  const [cameraImageUrl, setCameraImageUrl] = useState<string>(
    getCameraById("hoteloslo-coimbra")?.link || ""
  );

  const appThemeLight = useSelector(selectAppThemeLight);
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.getItem("theme") === "light"
      ? dispatch(setAppThemeLight())
      : dispatch(setAppThemeNight());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCamera.id == "hoteloslo-coimbra") {
      const cameraUrl = getCameraById("hoteloslo-coimbra")?.link;

      if (cameraUrl === undefined) return () => {};

      const intervalId = setInterval(() => {
        const url = cameraUrl + "?date=" + new Date().getTime();
        setCameraImageUrl(url);
      }, 500);

      return () => clearInterval(intervalId);
    }

    return () => {};
  }, [selectedCamera.id]);

  return (
    <div
      className={`w-screen h-screen overflow-hidden ${
        appThemeLight ? "" : "dark"
      }`}
    >
      <Head>
        <title>{selectedCamera.name}</title>
        <meta name="description" content={selectedCamera.description} />

        {/**  Facebook Meta Tags */}
        <meta property="og:url" content={`https://fega.ml${router.asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={selectedCamera.name} />
        <meta property="og:description" content={selectedCamera.description} />
        {selectedCamera.video ? (
          <meta property="og:image" content={selectedCamera.imagePoster} />
        ) : (
          <meta property="og:image" content={cameraImageUrl} />
        )}

        {/**  Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="fega.ml" />
        <meta
          property="twitter:url"
          content={`https://fega.ml${router.asPath}`}
        />
        <meta name="twitter:title" content={selectedCamera.name} />
        <meta name="twitter:description" content={selectedCamera.description} />
        {selectedCamera.video ? (
          <meta property="twitter:image" content={selectedCamera.imagePoster} />
        ) : (
          <meta property="twitter:image" content={cameraImageUrl} />
        )}
      </Head>

      <div
        itemScope
        itemType="https://schema.org/Place"
        className="w-screen h-full bg-gray-100 dark:bg-gray-900"
      >
        <Header />

        <link
          itemProp="additionalType"
          href="https://schema.org/TouristAttraction"
        />
        <meta itemProp="description" content={selectedCamera.description} />

        <div className="h-full flex flex-col">
          <div
            onClick={() =>
              setSelectCameraPopupVisibility(!selectCameraPopupVisible)
            }
            className="py-2 mx-4 px-4 bg-gray-800 hover:bg-gray-700 m-2 w-64 rounded-2xl cursor-pointer"
          >
            <p itemProp="name" className="text-gray-300">
              {selectedCamera.name}
            </p>
          </div>

          {selectCameraPopupVisible && (
            <div className="z-50 absolute mx-4 shadow-lg p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 w-72 mt-14">
              {cameras.map((camera) => (
                <div
                  className="h-12 flex items-center rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                  key={camera.link}
                  onClick={() => {
                    setSelectCameraPopupVisibility(false);
                    router.push(`/cameras?id=${camera.id}`);
                  }}
                >
                  <p className="text-white text-lg mx-4">{camera.name}</p>
                </div>
              ))}
            </div>
          )}

          <div className="w-full h-full flex flex-col md:flex-row">
            {selectedCamera.video ? (
              <div
                itemScope
                itemType="https://schema.org/VideoObject"
                className="h-full w-full pb-32 pt-4"
              >
                <meta itemProp="name" content={selectedCamera.name} />
                <meta
                  itemProp="description"
                  content={selectedCamera.description}
                />
                <meta
                  itemProp="thumbnailUrl"
                  content={selectedCamera.imagePoster}
                />
                <meta itemProp="uploadDate" content="07/05/2022" />
                <meta itemProp="contentUrl" content={selectedCamera.link} />

                <ReactPlayer
                  volume={0}
                  muted={true}
                  playing={videoState}
                  onReady={() => {
                    setVideoState(true);
                  }}
                  controls={true}
                  width="100%"
                  height="100%"
                  url={selectedCamera.link}
                />
              </div>
            ) : (
              <div
                itemScope
                itemType="https://schema.org/VideoObject"
                className="h-full pb-32 pt-4"
              >
                <meta itemProp="name" content={selectedCamera.name} />
                <meta
                  itemProp="description"
                  content={selectedCamera.description}
                />
                <meta
                  itemProp="thumbnailUrl"
                  content={selectedCamera.imagePoster}
                />
                <meta itemProp="uploadDate" content="07/05/2022" />
                <meta itemProp="contentUrl" content={selectedCamera.link} />

                <img
                  src={cameraImageUrl}
                  alt={selectedCamera.name}
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="md:h-screen flex items-center justify-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  const camera = cameras.filter((camera) => camera.id === id)[0] || cameras[0];

  return {
    props: {
      selectedCamera: camera,
    },
  };
};
