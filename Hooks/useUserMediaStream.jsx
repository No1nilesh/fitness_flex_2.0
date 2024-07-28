"use client";
import { useRef, useState, useEffect } from "react";

const useUserMediaStream = () => {
  const [state, setState] = useState(null);
  const isStreamSet = useRef(false);
  useEffect(() => {
    async function initStream() {
      if (isStreamSet.current) return;
      isStreamSet.current = true;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("setting your stream");
        setState(stream);
      } catch (error) {
        console.error(`Error in media navigator, ${error}`);
      }
    }

    initStream();
  }, []);

  return { stream: state };
};

export default useUserMediaStream;
