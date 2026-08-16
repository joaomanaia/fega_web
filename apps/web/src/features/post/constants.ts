export const ITEMS_PER_PAGE = 7

// File upload
// export const MAX_IMAGE_SIZE_IN_KB = 500

/**
 * Maximum image size for each type in Bytes
 */
export const MAX_IMAGE_SIZE_FOR_TYPE = {
  avatar: 512 * 1024, // 512KB
}

export type ImageType = keyof typeof MAX_IMAGE_SIZE_FOR_TYPE
