"use client";

import { Link, Outlet, useLocation } from "react-router";
import { SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Index() {
  const location = useLocation();

  // Split path into segments
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {pathnames.map((segment, index) => {
            const to = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            return (
              <BreadcrumbItem key={to}>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{segment}</Link>
                  </BreadcrumbLink>
                )}
                {!isLast && (
                  <BreadcrumbSeparator>
                    <SlashIcon className="w-3 h-3" />
                  </BreadcrumbSeparator>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <Outlet />
    </div>
  );
}
