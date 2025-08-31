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

function isObjectId(segment: string) {
  return /^[0-9a-fA-F]{24}$/.test(segment);
}

function titleCase(s: string) {
  if (s == "content") {
    return "Practice Exams ";
  } else {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export default function Index() {
  const location = useLocation();

  const allSegments = location.pathname.split("/").filter(Boolean);

  const objectId = allSegments.find(isObjectId);

  const visibleSegments = allSegments.filter((seg) => !isObjectId(seg));

  const buildHref = (visibleIndex: number) => {
    const parts: string[] = [];
    for (let i = 0; i <= visibleIndex; i++) {
      parts.push(visibleSegments[i]);
      if (visibleSegments[i] === "exam" && objectId) {
        parts.push(objectId);
      }
    }
    return "/" + parts.join("/");
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {visibleSegments.map((segment, index) => {
            const to = buildHref(index);
            const isLast = index === visibleSegments.length - 1;

            return (
              <BreadcrumbItem key={to}>
                {isLast ? (
                  <BreadcrumbPage>{titleCase(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to}>{titleCase(segment)}</Link>
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
