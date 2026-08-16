import { setupJestCanvasMock } from "jest-canvas-mock"
import { convertCanvasToCompressedBlob, isValidSize } from "@/lib/crop-image"

describe("isValidSize", () => {
  it("should return true when blob size is less than max size", async () => {
    const blob = new Blob(["test"], { type: "text/plain" }) // Small blob ~4 bytes
    const maxSize = 1024 // 1KB
    expect(isValidSize(blob, maxSize)).toBe(true)
  })

  it("should return true when blob size equals max size", async () => {
    const blob = new Blob(["x".repeat(1024)], { type: "text/plain" }) // 1KB blob
    const maxSize = 1024
    expect(isValidSize(blob, maxSize)).toBe(true)
  })

  it("should return false when blob size exceeds max size", async () => {
    const blob = new Blob(["x".repeat(2048)], { type: "text/plain" }) // 2KB blob
    const maxSize = 1024 // 1KB
    expect(isValidSize(blob, maxSize)).toBe(false)
  })

  it("should handle empty blob", async () => {
    const blob = new Blob([], { type: "text/plain" }) // Empty blob
    const maxSize = 1024
    expect(isValidSize(blob, maxSize)).toBe(true)
  })
})

describe("convertCanvasToCompressedBlob", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    setupJestCanvasMock()
  })

  const createMockCanvas = (width: number, height: number) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    return canvas
  }

  it("should compress image to valid size", async () => {
    // Create a 100x100 red canvas
    const canvas = createMockCanvas(100, 100)
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "red"
    ctx.fillRect(0, 0, 100, 100)

    const maxSizeInBytes = 500 * 1024 // 500KB

    const blob = await convertCanvasToCompressedBlob(canvas, maxSizeInBytes)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe("image/jpeg")
    expect(blob.size).toBeLessThanOrEqual(maxSizeInBytes)
  })

  it("should throw error if blob creation fails", async () => {
    const canvas = createMockCanvas(0, 0)
    jest.spyOn(canvas, "toBlob").mockImplementation((callback) => callback(null))

    const maxSizeInBytes = 1024 // 1KB

    await expect(convertCanvasToCompressedBlob(canvas, maxSizeInBytes)).rejects.toThrow(
      "Failed to create blob from canvas"
    )
  })

  it("should throw error if cannot compress to target size", async () => {
    const canvas = createMockCanvas(5000, 5000)
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "red"
    ctx.fillRect(0, 0, 5000, 5000)

    const maxSizeInBytes = 1024 // 1KB

    await expect(convertCanvasToCompressedBlob(canvas, maxSizeInBytes)).rejects.toThrow(
      "Could not compress image to target size"
    )
  })

  it("should attempt multiple compression levels", async () => {
    const canvas = createMockCanvas(200, 200)
    const toBlobSpy = jest.spyOn(canvas, "toBlob")

    const maxSizeInBytes = 1024 // 1KB

    // First call returns a large blob to trigger compression
    toBlobSpy.mockImplementationOnce((callback) => {
      callback(new Blob(["x".repeat(maxSizeInBytes + 1)]))
    })

    try {
      await convertCanvasToCompressedBlob(canvas, maxSizeInBytes)
    } catch {
      // Ignore error
    }

    expect(toBlobSpy).toHaveBeenCalled()
    const qualitiesWithUndefined = toBlobSpy.mock.calls.map((call) => call[2])
    const qualities = qualitiesWithUndefined.filter((q): q is number => typeof q === "number")
    expect(qualities.length).toBeGreaterThan(1)
    expect(qualities[0]).toBeGreaterThan(qualities[qualities.length - 1])
  })
})
