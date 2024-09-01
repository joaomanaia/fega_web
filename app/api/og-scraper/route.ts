import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import ogs from "open-graph-scraper"

export type OgDataResponse = {
  ogTitle: string
  ogDescription: string
}

const urlSchema = z.string().url()

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return new NextResponse("URL is required", { status: 400 })
  }

  try {
    urlSchema.parse(url)
  } catch (error) {
    return new NextResponse("Invalid URL", { status: 400 })
  }

  try {
    const data = await ogs({ url: url })
    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
