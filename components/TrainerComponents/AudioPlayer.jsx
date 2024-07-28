import { cn } from "@lib/utils";
import { useEffect, useRef } from "react";

const AudioPlayer = ({ url, className, muted }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && url) {
      audioRef.current.srcObject = url;
    }
  }, [url]);

  return (
    <audio
      ref={audioRef}
      muted={muted}
      autoPlay
      className={cn("", className)}
    />
  );
};

export default AudioPlayer;
