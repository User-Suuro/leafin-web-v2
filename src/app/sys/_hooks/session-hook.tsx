"use client";

import { createContext, useContext } from "react";

export const SessionContext = createContext<any>(null);

export function useSession() {
  return useContext(SessionContext);
}
