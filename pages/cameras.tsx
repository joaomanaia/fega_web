/* eslint-disable @next/next/no-img-element */
import { Button, Menu, MenuItem, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import RootLayout from "../components/layout/root-layout"

type CameraType = {
  id: string
  link: string
  name: string
  description: string
  video: boolean
  imagePoster: string
}

type UserPageType = {
  selectedCamera: CameraType
}

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
    description: "Camera localizada no hotel oslo, Coimbra",
    video: false,
    imagePoster: "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG",
  },
]

const getCameraById = (id: string): CameraType | null => {
  return cameras.find((camera) => camera.id === id) || null
}

const UserPage: NextPage<UserPageType> = ({ selectedCamera }) => {
  const router = useRouter()

  const [videoState, setVideoState] = useState(false)

  const [cameraImageUrl, setCameraImageUrl] = useState<string>(
    getCameraById("hoteloslo-coimbra")?.link || ""
  )

  const [anchorCamerasButton, setAnchorCamerasButton] = useState<null | HTMLElement>(null)
  const openCamerasPopup = Boolean(anchorCamerasButton)

  const handleCamerasButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorCamerasButton(event.currentTarget)
  }
  const handleCamerasPopupClose = () => {
    setAnchorCamerasButton(null)
  }

  useEffect(() => {
    if (selectedCamera.id == "hoteloslo-coimbra") {
      const cameraUrl = getCameraById("hoteloslo-coimbra")?.link

      if (cameraUrl === undefined) return () => {}

      const intervalId = setInterval(() => {
        const url = cameraUrl + "?date=" + new Date().getTime()
        setCameraImageUrl(url)
      }, 500)

      return () => clearInterval(intervalId)
    }

    return () => {}
  }, [selectedCamera.id])

  return (
    <RootLayout>
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
        <meta property="twitter:url" content={`https://fega.ml${router.asPath}`} />
        <meta name="twitter:title" content={selectedCamera.name} />
        <meta name="twitter:description" content={selectedCamera.description} />
        {selectedCamera.video ? (
          <meta property="twitter:image" content={selectedCamera.imagePoster} />
        ) : (
          <meta property="twitter:image" content={cameraImageUrl} />
        )}
      </Head>

      <div itemScope itemType="https://schema.org/Place" className="w-full h-full">
        <link itemProp="additionalType" href="https://schema.org/TouristAttraction" />
        <meta itemProp="description" content={selectedCamera.description} />

        <Typography variant="h4" gutterBottom>
          {selectedCamera.name}
        </Typography>

        <Typography variant="body1" paddingBottom={4}>{selectedCamera.description}</Typography>

        <Button
          id="cameras-button"
          variant="contained"
          aria-controls={openCamerasPopup ? "cameras-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openCamerasPopup ? "true" : undefined}
          onClick={handleCamerasButtonClick}
        >
          Escolher camera
        </Button>

        <Menu
          id="cameras-menu"
          anchorEl={anchorCamerasButton}
          open={openCamerasPopup}
          onClose={handleCamerasPopupClose}
          MenuListProps={{ "aria-labelledby": "cameras-button" }}
        >
          {cameras.map((camera) => (
            <MenuItem
              key={camera.link}
              onClick={() => {
                handleCamerasPopupClose()
                router.push(`/cameras?id=${camera.id}`)
              }}
            >
              {camera.name}
            </MenuItem>
          ))}
        </Menu>

        <div className="w-full h-full flex flex-col md:flex-row">
          {selectedCamera.video ? (
            <div
              itemScope
              itemType="https://schema.org/VideoObject"
              className="h-full w-full pb-32"
            >
              <meta itemProp="name" content={selectedCamera.name} />
              <meta itemProp="description" content={selectedCamera.description} />
              <meta itemProp="thumbnailUrl" content={selectedCamera.imagePoster} />
              <meta itemProp="uploadDate" content="07/05/2022" />
              <meta itemProp="contentUrl" content={selectedCamera.link} />

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
                url={selectedCamera.link}
              />
            </div>
          ) : (
            <div itemScope itemType="https://schema.org/VideoObject" className="h-full w-full pb-32 pt-8">
              <meta itemProp="name" content={selectedCamera.name} />
              <meta itemProp="description" content={selectedCamera.description} />
              <meta itemProp="thumbnailUrl" content={selectedCamera.imagePoster} />
              <meta itemProp="uploadDate" content="07/05/2022" />
              <meta itemProp="contentUrl" content={selectedCamera.link} />

              <img src={cameraImageUrl} alt={selectedCamera.name} className="w-full h-full" />
            </div>
          )}

          <div className="md:h-screen flex items-center justify-center"></div>
        </div>
      </div>
    </RootLayout>
  )
}

export default UserPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id

  const camera = cameras.filter((camera) => camera.id === id)[0] || cameras[0]

  return {
    props: {
      selectedCamera: camera,
    },
  }
}
