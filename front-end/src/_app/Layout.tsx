import SiteHeader from "@/components/site-header/site-header";
import React from "react";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 items-center">
        <div className="container  flex flex-col gap-x-4   pl-1 pr-4  ">
          <SiteHeader />

          <Outlet />
        </div>
      </div>
    </div>
  );
}
