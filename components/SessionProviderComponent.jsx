"use client";
import { SessionProvider } from "next-auth/react";

const SessionProviderComponent = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviderComponent;
