import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

interface PostImagesProps {
  images: string[]
}

const PostImages: React.FC<PostImagesProps> = ({ images }) => {
  return (
    <div className="grid w-full grid-flow-col justify-stretch gap-4 divide-y">
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "relative aspect-video",
            images.length > 1 && "aspect-square xl:aspect-video"
          )}
        >
          <Image itemProp="image" src={image} fill alt="post" className="rounded-3xl" />
        </div>
      ))}
    </div>
  )
}

export default PostImages
