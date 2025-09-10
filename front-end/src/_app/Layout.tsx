import SiteHeader from "@/components/site-header/site-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { Outlet, useLocation } from "react-router";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import AddScheduleLoader from "@/components/Modals/ExamSchedule/AddScheduleLoader";

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 items-center">
        <div className="container gap-y-4  flex flex-col gap-x-4   pl-1 pr-4  ">
          <SiteHeader />

          <div className="px-8">
            {pathname === "/" ? (
              <div className="flex flex-row justify-end">
                <Dialog>
                  <DialogTrigger>
                    <Button variant="secondary">
                      Schedule <Plus size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="scale-90">
                    {/*Modules are auto populated from the data scrapped */}
                    <AddScheduleLoader />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <></>
            )}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
