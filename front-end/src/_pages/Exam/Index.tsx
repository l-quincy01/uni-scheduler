"use client";

import { Link, Outlet, useLocation } from "react-router";
import { Archive, CalendarFold, Kanban, Plus, SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddSchedule from "@/components/Modals/AddSchedule";
import AddExamModal from "@/components/Modals/AddExamModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContentPanel } from "@/_app/Context/ContentPanelContext";
import { useCourseCalendar } from "@/_app/Context/CourseCalendarContext";

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
  const { isContentPanelOpen, setIsContentPanelOpen } = useContentPanel();

  const { isCourseCalendarOpen, setCourseCalendarOpen } = useCourseCalendar();

  const location = useLocation();

  const allSegments = location.pathname.split("/").filter(Boolean);

  const objectId = allSegments.find(isObjectId);

  const visibleSegments = allSegments.filter((seg) => !isObjectId(seg));
  // console.log("Last segment:" + );

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

  function getLocationBase(s: string) {
    let base = "";
    let seenCount = 0;

    for (const c of s) {
      if (c !== "/") {
        base += c;
      } else {
        seenCount++;
      }

      if (seenCount > 1) {
        break;
      }
    }

    return base;
  }

  const pathnameLastSegment = visibleSegments[visibleSegments.length - 1];

  function renderNav() {
    switch (pathnameLastSegment) {
      case "content":
        return (
          <div className="flex flex-row gap-1">
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`hover:bg-muted p-2 rounded-full ${
                    isCourseCalendarOpen ? "bg-muted" : ""
                  }`}
                  onClick={() => setCourseCalendarOpen((p) => !p)}
                >
                  {isCourseCalendarOpen ? (
                    <Kanban size={18} />
                  ) : (
                    <CalendarFold size={18} />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isCourseCalendarOpen ? (
                  <span>View Kanban</span>
                ) : (
                  <span>View Calendar</span>
                )}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                {" "}
                <div
                  className={`hover:bg-muted p-2 rounded-full ${
                    isContentPanelOpen ? "bg-muted" : ""
                  }`}
                  onClick={() => setIsContentPanelOpen((p) => !p)}
                >
                  <Archive size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Content for this exam</TooltipContent>
            </Tooltip>

            <Dialog>
              <DialogTrigger>
                <Button variant="secondary">
                  Exam
                  <Plus size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="scale-90">
                <AddExamModal />
              </DialogContent>
            </Dialog>
          </div>
        );
      case "calendar":
        return <span>Calendar</span>;
      case "profile":
        return <span>Profile</span>;
      default:
        return <></>;
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
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
        {renderNav()}
      </div>

      <Outlet />
    </div>
  );
}
