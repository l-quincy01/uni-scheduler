"use client";

import * as React from "react";
import { CalendarDays, LayoutDashboard } from "lucide-react";

import { NavSchedule } from "@/components/sidebar/nav-schedule";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

import { Link } from "react-router";
import { NavMain } from "./nav-main";
import type { User } from "@/_api/Auth/users";
import { getUser } from "@/_api/Auth/users";
import { getNavSchedules } from "@/_api/schedules.api";

interface navSchedule {
  id: string;
  title: string;
  url: "/exam";
  isActive: boolean;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
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
      id: "651f3c2e9a7b4c1234567890",
      title: "Final year exams",
      url: "/exam",
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null);
  const [navSchedules, setNavSchedules] = React.useState<navSchedule[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUser();
        const s = await getNavSchedules();

        if (mounted) {
          setUser(u[0] ?? null);
          setNavSchedules(s);
        }
      } catch (e) {
        if (mounted) setUser(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const user_data = {
    name: user
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User"
      : "User",
    email: user?.email ?? "",
    avatar: user?.avatarUrl ?? "",
  };

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
        <NavSchedule items={navSchedules} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user_data} />
      </SidebarFooter>
    </Sidebar>
  );
}
