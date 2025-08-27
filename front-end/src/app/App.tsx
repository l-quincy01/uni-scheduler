import { Route, Routes } from "react-router";

import Home from "@/pages/Home/Home";
import Layout from "@/app/Layout";
import { ThemeProvider } from "./providers/theme/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

function App() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />}></Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </SidebarProvider>
    </>
  );
}

export default App;
