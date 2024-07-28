"use client";
import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export function SocketProvider({ children }) {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const socket = useMemo(() => {
    if (email) {
      return io("http://localhost:3001", { query: { email } });
    }
  }, [email]); // Connect to Socket.IO server

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
