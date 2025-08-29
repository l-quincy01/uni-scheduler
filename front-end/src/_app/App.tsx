import { Route, Routes } from "react-router";

import Layout from "@/_app/Layout";
import { ThemeProvider } from "./providers/theme/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import CalendarPage from "@/_pages/Calendar/CalendarPage";
import DashboardPage from "@/_pages/Dashboard/DashboardPage";

import ProfilePage from "@/_pages/Profile/ProfilePage";
import SchedulePage from "@/_pages/Exam/ExamPage";
import ExamPage from "@/_pages/Exam/ExamPage";

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
              <Route index element={<DashboardPage />}></Route>

              <Route path="/exam/*" element={<ExamPage />}></Route>
              <Route path="/calendar" element={<CalendarPage />}></Route>

              <Route path="/profile" element={<ProfilePage />}></Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}

export default App;
