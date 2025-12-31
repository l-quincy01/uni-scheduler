"use client";

import { Plus, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import AddScheduleLoader from "../Modals/ExamSchedule/AddScheduleLoader";

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
          <Dialog>
            <DialogTrigger>
              <div className="rounded-full p-1 border cursor-pointer hover:bg-accent">
                <Plus size={12} />
              </div>
            </DialogTrigger>
            <DialogContent className="scale-90">
              <AddScheduleLoader />
            </DialogContent>
          </Dialog>
        </div>{" "}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Link to={`schedule/${item.id}`}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
