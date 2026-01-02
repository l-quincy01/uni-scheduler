// src/App.tsx
import { Route, Routes } from "react-router";
import { ThemeProvider } from "./providers/theme/theme-provider";

import { GuestOnly, RequireAuth } from "./Auth/RouteGuard";
import ProtectedAppShell from "./Auth/ProtectedShell";
import { AuthProvider } from "./Auth/AuthContext";
import IndexPage from "@/pages/Public/IndexPage";
import AuthPage from "@/pages/Public/AuthPage";
import ContentPage from "@/pages/Private/content/ContentPage";
import ContentIndex from "@/pages/Private/content/Index";
import ContentGridPage from "@/pages/Private/content/ContentGridPage";
import ExamContentView from "@/pages/Private/content/examView/ExamContentView";
import DashboardPage from "@/pages/Private/Dashboard/DashboardPage";
import CalendarPage from "@/pages/Private/Calendar/CalendarPage";
import ProfilePage from "@/pages/Private/Profile/ProfilePage";

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
