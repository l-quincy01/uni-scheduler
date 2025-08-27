import { Route, Routes } from "react-router";
import "./App.css";
import Home from "@/pages/Home/Home";
import Layout from "@/app/Layout";
import { ThemeProvider } from "./providers/theme/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
