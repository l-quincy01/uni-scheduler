"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarDays,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  LibraryBig,
  Map,
  MessageCircle,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavSchedule } from "@/components/sidebar/nav-schedule";
import { NavProjects } from "@/components/sidebar/nav-projects";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { Link } from "react-router";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      title: "Calendar",
      url: "/calendar",
      icon: <CalendarDays size={18} />,
    },
  ],
  navSchedule: [
    {
      title: "Final year exams",
      url: "#",

      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuItem className="flex flex-row">
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <Link to="/">
              <span className="font-bold text-xl">Exam Scheduler</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSchedule items={data.navSchedule} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
