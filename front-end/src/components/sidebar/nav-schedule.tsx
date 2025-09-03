"use client";

import { ChevronRight, Plus, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
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
import { Button } from "../ui/button";
import AddSchedule from "../Modals/AddSchedule";

export function NavSchedule({
  items,
}: {
  items: {
    id: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div className="flex flex-row justify-between items-center w-full">
          Schedules
          {/* <div className="rounded-full p-1 border cursor-pointer hover:bg-accent">
            <Plus size={12} />
          </div> */}
          <Dialog>
            <DialogTrigger>
              <div className="rounded-full p-1 border cursor-pointer hover:bg-accent">
                <Plus size={12} />
              </div>
            </DialogTrigger>
            <DialogContent className="scale-90">
              <AddSchedule
                heading="Select Your Exam Modules"
                modules={dummyModules}
              />
            </DialogContent>
          </Dialog>
        </div>{" "}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Link to={`${item.url}/${item.id}`}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {/* {item.icon && <item.icon />} */}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const dummyModules = [
  {
    category: "Psychology",
    exams: [
      {
        title: "Masters in Counselling Psychology Paper 1: Assessment",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title:
          "Organisational Psychology Honours - Occupational Health & Wellbeing",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title: "Psychology 202 Paper 2",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
    ],
  },
  {
    category: "Math",
    exams: [
      {
        title: "Mat314",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title: "Mat301",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
      {
        title: "Mat202",
        date: "Thu - 23 October 2025",
        time: "AM (09H00)",
      },
    ],
  },
];
