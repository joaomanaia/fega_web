export async function GET() {
  const cameraBaseUrl = "http://hoteloslo-coimbra.dnsalias.com:50000/SnapshotJPEG"
  const cameraUrl = `${cameraBaseUrl}?date=${Date.now()}`

  return await fetch(cameraUrl)
}
