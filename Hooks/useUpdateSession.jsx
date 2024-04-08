"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useUpdateSession() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { update, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated" && !isInitialized) {
      update();
      setIsInitialized(true);
    }
  }, [sessionStatus, isInitialized, update]);

  return null;
}
