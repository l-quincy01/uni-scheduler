// src/App.tsx
import { Route, Routes } from "react-router";
import { ThemeProvider } from "./providers/theme/theme-provider";

import DashboardPage from "@/_pages/ProtectedShell/dashboard/DashboardPage";
import CalendarPage from "@/_pages/ProtectedShell/calendar/CalendarPage";
import ProfilePage from "@/_pages/ProtectedShell/profile/ProfilePage";

import { GuestOnly, RequireAuth } from "./Auth/RouteGuard";
import ProtectedAppShell from "./Auth/ProtectedShell";
import { AuthProvider } from "./Auth/AuthContext";
import IndexPage from "@/_pages/Public/IndexPage";
import AuthPage from "@/_pages/Public/AuthPage";
import ContentPage from "@/_pages/ProtectedShell/content/ContentPage";
import ContentIndex from "@/_pages/ProtectedShell/content/Index";
import ContentGridPage from "@/_pages/ProtectedShell/content/ContentGridPage";
import ExamContentView from "@/_pages/ProtectedShell/content/examView/ExamContentView";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public */}
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

              <Route path="schedule/:scheduleId" element={<ContentIndex />}>
                <Route index element={<ContentPage />} />
                <Route path=":examForeignKey" element={<ContentGridPage />} />
                <Route
                  path=":examForeignKey/:contentID"
                  element={<ExamContentView />}
                />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<IndexPage />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}
