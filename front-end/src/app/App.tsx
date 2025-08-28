import { Route, Routes } from "react-router";

import Home from "@/pages/Home/Home";
import Layout from "@/app/Layout";
import { ThemeProvider } from "./providers/theme/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import CalendarPage from "@/pages/Calendar/CalendarPage";

function App() {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 52)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="floating" collapsible="icon" />
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />}></Route>
              <Route path="/calendar" element={<CalendarPage />}></Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}

export default App;
