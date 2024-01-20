import { cn } from "@/lib/utils"
import Image from "next/image"

interface PostImagesProps {
  images: string[]
}

const PostImages: React.FC<PostImagesProps> = ({ images }) => {
  return (
    <div className="grid grid-flow-col w-full justify-stretch gap-4 divide-y">
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "relative aspect-video",
            images.length > 1 && "aspect-square xl:aspect-video"
          )}
        >
          <Image src={image} fill alt="post" className="rounded-3xl" />
        </div>
      ))}
    </div>
  )
}

export default PostImages
