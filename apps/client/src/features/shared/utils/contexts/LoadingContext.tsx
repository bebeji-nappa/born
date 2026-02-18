"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type LoadingContextType = {
  isGlobalLoading: boolean;
  setIsGlobalLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ isGlobalLoading, setIsGlobalLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
