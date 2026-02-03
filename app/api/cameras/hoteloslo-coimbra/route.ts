export async function GET() {
  const cameraBaseUrl = "https://rooftop.tryfail.net:50000/image.jpeg"
  const cameraUrl = `${cameraBaseUrl}?date=${Date.now()}`

  const res = await fetch(cameraUrl, {
    cache: "no-cache",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "image/jpeg",
      "Access-Control-Allow-Origin": "*",
    },
  })

  return res
}
