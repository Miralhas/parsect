export const processImageCover = async (
  image: HTMLImageElement
) => {
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

  return blob;
};

export const b64ToBlob = async (b64: string): Promise<Blob | undefined> => {
  return fetch(`data:image/webp;base64,${b64}`).then(res => res.blob());
};