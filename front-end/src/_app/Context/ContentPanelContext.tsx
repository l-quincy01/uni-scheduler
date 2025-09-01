"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContentPanelContextType {
  isContentPanelOpen: boolean;
  setIsContentPanelOpen: (open: boolean) => void;
  toggleContentPanel: () => void;
}

const ContentPanelContext = createContext<ContentPanelContextType | undefined>(
  undefined
);

export function ContentPanelProvider({ children }: { children: ReactNode }) {
  const [isContentPanelOpen, setIsContentPanelOpen] = useState(false);

  const toggleContentPanel = () => setIsContentPanelOpen((prev) => !prev);

  return (
    <ContentPanelContext.Provider
      value={{ isContentPanelOpen, setIsContentPanelOpen, toggleContentPanel }}
    >
      {children}
    </ContentPanelContext.Provider>
  );
}

export function useContentPanel() {
  const context = useContext(ContentPanelContext);
  if (!context) {
    throw new Error(
      "useContentPanel must be used within a ContentPanelProvider"
    );
  }
  return context;
}
