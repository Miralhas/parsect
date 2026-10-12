import { useParserProvider } from "@/contexts/parser-context";
import { processImageCover } from "@/lib/utils/image-utils";
import { CameraIcon, ImageOffIcon } from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent } from "react";

const NovelImage = () => {
  const { cover, handleCover } = useParserProvider();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const imgSrc = useMemo(() => {
    if (!cover) return undefined;
    return URL.createObjectURL(cover);
  }, [cover]);

  const handleChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setLoaded(false);
      handleCover(file);
    }
  }

  const handleLoad = async (image: HTMLImageElement) => {
    const blob = await processImageCover(image);
    handleCover(blob);
    setLoaded(true);
  }

  return (
    <div
      className="w-22 h-[132px] border relative cursor-pointer group transition-all"
      onClick={() => imageInputRef?.current?.click()}
    >
      {!cover ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOffIcon className="text-muted-foreground transition-opacity duration-300 group-hover:opacity-0 opacity-100" />
        </div>
      ) : (
        <img
          className="object-cover w-full h-full absolute inset-0"
          src={imgSrc}
          onLoad={async (e) => !loaded ? handleLoad(e.currentTarget) : null}
        />
      )}
      <input
        type="file"
        accept="image/*"
        className="absolute -top-999"
        ref={imageInputRef}
        onChange={handleChange}
      />
      <div className="absolute inset-0 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-black/70 grid place-items-center">
        <CameraIcon className="text-foreground/70" />
      </div>
    </div>
  )
}

export default NovelImage;
