import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    res.setHeader("Content-Type", "image/jpeg")

    const reqDate = req.query["date"]?.toString()

    const date = parseInt(reqDate) || new Date().getTime()

    const imageBuffer = await getImageBuffer(date)
    res.status(200).send(imageBuffer)
}

const getImageBuffer = async (dateRes: number) => {
    const date = dateRes || new Date().getTime()
    
    const hotelosloData = await fetch(
        "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG?d=" + date,
        {
            method: "GET"
        }
    )

    const hotelosloImageBlob = await hotelosloData.blob()
    return Buffer.from(await hotelosloImageBlob.arrayBuffer())
}