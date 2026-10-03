import type { Metadata } from "@/types/metadata";
import { ImageIcon } from "lucide-react";

type Props = {
  b64?: Metadata["image_b64"],
  handleBlob: (blob: Blob | null) => void
}

const NovelImage = ({ b64, handleBlob }: Props) => {

  const handleCover = async (image: HTMLImageElement) => {
    if (!image.complete || image.naturalWidth === 0) {
      return;
    }

    const offscreen = new OffscreenCanvas(
      image.naturalWidth,
      image.naturalHeight
    );

    const ctx = offscreen.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(image, 0, 0);

    const blob = await offscreen.convertToBlob({
      type: "image/webp",
      quality: 0.75,
    });

    handleBlob(blob);
  };

  return (
    <div className="w-22 h-[132px] border relative flex items-center justify-center">
      <ImageIcon className="absolute z-[1] text-muted-foreground" />
      <img
        className="object-cover w-full h-full absolute inset-0 z-10"
        src={`data:image/*;base64,${b64}`}
        onLoad={(e) => handleCover(e.currentTarget)}
      />
    </div>
  )
}

export default NovelImage;
