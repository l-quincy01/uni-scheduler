import React from "react";
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { CourseCalendarProvider } from "../Context/CourseCalendarContext";
import { ContentPanelProvider } from "../Context/ContentPanelContext";

export default function ProtectedAppShell() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 52)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" collapsible="icon" />
      <CourseCalendarProvider>
        <ContentPanelProvider>
          <Outlet />
        </ContentPanelProvider>
      </CourseCalendarProvider>
    </SidebarProvider>
  );
}
