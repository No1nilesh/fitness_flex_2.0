import { useMemo } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useMediaSoupSocket() {
  const mediaSoupSocket = useMemo(
    () => io("http://localhost:3001/mediasoup"),
    []
  );

  return mediaSoupSocket;
}
