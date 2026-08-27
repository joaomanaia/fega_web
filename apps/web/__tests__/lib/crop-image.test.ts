import { describe, expect, it, spyOn } from "bun:test"
import { convertCanvasToCompressedBlob, isValidSize } from "@/lib/crop-image"

describe("isValidSize", () => {
  it("should return true when blob size is less than max size", async () => {
    const blob = new Blob(["test"], { type: "text/plain" })
    const maxSize = 1024
    expect(isValidSize(blob, maxSize)).toBe(true)
  })

  it("should return true when blob size equals max size", async () => {
    const blob = new Blob(["x".repeat(1024)], { type: "text/plain" })
    const maxSize = 1024
    expect(isValidSize(blob, maxSize)).toBe(true)
  })

  it("should return false when blob size exceeds max size", async () => {
    const blob = new Blob(["x".repeat(2048)], { type: "text/plain" })
    const maxSize = 1024
    expect(isValidSize(blob, maxSize)).toBe(false)
  })

  it("should handle empty blob", async () => {
    const blob = new Blob([], { type: "text/plain" })
    const maxSize = 1024
    expect(isValidSize(blob, maxSize)).toBe(true)
  })
})

describe("convertCanvasToCompressedBlob", () => {
  const createMockCanvas = (width: number, height: number) => {
    // Lightweight canvas mock that works in bun:test without DOM
    const canvas = {
      width,
      height,
      getContext: () => ({}),
      toBlob(callback: BlobCallback, _type?: string, _quality?: number) {
        callback(new Blob(["x".repeat(100)], { type: "image/jpeg" }))
      },
    } as unknown as HTMLCanvasElement
    return canvas
  }

  it("should compress image to valid size", async () => {
    const canvas = createMockCanvas(100, 100)

    const maxSizeInBytes = 500 * 1024

    const blob = await convertCanvasToCompressedBlob(canvas, maxSizeInBytes)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe("image/jpeg")
    expect(blob.size).toBeLessThanOrEqual(maxSizeInBytes)
  })

  it("should throw error if blob creation fails", async () => {
    const canvas = createMockCanvas(0, 0)
    spyOn(canvas, "toBlob").mockImplementation((callback: BlobCallback) => callback(null))

    const maxSizeInBytes = 1024

    expect(convertCanvasToCompressedBlob(canvas, maxSizeInBytes)).rejects.toThrow(
      "Failed to create blob from canvas",
    )
  })

  it("should throw error if cannot compress to target size", async () => {
    const canvas = createMockCanvas(5000, 5000)
    spyOn(canvas, "toBlob").mockImplementation((callback: BlobCallback) =>
      callback(new Blob(["x".repeat(2048)], { type: "image/jpeg" })),
    )

    const maxSizeInBytes = 1024

    expect(convertCanvasToCompressedBlob(canvas, maxSizeInBytes)).rejects.toThrow(
      "Could not compress image to target size",
    )
  })

  it("should attempt multiple compression levels", async () => {
    const canvas = createMockCanvas(200, 200)
    const toBlobSpy = spyOn(canvas, "toBlob")

    const maxSizeInBytes = 1024

    toBlobSpy.mockImplementationOnce((callback: BlobCallback) => {
      callback(new Blob(["x".repeat(maxSizeInBytes + 1)]))
    })

    try {
      await convertCanvasToCompressedBlob(canvas, maxSizeInBytes)
    } catch {
      // Ignore
    }

    expect(toBlobSpy).toHaveBeenCalled()
    const qualitiesWithUndefined = toBlobSpy.mock.calls.map((call) => call[2])
    const qualities = qualitiesWithUndefined.filter((q): q is number => typeof q === "number")
    expect(qualities.length).toBeGreaterThan(1)
    expect(qualities[0]!).toBeGreaterThan(qualities[qualities.length - 1]!)
  })
})
