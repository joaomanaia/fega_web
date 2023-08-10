export const dynamic = "force-dynamic"
export const revalidate = 2

export async function GET() {
  const cameraBaseUrl = "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG"
  const cameraUrl = `${cameraBaseUrl}?date=${Date.now()}`

  const res = await fetch(cameraUrl, {
    cache: "no-cache",
  })

  return res
}
