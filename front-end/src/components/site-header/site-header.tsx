import { useLocation } from "react-router";
import { ModeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Archive } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContentPanel } from "@/app/Context/ContentPanelContext";
import Logout from "../authentication/logout";

export default function SiteHeader() {
  const { isContentPanelOpen, toggleContentPanel, setIsContentPanelOpen } =
    useContentPanel();

  const location = useLocation();

  const pathname = location.pathname;

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

  const pathnameBase = getLocationBase(pathname);
  console.log(pathnameBase);
  function renderHeaderTitle() {
    switch (pathnameBase) {
      case "exam":
        return (
          <div className="w-full flex flex-row justify-between items-center">
            <h1 className="text-base font-medium"> </h1>
            <div>
              {/* <Tooltip>
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
              </Tooltip> */}
            </div>
          </div>
        );
      case "calendar":
        return <span>Calendar</span>;
      case "profile":
        return <span>Profile</span>;
      default:
        return <h1 className="text-base font-medium">Home</h1>;
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {renderHeaderTitle()}
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Logout />
        </div>
      </div>
    </header>
  );
}
