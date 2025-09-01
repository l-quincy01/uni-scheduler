import { Route, Routes } from "react-router";

import Layout from "@/_app/Layout";
import { ThemeProvider } from "./providers/theme/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import CalendarPage from "@/_pages/Calendar/CalendarPage";
import DashboardPage from "@/_pages/Dashboard/DashboardPage";

import ProfilePage from "@/_pages/Profile/ProfilePage";

import ExamPage from "@/_pages/Exam/ExamPage";
import ExamAgenda from "@/_pages/Exam/agenda/ExamAgenda";
import ExamContent from "@/_pages/Exam/content/ExamContent";
import Index from "@/_pages/Exam/Index";
import ExamContentView from "@/_pages/Exam/content/ExamContentView";
import { ContentPanelProvider } from "./Context/ContentPanelContext";

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
        <ContentPanelProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />}></Route>

                <Route path="/calendar" element={<CalendarPage />}></Route>

                <Route path="/profile" element={<ProfilePage />}></Route>

                <Route path="exam/:id" element={<Index />}>
                  <Route index element={<ExamPage />}></Route>
                  <Route path="agenda" element={<ExamAgenda />} />
                  <Route path="content" element={<ExamContent />} />
                  <Route path="content/*" element={<ExamContentView />} />
                </Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </ContentPanelProvider>
      </SidebarProvider>
    </>
  );
}

export default App;
