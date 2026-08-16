import type { Area } from "react-easy-crop"

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous") // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
interface FlipOptions {
  horizontal: boolean
  vertical: boolean
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  maxFileSizeInBytes: number,
  rotation = 0,
  flip: FlipOptions = { horizontal: false, vertical: false }
): Promise<Blob> {
  try {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Browser does not support 2d canvas context")
    }

    // Calculate rotated dimensions
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)

    // Set initial canvas size
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // Save context state and apply transformations
    ctx.save()
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(getRadianAngle(rotation))
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)
    ctx.drawImage(image, 0, 0)
    ctx.restore()

    // Create and setup cropped canvas
    const croppedCanvas = document.createElement("canvas")
    const croppedCtx = croppedCanvas.getContext("2d")

    if (!croppedCtx) {
      throw new Error("Browser does not support 2d canvas context")
    }

    croppedCanvas.width = pixelCrop.width
    croppedCanvas.height = pixelCrop.height
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert to blob with progressive quality reduction
    return await convertCanvasToCompressedBlob(croppedCanvas, maxFileSizeInBytes)
  } catch (error) {
    throw new Error(
      `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

/**
 * Creates an optimized JPEG blob from a canvas element by iteratively reducing quality until size constraints are met
 * @param canvas - The HTML canvas element to convert to a blob
 * @param startQuality - Initial JPEG quality value between 0.0 and 1.0 (default: 1.0)
 * @returns Promise that resolves with the optimized image blob
 * @throws Error if blob creation fails or if image cannot be compressed to target size
 */
export async function convertCanvasToCompressedBlob(
  canvas: HTMLCanvasElement,
  maxFileSizeInBytes: number
): Promise<Blob> {
  let quality = 0.9

  while (quality >= MIN_QUALITY) {
    const blob = await new Promise<Blob | null>((resolve) => {
      // console.log(`Trying quality: ${quality}`)
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    })

    if (!blob) {
      throw new Error("Failed to create blob from canvas")
    }

    if (isValidSize(blob, maxFileSizeInBytes)) {
      // console.log(`Image compressed to ${blob.size} bytes with quality: ${quality}`)
      return blob
    }

    quality *= 1 - QUALITY_STEP
  }

  throw new Error("Could not compress image to target size")
}

/**
 * @param blob The image blob to check
 * @param maxSize The maximum allowed size in bytes
 * @returns Promise that resolves with a boolean indicating whether the blob is smaller than the maximum size
 */
export function isValidSize(blob: Blob, maxSize: number): boolean {
  return blob.size <= maxSize
}

const QUALITY_STEP = 0.2
const MIN_QUALITY = 0.05
