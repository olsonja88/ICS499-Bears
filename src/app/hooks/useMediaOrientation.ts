import { useEffect, useState } from "react";

export function useMediaOrientation(url: string): "portrait" | "landscape" | null {
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | null>(null);

  useEffect(() => {
    if (!url) return;

    const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

    if (isVideo) {
      const video = document.createElement("video");
      video.src = url;
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const ratio = video.videoHeight / video.videoWidth;
        setOrientation(ratio > 1 ? "portrait" : "landscape");
      };
    } else {
      const img = new window.Image();
      img.src = url;

      img.onload = () => {
        const ratio = img.naturalHeight / img.naturalWidth;
        setOrientation(ratio > 1 ? "portrait" : "landscape");
      };
    }
  }, [url]);

  return orientation;
}
