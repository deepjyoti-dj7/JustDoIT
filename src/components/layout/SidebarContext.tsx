import { createContext, useContext } from "react";

interface SidebarContextType {
  expandSection: string | null;
  setExpandSection: (href: string | null) => void;
  openMobileSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  expandSection: null,
  setExpandSection: () => {},
  openMobileSidebar: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);
