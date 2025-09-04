// src/App.tsx
import { Route, Routes } from "react-router";
import { ThemeProvider } from "./providers/theme/theme-provider";

import DashboardPage from "@/_pages/Dashboard/DashboardPage";
import CalendarPage from "@/_pages/Calendar/CalendarPage";
import ProfilePage from "@/_pages/Profile/ProfilePage";
import ExamPage from "@/_pages/Exam/ExamPage";
import ExamAgenda from "@/_pages/Exam/agenda/ExamAgenda";
import ExamContent from "@/_pages/Exam/content/ExamContent";
import Index from "@/_pages/Exam/Index";
import ExamContentView from "@/_pages/Exam/content/ExamContentView";
import { GuestOnly, RequireAuth } from "./Auth/RouteGuard";
import ProtectedAppShell from "./Auth/ProtectedShell";
import { AuthProvider } from "./Auth/AuthContext";
import IndexPage from "@/_pages/Public/IndexPage";
import AuthPage from "@/_pages/Public/AuthPage";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public-only */}
          <Route element={<GuestOnly />}>
            <Route path="/landing" element={<IndexPage />} />
            <Route path="/signin" element={<AuthPage />} />
          </Route>

          {/* Protected */}
          <Route element={<RequireAuth />}>
            <Route element={<ProtectedAppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="exam/:id" element={<Index />}>
                <Route index element={<ExamPage />} />
                <Route path="agenda" element={<ExamAgenda />} />
                <Route path="content" element={<ExamContent />} />
                <Route path="content/*" element={<ExamContentView />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<IndexPage />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}
