"use client"

import { SessionProvider } from "next-auth/react";
import React, { type ReactNode, FC } from "react";

interface providerProps {
  children: ReactNode
}

const Provider: FC<providerProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
