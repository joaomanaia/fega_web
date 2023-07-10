import CameraType from "@/types/CameraType"
import { NextResponse } from "next/server"

const cameras: CameraType[] = [
  {
    id: "figueiradafoz-panoramica",
    link: "https://video-auth1.iol.pt/beachcam/figueiradafoz/playlist.m3u8",
    name: "Figueira da Foz - Panoramica",
    description: "Camera panoramica localizada na figueira da foz",
    video: true,
    imagePoster:
      "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/cameras%2Ffigueiradafoz-panoramica.jpeg?alt=media&token=a4cae7d0-111e-4e33-a70f-329091a9fb38",
  },
  {
    id: "figueiradafoz-buarcos",
    link: "https://video-auth1.iol.pt/beachcam/bcfigueiradois/playlist.m3u8",
    name: "Figueira da Foz - Buarcos",
    description: "Camera localizada em buarcos, figueira da foz",
    video: true,
    imagePoster:
      "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/cameras%2Ffigueiradafoz-panoramica.jpeg?alt=media&token=a4cae7d0-111e-4e33-a70f-329091a9fb38",
  },
  {
    id: "figueiradafoz-cabedelo",
    link: "https://video-auth1.iol.pt/beachcam/bcfigueiracabeledo/playlist.m3u8",
    name: "Figueira da Foz - Cabedelo",
    description: "Camera localizada no cabedelo, figueira da foz",
    video: true,
    imagePoster:
      "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/cameras%2Fpraia-do-cabedelo.jpg?alt=media&token=bab5119b-ce3f-43e9-8641-ba214211d509",
  },
  {
    id: "hoteloslo-coimbra",
    link: "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG",
    name: "Coimbra",
    description: "Camera localizada no hotel oslo, Coimbra",
    video: false,
    imagePoster:
      "https://firebasestorage.googleapis.com/v0/b/fega-app.appspot.com/o/cameras%2Fhoteloslo.jpeg?alt=media&token=4669d450-0861-4aa0-b98c-7bc4857acc10",
  },
]

export async function GET() {
  return NextResponse.json(cameras)
}
