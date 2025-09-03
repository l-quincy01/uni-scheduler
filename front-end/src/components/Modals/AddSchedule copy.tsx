import React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CalendarFold } from "lucide-react";

export interface exams {
  title: string;
  date: string;
  time: string;
}
export interface moduleItem {
  category: string;
  exams: exams[];
}

export interface AddScheduleProps {
  modules: moduleItem[];
  heading?: string;
}

export default function AddSchedule({ modules, heading }: AddScheduleProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="gap-2 flex flex-col w-full">
        <Label htmlFor="Schedule Name">Schedule Name</Label>
        <Input
          className="w-1/2"
          id="Schedule Name"
          type="text"
          placeholder="Schedule name"
        />
      </div>

      <div className="flex flex-row gap-1 items-center">
        <div className="font-semibold text-sm">
          {heading ?? "Choose Your Modules"}
        </div>

        <Select>
          <SelectTrigger className="">
            <SelectValue placeholder="Select your courses" />
          </SelectTrigger>
          <SelectContent>
            <Command>
              <CommandInput placeholder="Search Modules.." />
              <CommandList className="scrollbar-hide">
                <CommandEmpty>No results found.</CommandEmpty>

                {modules.map((mod, index) => (
                  <>
                    <CommandGroup key={index} heading={mod.category}>
                      {mod.exams.map((exam, index) => (
                        <CommandItem
                          key={index}
                          className="flex flex-col justify-start items-start gap-1 text-[0.5rem] "
                        >
                          <span className="line-clamp-2 max-w-[16rem]">
                            {exam.title}
                          </span>
                          <div className="flex flex-row gap-1">
                            {" "}
                            <span className="font-semibold">{exam.date}</span>
                            <span className="font-semibold">{exam.time}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                ))}
              </CommandList>
            </Command>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">Modules</div>
      {/* <span className="text-sm text-muted-foreground self-center">
        Nothing added
      </span> */}
      <div className=" space-x-2 space-y-2">
        <Badge className="truncate" variant="secondary">
          MAT301
        </Badge>
        <Badge className="truncate" variant="secondary">
          Psychology 211
        </Badge>
        <Badge className="truncate" variant="secondary">
          Organisational Psychology Honours - Occupational Health & Wellbeing
        </Badge>
        <Badge className="truncate" variant="secondary">
          MAT301
        </Badge>
        <Badge className="truncate" variant="secondary">
          PS 211
        </Badge>{" "}
        <Badge className="truncate" variant="secondary">
          CS112
        </Badge>
        <Badge className="truncate" variant="secondary">
          Psychology 211
        </Badge>
      </div>

      <div className="w-full gap-8 justify-between">
        <Button
          variant="secondary"
          className="flex flex-row gap-1 items-center cursor-pointer"
        >
          {" "}
          <CalendarFold size={14} /> Create Schedule
        </Button>
      </div>
    </div>
  );
}
