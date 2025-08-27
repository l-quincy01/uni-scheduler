import SiteHeader from "@/components/site-header/site-header";
import React from "react";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className=" mx-auto container px-4 md:px-12 flex-1 bg-background h-screen w-screen ">
      <SiteHeader />
      <Outlet />
    </div>
  );
}
